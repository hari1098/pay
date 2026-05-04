import FAQContent from "./faq-content";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://vhlafnxhkalzwzlcbidq.supabase.co/functions/v1/paisaads-api";

async function getFAQData() {
  const res = await fetch(`${API_BASE}/configurations/faq`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function FAQPage() {
  const faqData = await getFAQData();

  return <FAQContent faqData={faqData} />;
}
