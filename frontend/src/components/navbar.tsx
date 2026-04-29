"use client";

import { ViewAdForm } from "@/components/forms/view-ad-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/api";
import { Role } from "@/lib/enum/roles.enum";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  LayoutDashboard,
  Loader2,
  LogOut,
  Settings,
  UserIcon,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PostAdLoginForm } from "./forms/post-an-ad-login-form";
import OtpViewerLogin from "./forms/otp-viewer-login";
import { logoutFromServer } from "@/logout";
import { User } from "@/lib/types/user";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isViewAdOpen, setIsViewAdOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/auth/profile");
        return data;
      } catch (error) {

        return null;
      }
    },
    retry: false, 
    staleTime: 5 * 60 * 1000, 
  });

  const isLoggedIn = !!user;
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("auth/logout");
      return data;
    },
    onSuccess: () => {
      router.push("/");
      logoutFromServer();
    },
  });

  const handleLogout = async () => {
    logout();
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="PaisaAds - Broadcast Brilliance"
                width={150}
                height={50}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              {[
                { href: "/", label: "Home" },
                { href: "/about-us", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/faq", label: "FAQ" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-semibold transition-all duration-200 px-2 py-1 rounded-lg ${
                    pathname === item.href
                      ? "text-white bg-primary shadow-lg"
                      : "text-gray-700 hover:text-primary hover:bg-primary/5 hover:shadow-sm"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {isLoading ? (

              <Button variant="outline" size="sm" disabled className="gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </Button>
            ) : isLoggedIn ? (

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 px-2 py-1 rounded-full border border-muted-foreground/20 shadow-sm hover:bg-muted/10"
                  >
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-base">
                      {getInitials(user?.name)}
                    </span>
                    <span className="hidden md:inline">
                      {user?.name || "My Account"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="rounded-lg shadow-lg p-2"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href={
                        user.role === Role.USER
                          ? "/dashboard/"
                          : "/mgmt/dashboard"
                      }
                      className="flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={
                        user.role === Role.USER
                          ? "/dashboard/profile"
                          : "/mgmt/dashboard/profile"
                      }
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (

              <>
                <Dialog open={isViewAdOpen} onOpenChange={setIsViewAdOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      className="rounded-full px-4 font-semibold shadow-md border-2 border-primary/40 text-primary hover:bg-primary/10 transition-colors"
                    >
                      View Ads
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        View Advertisements
                      </DialogTitle>
                    </DialogHeader>
                    <OtpViewerLogin
                      onSuccess={() => {
                        setIsViewAdOpen(false)
                        router.push('/search')
                      }}
                    />
                  </DialogContent>
                </Dialog>

                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="rounded-full px-4 font-semibold shadow-md border-2 border-primary text-white bg-primary hover:bg-primary/90 transition-colors"
                      variant="default"
                    >
                      Post Ad
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        Login to Post an Advertisement
                      </DialogTitle>
                    </DialogHeader>

                    <PostAdLoginForm
                      onSuccess={() => setIsLoginOpen(false)}
                    />

                    <div className="mt-4 text-center">
                      <span className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                      </span>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-sm"
                        onClick={() => {
                          setIsLoginOpen(false);
                          router.push("/register");
                        }}
                      >
                        Create an account
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur">
            <div className="px-4 py-4 space-y-2">
              <div className="space-y-1">
                {[
                  { href: "/", label: "Home" },
                  { href: "/about-us", label: "About" },
                  { href: "/contact-us", label: "Contact" },
                  { href: "/faq", label: "FAQ" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
                      pathname === item.href
                        ? "text-white bg-primary shadow-lg"
                        : "text-gray-700 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t space-y-2">
                {isLoading ? (
                  <Button variant="outline" disabled className="w-full gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </Button>
                ) : isLoggedIn ? (
                  <div className="space-y-2">
                    <Link
                      href={
                        user.role === Role.USER
                          ? "/dashboard/"
                          : "/mgmt/dashboard"
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/5 text-primary font-semibold"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full justify-start gap-2 text-red-500 border-red-200 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      onClick={() => {
                        setIsViewAdOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      View Ads
                    </Button>
                    <Button
                      onClick={() => {
                        setIsLoginOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Post Ad
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
