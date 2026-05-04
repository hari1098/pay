import { Hono } from "npm:hono@4.7.4";
import { cors } from "npm:hono@4.7.4/cors";
import { createClient } from "npm:@supabase/supabase-js@2.49.1";
import * as jose from "npm:jose@6.0.10";
import bcrypt from "npm:bcryptjs@2.4.3";

const JWT_SECRET_STRING = "paisaads-super-secret-jwt-key-2024";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseKey);
}

function parseCookies(cookieStr: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieStr) return cookies;
  cookieStr.split(";").forEach((pair: string) => {
    const [key, ...rest] = pair.split("=");
    if (key && rest.length) cookies[key.trim()] = rest.join("=").trim();
  });
  return cookies;
}

async function getUserFromCookie(c: any) {
  try {
    let token: string | null = null;

    // Get the raw Request object - Hono stores it differently in different versions
    const req: Request = c.req.raw ? c.req.raw : (c.req.request ? c.req.request : c.req);

    // Method 1: Authorization Bearer header
    const authHeader = req.headers?.get("authorization") || "";
    if (authHeader.startsWith("Bearer ")) {
      const bearerToken = authHeader.substring(7);
      if (bearerToken.split(".").length === 3) {
        token = bearerToken;
      }
    }

    // Method 2: Cookie header
    if (!token) {
      const cookieHeader = req.headers?.get("cookie") || "";
      const cookies = parseCookies(cookieHeader);
      token = cookies["token"] || null;
    }

    // Method 3: Custom header
    if (!token) {
      token = req.headers?.get("x-auth-token") || null;
    }

    if (!token) return null;
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload as { id: string; phone_number: string; role: string; phone_verified: boolean };
  } catch (e) {
    return null;
  }
}

const app = new Hono();

app.use("*", cors({
  origin: ["http://localhost:3000", "https://paisaads.in"],
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "X-Client-Info", "Apikey", "X-Auth-Token"],
}));

// Middleware to extract user from token
app.use("/paisaads-api/*", async (c, next) => {
  const user = await getUserFromCookie(c);
  c.set("user", user);
  await next();
});

// ============ AUTH ============

app.post("/paisaads-api/auth/login", async (c) => {
  try {
    const { phone_number, password } = await c.req.json();
    const supabase = getSupabaseClient();
    const { data: user, error } = await supabase
      .from("user")
      .select("id, name, email, phone_number, role, is_active, email_verified, phone_verified, password")
      .eq("phone_number", phone_number)
      .maybeSingle();

    if (error || !user) return c.json({ message: "Invalid credentials" }, 401);

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return c.json({ message: "Invalid credentials" }, 401);

    const token = await new jose.SignJWT({
      id: user.id, phone_number: user.phone_number, role: user.role, phone_verified: user.phone_verified,
    }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").setIssuedAt().sign(JWT_SECRET);

    const { password: _, ...userWithoutPassword } = user;
    return c.json({ user: userWithoutPassword, token }, 200, {
      "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`,
    });
  } catch (err) {
    return c.json({ message: "Login failed", error: String(err) }, 500);
  }
});

app.post("/paisaads-api/auth/logout", async (c) => {
  return c.json({ message: "Logged out" }, 200, { "Set-Cookie": "token=; HttpOnly; Path=/; Max-Age=0" });
});

app.post("/paisaads-api/auth/send-otp", async (c) => {
  try {
    const { phone_number } = await c.req.json();
    const otp_code = String(Math.floor(100000 + Math.random() * 900000));
    const supabase = getSupabaseClient();
    const { data: user } = await supabase.from("user").select("id").eq("phone_number", phone_number).maybeSingle();
    await supabase.from("otp").insert({ phone_number, otp_code, expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), user_id: user?.id });
    return c.json({ message: "OTP sent", otp: otp_code });
  } catch (err) {
    return c.json({ message: "Failed to send OTP", error: String(err) }, 500);
  }
});

app.post("/paisaads-api/auth/verify-otp", async (c) => {
  try {
    const { phone_number, otp_code } = await c.req.json();
    const supabase = getSupabaseClient();
    const { data: otp } = await supabase.from("otp").select("*").eq("phone_number", phone_number).eq("otp_code", otp_code).eq("is_verified", false).gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (!otp) return c.json({ message: "Invalid or expired OTP" }, 400);
    await supabase.from("otp").update({ is_verified: true }).eq("id", otp.id);
    const { data: user } = await supabase.from("user").select("id, name, email, phone_number, role, is_active, email_verified, phone_verified").eq("phone_number", phone_number).maybeSingle();
    if (!user) return c.json({ message: "User not found" }, 404);
    const token = await new jose.SignJWT({ id: user.id, phone_number: user.phone_number, role: user.role, phone_verified: true }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").setIssuedAt().sign(JWT_SECRET);
    return c.json({ user, token }, 200, { "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax` });
  } catch (err) {
    return c.json({ message: "OTP verification failed", error: String(err) }, 500);
  }
});

app.post("/paisaads-api/auth/send-verification-otp", async (c) => {
  const user = await c.get("user") || await getUserFromCookie(c);
  if (!user) return c.json({ message: "Unauthorized" }, 401);
  const otp_code = String(Math.floor(100000 + Math.random() * 900000));
  const supabase = getSupabaseClient();
  await supabase.from("otp").insert({ phone_number: user.phone_number, otp_code, expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), user_id: user.id, purpose: "VERIFICATION" });
  return c.json({ message: "Verification OTP sent", otp: otp_code });
});

app.post("/paisaads-api/auth/verify-account", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user) return c.json({ message: "Unauthorized" }, 401);
    const { otp_code } = await c.req.json();
    const supabase = getSupabaseClient();
    const { data: otp } = await supabase.from("otp").select("*").eq("user_id", user.id).eq("otp_code", otp_code).eq("purpose", "VERIFICATION").eq("is_verified", false).gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (!otp) return c.json({ message: "Invalid OTP" }, 400);
    await supabase.from("otp").update({ is_verified: true }).eq("id", otp.id);
    await supabase.from("user").update({ phone_verified: true }).eq("id", user.id);
    const token = await new jose.SignJWT({ id: user.id, phone_number: user.phone_number, role: user.role, phone_verified: true }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").setIssuedAt().sign(JWT_SECRET);
    return c.json({ message: "Phone verified", token }, 200, { "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax` });
  } catch (err) {
    return c.json({ message: "Verification failed", error: String(err) }, 500);
  }
});

app.get("/paisaads-api/auth/profile", async (c) => {
  const user = c.get("user") || await getUserFromCookie(c);
  if (!user) return c.json({ message: "Unauthorized" }, 401);
  const supabase = getSupabaseClient();
  const { data } = await supabase.from("user").select("id, name, email, phone_number, role, is_active, email_verified, phone_verified").eq("id", user.id).maybeSingle();
  return c.json(data);
});

app.get("/paisaads-api/auth/current", async (c) => {
  const user = await c.get("user") || await getUserFromCookie(c);
  return c.json(user);
});

// ============ USERS ============

app.post("/paisaads-api/users/register-customer", async (c) => {
  try {
    const body = await c.req.json();
    const hashedPassword = bcrypt.hashSync(body.password, 10);
    const supabase = getSupabaseClient();
    const { data: user, error } = await supabase.from("user").insert({ name: body.name, email: body.email || "", phone_number: body.phone_number, password: hashedPassword, role: "USER", phone_verified: false }).select("id, name, email, phone_number, role, is_active, email_verified, phone_verified").single();
    if (error) return c.json({ message: "Registration failed", error: error.message }, 400);
    await supabase.from("customer").insert({ user_id: user.id, country: body.country || "India", country_id: body.country_id || "", state: body.state || "", state_id: body.state_id || "", city: body.city || "", city_id: body.city_id || "", gender: body.gender || "MALE" });
    const token = await new jose.SignJWT({ id: user.id, phone_number: user.phone_number, role: user.role, phone_verified: false }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").setIssuedAt().sign(JWT_SECRET);
    return c.json({ user, token }, 201, { "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax` });
  } catch (err) {
    return c.json({ message: "Registration failed", error: String(err) }, 500);
  }
});

app.get("/paisaads-api/users", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "EDITOR")) return c.json({ message: "Forbidden" }, 403);
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("user").select("id, name, email, phone_number, role, is_active, email_verified, phone_verified, created_at").order("created_at", { ascending: false });
    if (error) return c.json({ message: error.message }, 500);
    return c.json(data || []);
  } catch (err) {
    return c.json({ message: String(err) }, 500);
  }
});

app.get("/paisaads-api/users/:id", async (c) => {
  const user = await c.get("user") || await getUserFromCookie(c);
  if (!user) return c.json({ message: "Unauthorized" }, 401);
  const supabase = getSupabaseClient();
  const { data } = await supabase.from("user").select("id, name, email, phone_number, role, is_active, email_verified, phone_verified, created_at").eq("id", c.req.param("id")).maybeSingle();
  return c.json(data);
});

app.patch("/paisaads-api/users/:id/activate", async (c) => {
  const user = await c.get("user") || await getUserFromCookie(c);
  if (!user || user.role !== "SUPER_ADMIN") return c.json({ message: "Forbidden" }, 403);
  const supabase = getSupabaseClient();
  await supabase.from("user").update({ is_active: true }).eq("id", c.req.param("id"));
  return c.json({ message: "User activated" });
});

app.patch("/paisaads-api/users/:id/deactivate", async (c) => {
  const user = await c.get("user") || await getUserFromCookie(c);
  if (!user || user.role !== "SUPER_ADMIN") return c.json({ message: "Forbidden" }, 403);
  const supabase = getSupabaseClient();
  await supabase.from("user").update({ is_active: false }).eq("id", c.req.param("id"));
  return c.json({ message: "User deactivated" });
});

app.patch("/paisaads-api/users/me", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user) return c.json({ message: "Unauthorized" }, 401);
    const body = await c.req.json();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("user").update({ name: body.name, email: body.email, secondary_number: body.secondary_number }).eq("id", user.id).select("id, name, email, phone_number, role, is_active, email_verified, phone_verified").single();
    if (error) return c.json({ message: error.message }, 500);
    return c.json(data);
  } catch (err) {
    return c.json({ message: String(err) }, 500);
  }
});

app.patch("/paisaads-api/users/me/password", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user) return c.json({ message: "Unauthorized" }, 401);
    const { current_password, new_password } = await c.req.json();
    const supabase = getSupabaseClient();
    const { data: fullUser } = await supabase.from("user").select("password").eq("id", user.id).single();
    const isValid = bcrypt.compareSync(current_password, fullUser.password);
    if (!isValid) return c.json({ message: "Current password is incorrect" }, 400);
    const hashed = bcrypt.hashSync(new_password, 10);
    await supabase.from("user").update({ password: hashed }).eq("id", user.id);
    return c.json({ message: "Password updated" });
  } catch (err) {
    return c.json({ message: String(err) }, 500);
  }
});

app.get("/paisaads-api/users/customer/me", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user) return c.json({ message: "Unauthorized" }, 401);
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("customer").select("*").eq("user_id", user.id).maybeSingle();
    if (error) return c.json({ message: error.message }, 500);
    return c.json(data);
  } catch (err) {
    return c.json({ message: String(err) }, 500);
  }
});

app.post("/paisaads-api/users", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user || user.role !== "SUPER_ADMIN") return c.json({ message: "Forbidden" }, 403);
    const body = await c.req.json();
    const hashedPassword = bcrypt.hashSync(body.password || "password123", 10);
    const supabase = getSupabaseClient();
    const { data: newUser, error } = await supabase.from("user").insert({ name: body.name, email: body.email || "", phone_number: body.phone_number, password: hashedPassword, role: body.role || "USER", phone_verified: true }).select("id, name, email, phone_number, role, is_active, email_verified, phone_verified").single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(newUser, 201);
  } catch (err) {
    return c.json({ message: String(err) }, 500);
  }
});

// ============ CATEGORIES ============

app.get("/paisaads-api/categories/tree", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const [mainRes, oneRes, twoRes, threeRes] = await Promise.all([
      supabase.from("main_category").select("id, name, category_heading_font_color, categories_color, font_color, is_active").eq("is_active", true).order("name"),
      supabase.from("category_one").select("id, name, category_heading_font_color, is_active, parent_id").eq("is_active", true),
      supabase.from("category_two").select("id, name, category_heading_font_color, is_active, parent_id").eq("is_active", true),
      supabase.from("category_three").select("id, name, category_heading_font_color, is_active, parent_id").eq("is_active", true),
    ]);
    const buildChildren = (items: any[], parentId: string, allLevels: any[]): any[] => {
      return items.filter((c: any) => c.parent_id === parentId).map((item: any) => {
        const ch = buildChildren(allLevels, item.id, allLevels);
        return { ...item, children: ch, subCategories: ch };
      });
    };
    const tree = (mainRes.data || []).map((main: any) => {
      const ch = buildChildren(oneRes.data || [], main.id, [...(twoRes.data || []), ...(threeRes.data || [])]);
      // Build proper 3-level hierarchy
      const levelOne = (oneRes.data || []).filter((c: any) => c.parent_id === main.id).map((one: any) => {
        const levelTwo = (twoRes.data || []).filter((c: any) => c.parent_id === one.id).map((two: any) => {
          const levelThree = (threeRes.data || []).filter((c: any) => c.parent_id === two.id);
          return { ...two, children: levelThree, subCategories: levelThree };
        });
        return { ...one, children: levelTwo, subCategories: levelTwo };
      });
      return { ...main, children: levelOne, subCategories: levelOne };
    });
    return c.json(tree);
  } catch (err) {
    return c.json({ message: String(err) }, 500);
  }
});

app.post("/paisaads-api/categories/main", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "EDITOR")) return c.json({ message: "Forbidden" }, 403);
    const body = await c.req.json();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("main_category").insert(body).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data, 201);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.patch("/paisaads-api/categories/main/:id", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "EDITOR")) return c.json({ message: "Forbidden" }, 403);
    const body = await c.req.json();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("main_category").update(body).eq("id", c.req.param("id")).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.delete("/paisaads-api/categories/main/:id", async (c) => {
  const user = await c.get("user") || await getUserFromCookie(c);
  if (!user || user.role !== "SUPER_ADMIN") return c.json({ message: "Forbidden" }, 403);
  const supabase = getSupabaseClient();
  await supabase.from("main_category").delete().eq("id", c.req.param("id"));
  return c.json({ message: "Deleted" });
});

app.post("/paisaads-api/categories/main/:mainId/one", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "EDITOR")) return c.json({ message: "Forbidden" }, 403);
    const body = await c.req.json();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("category_one").insert({ ...body, parent_id: c.req.param("mainId") }).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data, 201);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.patch("/paisaads-api/categories/one/:id", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "EDITOR")) return c.json({ message: "Forbidden" }, 403);
    const body = await c.req.json();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("category_one").update(body).eq("id", c.req.param("id")).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.delete("/paisaads-api/categories/one/:id", async (c) => {
  const user = await c.get("user") || await getUserFromCookie(c);
  if (!user || user.role !== "SUPER_ADMIN") return c.json({ message: "Forbidden" }, 403);
  const supabase = getSupabaseClient();
  await supabase.from("category_one").delete().eq("id", c.req.param("id"));
  return c.json({ message: "Deleted" });
});

app.post("/paisaads-api/categories/one/:oneId/two", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "EDITOR")) return c.json({ message: "Forbidden" }, 403);
    const body = await c.req.json();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("category_two").insert({ ...body, parent_id: c.req.param("oneId") }).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data, 201);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.patch("/paisaads-api/categories/two/:id", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "EDITOR")) return c.json({ message: "Forbidden" }, 403);
    const body = await c.req.json();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("category_two").update(body).eq("id", c.req.param("id")).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.delete("/paisaads-api/categories/two/:id", async (c) => {
  const user = await c.get("user") || await getUserFromCookie(c);
  if (!user || user.role !== "SUPER_ADMIN") return c.json({ message: "Forbidden" }, 403);
  const supabase = getSupabaseClient();
  await supabase.from("category_two").delete().eq("id", c.req.param("id"));
  return c.json({ message: "Deleted" });
});

app.post("/paisaads-api/categories/two/:twoId/three", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "EDITOR")) return c.json({ message: "Forbidden" }, 403);
    const body = await c.req.json();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("category_three").insert({ ...body, parent_id: c.req.param("twoId") }).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data, 201);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.patch("/paisaads-api/categories/three/:id", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "EDITOR")) return c.json({ message: "Forbidden" }, 403);
    const body = await c.req.json();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("category_three").update(body).eq("id", c.req.param("id")).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.delete("/paisaads-api/categories/three/:id", async (c) => {
  const user = await c.get("user") || await getUserFromCookie(c);
  if (!user || user.role !== "SUPER_ADMIN") return c.json({ message: "Forbidden" }, 403);
  const supabase = getSupabaseClient();
  await supabase.from("category_three").delete().eq("id", c.req.param("id"));
  return c.json({ message: "Deleted" });
});

// ============ LINE ADS ============

function transformImage(img: any) {
  if (!img) return img;
  return { ...img, fileName: img.file_name, filePath: img.file_path, isTemp: img.is_temp };
}

function transformAd(ad: any) {
  if (!ad) return ad;
  return {
    ...ad,
    sequenceNumber: ad.sequence_number,
    orderId: ad.order_id,
    mainCategory: ad.main_category,
    categoryOne: ad.category_one,
    categoryTwo: ad.category_two,
    categoryThree: ad.category_three,
    mainCategoryId: ad.main_category_id,
    categoryOneId: ad.category_one_id,
    categoryTwoId: ad.category_two_id,
    categoryThreeId: ad.category_three_id,
    paymentId: ad.payment_id,
    customerId: ad.customer_id,
    isActive: ad.is_active,
    postedBy: ad.posted_by,
    contactOne: ad.contact_one,
    contactTwo: ad.contact_two,
    backgroundColor: ad.background_color,
    textColor: ad.text_color,
    pageType: ad.page_type,
    image: ad.image || (ad.images && ad.images.length > 0 ? ad.images[0] : null),
    images: ad.images || (ad.image ? [ad.image] : []),
  };
}

function transformAds(ads: any[]) {
  return (ads || []).map(transformAd);
}

app.get("/paisaads-api/line-ad/today", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("line_ad").select("*, main_category:main_category_id(id, name), category_one:category_one_id(id, name), category_two:category_two_id(id, name), category_three:category_three_id(id, name), customer:customer_id(id, user_id), payment:payment_id(*)").eq("is_active", true).in("status", ["PUBLISHED", "FOR_REVIEW"]).order("created_at", { ascending: false });
    if (error) return c.json({ message: error.message }, 500);
    return c.json(transformAds(data));
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.get("/paisaads-api/line-ad/my-ads", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user) return c.json({ message: "Unauthorized" }, 401);
    const supabase = getSupabaseClient();
    const { data: customer } = await supabase.from("customer").select("id").eq("user_id", user.id).maybeSingle();
    if (!customer) return c.json([]);
    const { data } = await supabase.from("line_ad").select("*, main_category:main_category_id(id, name), category_one:category_one_id(id, name)").eq("customer_id", customer.id).order("created_at", { ascending: false });
    return c.json(transformAds(data));
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.get("/paisaads-api/line-ad/status/:status", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("line_ad").select("*, main_category:main_category_id(id, name), category_one:category_one_id(id, name), customer:customer_id(id, user_id)").eq("status", c.req.param("status")).eq("is_active", true).order("created_at", { ascending: false });
    if (error) return c.json({ message: error.message }, 500);
    return c.json(transformAds(data));
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.get("/paisaads-api/line-ad/:id", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("line_ad").select("*, main_category:main_category_id(id, name), category_one:category_one_id(id, name), category_two:category_two_id(id, name), category_three:category_three_id(id, name), customer:customer_id(id, user_id), payment:payment_id(*), comments:ad_comment(*, user:user_id(id, name))").eq("id", c.req.param("id")).maybeSingle();
    if (error) return c.json({ message: error.message }, 500);
    return c.json(transformAd(data));
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.post("/paisaads-api/line-ad", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user) return c.json({ message: "Unauthorized" }, 401);
    const body = await c.req.json();
    const supabase = getSupabaseClient();
    const { data: customer } = await supabase.from("customer").select("id").eq("user_id", user.id).maybeSingle();
    if (!customer) return c.json({ message: "Customer profile not found" }, 400);
    const { data, error } = await supabase.from("line_ad").insert({ ...body, customer_id: customer.id, status: "DRAFT", is_active: true }).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data, 201);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.patch("/paisaads-api/line-ad/:id", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user) return c.json({ message: "Unauthorized" }, 401);
    const body = await c.req.json();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("line_ad").update(body).eq("id", c.req.param("id")).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.patch("/paisaads-api/line-ad/:id/approve", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user || (user.role !== "EDITOR" && user.role !== "SUPER_ADMIN")) return c.json({ message: "Forbidden" }, 403);
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("line_ad").update({ status: "PUBLISHED" }).eq("id", c.req.param("id")).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.patch("/paisaads-api/line-ad/admin/:id", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user || (user.role !== "EDITOR" && user.role !== "SUPER_ADMIN" && user.role !== "REVIEWER")) return c.json({ message: "Forbidden" }, 403);
    const body = await c.req.json();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("line_ad").update(body).eq("id", c.req.param("id")).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.get("/paisaads-api/line-ad/count", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const { count, error } = await supabase.from("line_ad").select("*", { count: "exact", head: true }).eq("is_active", true);
    if (error) return c.json({ count: 0 });
    return c.json({ count: count || 0 });
  } catch (err) { return c.json({ count: 0 }); }
});

// ============ POSTER ADS ============

app.get("/paisaads-api/poster-ad/today", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("poster_ad").select("*, main_category:main_category_id(id, name), category_one:category_one_id(id, name), customer:customer_id(id, user_id), payment:payment_id(*)").eq("is_active", true).in("status", ["PUBLISHED", "FOR_REVIEW"]).order("created_at", { ascending: false });
    if (error) return c.json({ message: error.message }, 500);
    const adsWithImages = await Promise.all((data || []).map(async (ad: any) => {
      const { data: images } = await supabase.from("image").select("id, file_name, file_path").eq("poster_ad_id", ad.id);
      const transformedImages = (images || []).map(transformImage);
      return { ...ad, images: transformedImages, image: transformedImages.length > 0 ? transformedImages[0] : null };
    }));
    return c.json(transformAds(adsWithImages));
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.get("/paisaads-api/poster-ad/my-ads", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user) return c.json({ message: "Unauthorized" }, 401);
    const supabase = getSupabaseClient();
    const { data: customer } = await supabase.from("customer").select("id").eq("user_id", user.id).maybeSingle();
    if (!customer) return c.json([]);
    const { data } = await supabase.from("poster_ad").select("*, main_category:main_category_id(id, name), category_one:category_one_id(id, name)").eq("customer_id", customer.id).order("created_at", { ascending: false });
    return c.json(transformAds(data));
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.get("/paisaads-api/poster-ad/status/:status", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("poster_ad").select("*, main_category:main_category_id(id, name), category_one:category_one_id(id, name), customer:customer_id(id, user_id)").eq("status", c.req.param("status")).eq("is_active", true).order("created_at", { ascending: false });
    if (error) return c.json({ message: error.message }, 500);
    return c.json(transformAds(data));
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.get("/paisaads-api/poster-ad/:id", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("poster_ad").select("*, main_category:main_category_id(id, name), category_one:category_one_id(id, name), category_two:category_two_id(id, name), category_three:category_three_id(id, name), customer:customer_id(id, user_id), payment:payment_id(*), comments:ad_comment(*, user:user_id(id, name))").eq("id", c.req.param("id")).maybeSingle();
    if (error) return c.json({ message: error.message }, 500);
    if (data) {
      const { data: images } = await supabase.from("image").select("id, file_name, file_path").eq("poster_ad_id", data.id);
      const transformedImages = (images || []).map(transformImage);
      data.images = transformedImages;
      data.image = transformedImages.length > 0 ? transformedImages[0] : null;
    }
    return c.json(transformAd(data));
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.post("/paisaads-api/poster-ad", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user) return c.json({ message: "Unauthorized" }, 401);
    const body = await c.req.json();
    const supabase = getSupabaseClient();
    const { data: customer } = await supabase.from("customer").select("id").eq("user_id", user.id).maybeSingle();
    if (!customer) return c.json({ message: "Customer profile not found" }, 400);
    const { data, error } = await supabase.from("poster_ad").insert({ ...body, customer_id: customer.id, status: "DRAFT", is_active: true }).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data, 201);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.patch("/paisaads-api/poster-ad/:id", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user) return c.json({ message: "Unauthorized" }, 401);
    const body = await c.req.json();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("poster_ad").update(body).eq("id", c.req.param("id")).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.patch("/paisaads-api/poster-ad/:id/approve", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user || (user.role !== "EDITOR" && user.role !== "SUPER_ADMIN")) return c.json({ message: "Forbidden" }, 403);
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("poster_ad").update({ status: "PUBLISHED" }).eq("id", c.req.param("id")).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.patch("/paisaads-api/poster-ad/admin/:id", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user || (user.role !== "EDITOR" && user.role !== "SUPER_ADMIN" && user.role !== "REVIEWER")) return c.json({ message: "Forbidden" }, 403);
    const body = await c.req.json();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("poster_ad").update(body).eq("id", c.req.param("id")).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

// ============ VIDEO ADS ============

app.get("/paisaads-api/video-ad/today", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("video_ad").select("*, main_category:main_category_id(id, name), category_one:category_one_id(id, name), customer:customer_id(id, user_id), payment:payment_id(*)").eq("is_active", true).in("status", ["PUBLISHED", "FOR_REVIEW"]).order("created_at", { ascending: false });
    if (error) return c.json({ message: error.message }, 500);
    const adsWithImages = await Promise.all((data || []).map(async (ad: any) => {
      const { data: images } = await supabase.from("image").select("id, file_name, file_path").eq("video_ad_id", ad.id);
      const transformedImages = (images || []).map(transformImage);
      return { ...ad, images: transformedImages, image: transformedImages.length > 0 ? transformedImages[0] : null };
    }));
    return c.json(transformAds(adsWithImages));
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.get("/paisaads-api/video-ad/my-ads", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user) return c.json({ message: "Unauthorized" }, 401);
    const supabase = getSupabaseClient();
    const { data: customer } = await supabase.from("customer").select("id").eq("user_id", user.id).maybeSingle();
    if (!customer) return c.json([]);
    const { data } = await supabase.from("video_ad").select("*, main_category:main_category_id(id, name), category_one:category_one_id(id, name)").eq("customer_id", customer.id).order("created_at", { ascending: false });
    return c.json(transformAds(data));
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.get("/paisaads-api/video-ad/status/:status", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("video_ad").select("*, main_category:main_category_id(id, name), category_one:category_one_id(id, name), customer:customer_id(id, user_id)").eq("status", c.req.param("status")).eq("is_active", true).order("created_at", { ascending: false });
    if (error) return c.json({ message: error.message }, 500);
    return c.json(transformAds(data));
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.get("/paisaads-api/video-ad/:id", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("video_ad").select("*, main_category:main_category_id(id, name), category_one:category_one_id(id, name), category_two:category_two_id(id, name), category_three:category_three_id(id, name), customer:customer_id(id, user_id), payment:payment_id(*), comments:ad_comment(*, user:user_id(id, name))").eq("id", c.req.param("id")).maybeSingle();
    if (error) return c.json({ message: error.message }, 500);
    if (data) {
      const { data: images } = await supabase.from("image").select("id, file_name, file_path").eq("video_ad_id", data.id);
      const transformedImages = (images || []).map(transformImage);
      data.images = transformedImages;
      data.image = transformedImages.length > 0 ? transformedImages[0] : null;
    }
    return c.json(transformAd(data));
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.post("/paisaads-api/video-ad", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user) return c.json({ message: "Unauthorized" }, 401);
    const body = await c.req.json();
    const supabase = getSupabaseClient();
    const { data: customer } = await supabase.from("customer").select("id").eq("user_id", user.id).maybeSingle();
    if (!customer) return c.json({ message: "Customer profile not found" }, 400);
    const { data, error } = await supabase.from("video_ad").insert({ ...body, customer_id: customer.id, status: "DRAFT", is_active: true }).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data, 201);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.patch("/paisaads-api/video-ad/:id", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user) return c.json({ message: "Unauthorized" }, 401);
    const body = await c.req.json();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("video_ad").update(body).eq("id", c.req.param("id")).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.patch("/paisaads-api/video-ad/:id/approve", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user || (user.role !== "EDITOR" && user.role !== "SUPER_ADMIN")) return c.json({ message: "Forbidden" }, 403);
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("video_ad").update({ status: "PUBLISHED" }).eq("id", c.req.param("id")).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.patch("/paisaads-api/video-ad/admin/:id", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user || (user.role !== "EDITOR" && user.role !== "SUPER_ADMIN" && user.role !== "REVIEWER")) return c.json({ message: "Forbidden" }, 403);
    const body = await c.req.json();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("video_ad").update(body).eq("id", c.req.param("id")).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

// ============ AD POSITION ============

app.get("/paisaads-api/ad-position/available-positions", async (c) => { const supabase = getSupabaseClient(); const { data } = await supabase.from("ad_position").select("*").order("position"); return c.json(data || []); });
app.get("/paisaads-api/ad-position/available-pages", async (c) => { return c.json(["HOME", "SEARCH", "CATEGORY"]); });
app.get("/paisaads-api/ad-position/layout", async (c) => { const supabase = getSupabaseClient(); const pageType = new URL(c.req.url).searchParams.get("pageType") || "HOME"; const { data } = await supabase.from("ad_position").select("*").eq("page_type", pageType).order("position"); return c.json(data || []); });
app.get("/paisaads-api/ad-position/ad-slots/overview", async (c) => { const supabase = getSupabaseClient(); const { data } = await supabase.from("ad_position").select("*").order("page_type", "position"); return c.json(data || []); });
app.get("/paisaads-api/ad-position/ad-slots/line-ads", async (c) => { const supabase = getSupabaseClient(); const { data } = await supabase.from("line_ad").select("id, content, status, dates, state, city").eq("is_active", true).order("created_at", { ascending: false }); return c.json(data || []); });
app.get("/paisaads-api/ad-position/ad-slots/slot-details/:pageType/:side/:position", async (c) => { const supabase = getSupabaseClient(); const { data } = await supabase.from("ad_position").select("*").eq("page_type", c.req.param("pageType")).eq("side", c.req.param("side")).eq("position", c.req.param("position")).maybeSingle(); return c.json(data); });
app.get("/paisaads-api/ad-position/ad-slots/available-dates", async (c) => { return c.json([]); });
app.get("/paisaads-api/ad-position/ad-slots/by-date/overview", async (c) => { const supabase = getSupabaseClient(); const { data } = await supabase.from("ad_position").select("*").order("page_type", "position"); return c.json(data || []); });
app.get("/paisaads-api/ad-position/ad-slots/by-date/line-ads", async (c) => { const supabase = getSupabaseClient(); const { data } = await supabase.from("line_ad").select("id, content, status, dates").eq("is_active", true).order("created_at", { ascending: false }); return c.json(data || []); });
app.get("/paisaads-api/ad-position/ad-slots/by-date/slot-details/:pageType/:side/:position", async (c) => { const supabase = getSupabaseClient(); const { data } = await supabase.from("ad_position").select("*").eq("page_type", c.req.param("pageType")).eq("side", c.req.param("side")).eq("position", c.req.param("position")).maybeSingle(); return c.json(data); });

app.post("/paisaads-api/ad-position/assign", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "EDITOR")) return c.json({ message: "Forbidden" }, 403);
    const body = await c.req.json();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("ad_position").insert(body).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data, 201);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.get("/paisaads-api/ad-position/:id", async (c) => { const supabase = getSupabaseClient(); const { data } = await supabase.from("ad_position").select("*").eq("id", c.req.param("id")).maybeSingle(); return c.json(data); });
app.patch("/paisaads-api/ad-position/:id", async (c) => { try { const user = await c.get("user") || await getUserFromCookie(c); if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "EDITOR")) return c.json({ message: "Forbidden" }, 403); const body = await c.req.json(); const supabase = getSupabaseClient(); const { data, error } = await supabase.from("ad_position").update(body).eq("id", c.req.param("id")).select().single(); if (error) return c.json({ message: error.message }, 400); return c.json(data); } catch (err) { return c.json({ message: String(err) }, 500); } });
app.delete("/paisaads-api/ad-position/:id", async (c) => { const user = await c.get("user") || await getUserFromCookie(c); if (!user || user.role !== "SUPER_ADMIN") return c.json({ message: "Forbidden" }, 403); const supabase = getSupabaseClient(); await supabase.from("ad_position").delete().eq("id", c.req.param("id")); return c.json({ message: "Deleted" }); });

// ============ PAYMENT ============

app.post("/paisaads-api/payment", async (c) => { try { const user = await c.get("user") || await getUserFromCookie(c); if (!user) return c.json({ message: "Unauthorized" }, 401); const body = await c.req.json(); const supabase = getSupabaseClient(); const { data, error } = await supabase.from("payment").insert(body).select().single(); if (error) return c.json({ message: error.message }, 400); return c.json(data, 201); } catch (err) { return c.json({ message: String(err) }, 500); } });
app.patch("/paisaads-api/payment/:id", async (c) => { try { const user = await c.get("user") || await getUserFromCookie(c); if (!user) return c.json({ message: "Unauthorized" }, 401); const body = await c.req.json(); const supabase = getSupabaseClient(); const { data, error } = await supabase.from("payment").update(body).eq("id", c.req.param("id")).select().single(); if (error) return c.json({ message: error.message }, 400); return c.json(data); } catch (err) { return c.json({ message: String(err) }, 500); } });

// ============ AD COMMENTS ============

app.post("/paisaads-api/ad-comments", async (c) => { try { const user = await c.get("user") || await getUserFromCookie(c); if (!user) return c.json({ message: "Unauthorized" }, 401); const body = await c.req.json(); const supabase = getSupabaseClient(); const { data, error } = await supabase.from("ad_comment").insert({ ...body, user_id: user.id, action_timestamp: new Date().toISOString() }).select().single(); if (error) return c.json({ message: error.message }, 400); return c.json(data, 201); } catch (err) { return c.json({ message: String(err) }, 500); } });

// ============ IMAGE UPLOAD ============

app.post("/paisaads-api/images/upload", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user) return c.json({ message: "Unauthorized" }, 401);
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    if (!file) return c.json({ message: "No file provided" }, 400);
    const supabase = getSupabaseClient();
    const fileName = `${Date.now()}-${file.name}`;
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const { data: uploadData, error: uploadError } = await supabase.storage.from("uploads").upload(fileName, uint8Array, { contentType: file.type });
    if (uploadError) return c.json({ message: uploadError.message }, 500);
    const { data: publicUrl } = supabase.storage.from("uploads").getPublicUrl(fileName);
    const { data, error } = await supabase.from("image").insert({ file_name: file.name, file_path: publicUrl.publicUrl, is_temp: true, customer_id: null }).select().single();
    if (error) return c.json({ message: error.message }, 400);
    return c.json(data, 201);
  } catch (err) { return c.json({ message: String(err) }, 500); }
});

app.post("/paisaads-api/videos/upload", async (c) => { return c.json({ message: "Video upload available in production mode", filePath: "" }, 501); });

// ============ DASHBOARD ============

app.get("/paisaads-api/ad-dashboard/user", async (c) => {
  try {
    const user = await c.get("user") || await getUserFromCookie(c);
    if (!user) return c.json({ message: "Unauthorized" }, 401);
    const supabase = getSupabaseClient();
    const { data: customer, error: custErr } = await supabase.from("customer").select("id").eq("user_id", user.id).maybeSingle();
    if (custErr || !customer) return c.json({ totalAds: 0, publishedAds: 0, draftAds: 0, reviewAds: 0 });
    const [lineAds, posterAds, videoAds] = await Promise.all([
      supabase.from("line_ad").select("status").eq("customer_id", customer.id),
      supabase.from("poster_ad").select("status").eq("customer_id", customer.id),
      supabase.from("video_ad").select("status").eq("customer_id", customer.id),
    ]);
    const allAds = [...(lineAds.data || []), ...(posterAds.data || []), ...(videoAds.data || [])];
    return c.json({ totalAds: allAds.length, publishedAds: allAds.filter((a: any) => a.status === "PUBLISHED").length, draftAds: allAds.filter((a: any) => a.status === "DRAFT").length, reviewAds: allAds.filter((a: any) => a.status === "FOR_REVIEW").length });
  } catch (err) { return c.json({ totalAds: 0, publishedAds: 0, draftAds: 0, reviewAds: 0 }); }
});

app.get("/paisaads-api/ad-dashboard/global", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const [lineAds, posterAds, videoAds, users] = await Promise.all([
      supabase.from("line_ad").select("status").eq("is_active", true),
      supabase.from("poster_ad").select("status").eq("is_active", true),
      supabase.from("video_ad").select("status").eq("is_active", true),
      supabase.from("user").select("role"),
    ]);
    const allAds = [...(lineAds.data || []), ...(posterAds.data || []), ...(videoAds.data || [])];
    return c.json({ totalAds: allAds.length, publishedAds: allAds.filter((a: any) => a.status === "PUBLISHED").length, draftAds: allAds.filter((a: any) => a.status === "DRAFT").length, reviewAds: allAds.filter((a: any) => a.status === "FOR_REVIEW").length, totalUsers: (users.data || []).length });
  } catch (err) { return c.json({ totalAds: 0, publishedAds: 0, draftAds: 0, reviewAds: 0, totalUsers: 0 }); }
});

// ============ CONFIGURATIONS (in-memory) ============

const configurations: Record<string, any> = {
  "terms-and-conditions": { content: "Terms and conditions for PaisaAds platform. By using our services, you agree to these terms." },
  "privacy-policy": { content: "Privacy policy for PaisaAds. We respect your data and privacy." },
  "faq": { questions: [{ question: "How to post an ad?", answer: "Register, verify your phone, and click Post Ad from your dashboard." }, { question: "How long do ads stay published?", answer: "Ads stay published for the duration you selected during posting." }, { question: "How to contact support?", answer: "Use the Contact Us page or email support@paisaads.in" }] },
  "contact-page": { email: "support@paisaads.in", phone: "+91-9999999999", address: "Mumbai, India" },
  "ad-pricing": { lineAd: 99, posterAd: 199, videoAd: 299 },
  "search-slogan": { primarySlogan: "Find What You Need", secondarySlogan: "Search through thousands of classified advertisements" },
  "about-us": { content: "PaisaAds is India's leading classified ads platform connecting buyers and sellers." },
};

app.get("/paisaads-api/configurations/:key", async (c) => { return c.json(configurations[c.req.param("key")] || {}); });
app.post("/paisaads-api/configurations/:key", async (c) => { const user = await c.get("user") || await getUserFromCookie(c); if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "EDITOR")) return c.json({ message: "Forbidden" }, 403); const key = c.req.param("key"); const body = await c.req.json(); configurations[key] = body; return c.json(configurations[key]); });
app.get("/paisaads-api/configurations/privacy-policy/history", async (c) => { return c.json([configurations["privacy-policy"]]); });
app.get("/paisaads-api/configurations/ad-pricing/history", async (c) => { return c.json([configurations["ad-pricing"]]); });

// ============ REPORTS ============

app.get("/paisaads-api/reports/admin/activity", async (c) => { const supabase = getSupabaseClient(); const [lineAds, posterAds, videoAds] = await Promise.all([supabase.from("line_ad").select("status, created_at").eq("is_active", true), supabase.from("poster_ad").select("status, created_at").eq("is_active", true), supabase.from("video_ad").select("status, created_at").eq("is_active", true)]); return c.json({ lineAds: lineAds.data || [], posterAds: posterAds.data || [], videoAds: videoAds.data || [] }); });
app.get("/paisaads-api/reports/admin/user-wise-activity", async (c) => { const supabase = getSupabaseClient(); const { data } = await supabase.from("user").select("id, name, role, created_at"); return c.json(data || []); });
app.get("/paisaads-api/reports/admin/activity-by-category", async (c) => { const supabase = getSupabaseClient(); const { data } = await supabase.from("main_category").select("id, name"); return c.json(data || []); });
app.get("/paisaads-api/reports/listings/analytics", async (c) => { const supabase = getSupabaseClient(); const [lineAds, posterAds, videoAds] = await Promise.all([supabase.from("line_ad").select("status, created_at, main_category_id").eq("is_active", true), supabase.from("poster_ad").select("status, created_at, main_category_id").eq("is_active", true), supabase.from("video_ad").select("status, created_at, main_category_id").eq("is_active", true)]); return c.json({ lineAds: lineAds.data || [], posterAds: posterAds.data || [], videoAds: videoAds.data || [] }); });
app.get("/paisaads-api/reports/listings/active-by-category", async (c) => { const supabase = getSupabaseClient(); const { data } = await supabase.from("main_category").select("id, name"); return c.json(data || []); });
app.get("/paisaads-api/reports/listings/approval-times", async (c) => { return c.json([]); });
app.get("/paisaads-api/reports/listings/by-user", async (c) => { const supabase = getSupabaseClient(); const { data } = await supabase.from("user").select("id, name").eq("role", "USER"); return c.json(data || []); });
app.get("/paisaads-api/reports/payments/transactions", async (c) => { const supabase = getSupabaseClient(); const { data } = await supabase.from("payment").select("*").order("created_at", { ascending: false }); return c.json(data || []); });
app.get("/paisaads-api/reports/payments/revenue-by-product", async (c) => { return c.json([]); });
app.get("/paisaads-api/reports/payments/revenue-by-category", async (c) => { return c.json([]); });
app.get("/paisaads-api/reports/locations", async (c) => { const supabase = getSupabaseClient(); const { data } = await supabase.from("line_ad").select("state, city").eq("is_active", true); return c.json(data || []); });
app.get("/paisaads-api/reports/filtered-ads", async (c) => { const supabase = getSupabaseClient(); const { data } = await supabase.from("line_ad").select("*").eq("is_active", true).limit(50); return c.json(data || []); });
app.get("/paisaads-api/reports/users/registrations", async (c) => { const supabase = getSupabaseClient(); const { data } = await supabase.from("user").select("id, name, role, created_at").order("created_at", { ascending: false }); return c.json(data || []); });
app.get("/paisaads-api/reports/users/active-vs-inactive", async (c) => { const supabase = getSupabaseClient(); const [active, inactive] = await Promise.all([supabase.from("user").select("id", { count: "exact", head: true }).eq("is_active", true), supabase.from("user").select("id", { count: "exact", head: true }).eq("is_active", false)]); return c.json({ active: active.count || 0, inactive: inactive.count || 0 }); });
app.get("/paisaads-api/reports/users/login-activity", async (c) => { return c.json([]); });
app.get("/paisaads-api/reports/users/views-by-category", async (c) => { return c.json([]); });
app.get("/paisaads-api/reports/export", async (c) => { return c.json({ message: "Export not available in demo mode" }); });

// ============ HEALTH ============

app.get("/paisaads-api/health", async (c) => { return c.json({ status: "ok", timestamp: new Date().toISOString(), service: "PaisaAds API" }); });

// ============ CATCH-ALL ============

app.all("/paisaads-api/*", async (c) => { return c.json({ message: "Endpoint not found", path: c.req.path }, 404); });

Deno.serve(app.fetch);
