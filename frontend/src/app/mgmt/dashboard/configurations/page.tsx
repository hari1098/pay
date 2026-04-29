"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdPricingConfig from "./ad-pricing/page";
import PrivacyPolicyConfig from "./privacy-policy/page";
import SearchSloganConfig from "./search-slogan/page";
import FaqConfig from "./faq/page";
import ContactPageConfig from "./contact-page/page";
import TermsConditionsConfig from "./tc/page";
import { 
  DollarSign, 
  Shield, 
  Search, 
  Users, 
  HelpCircle, 
  Phone, 
  FileText,
  Settings
} from "lucide-react";

export default function ConfigurationsPage() {
  const [activeTab, setActiveTab] = useState("ad-pricing");

  return (
    <div className="space-y-6 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">⚙️ System Configurations</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-6">
          <TabsTrigger value="ad-pricing" className="flex items-center gap-2 text-xs">
            <DollarSign className="h-4 w-4" />
            Ad Pricing
          </TabsTrigger>
          <TabsTrigger value="privacy-policy" className="flex items-center gap-2 text-xs">
            <Shield className="h-4 w-4" />
            Privacy Policy
          </TabsTrigger>
          <TabsTrigger value="search-slogan" className="flex items-center gap-2 text-xs">
            <Search className="h-4 w-4" />
            Search Slogan
          </TabsTrigger>
          <TabsTrigger value="about-us" className="flex items-center gap-2 text-xs">
            <Users className="h-4 w-4" />
            About Us
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2 text-xs">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="contact-page" className="flex items-center gap-2 text-xs">
            <Phone className="h-4 w-4" />
            Contact Page
          </TabsTrigger>
          <TabsTrigger value="terms-conditions" className="flex items-center gap-2 text-xs">
            <FileText className="h-4 w-4" />
            Terms & Conditions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ad-pricing">
          <AdPricingConfig />
        </TabsContent>

        <TabsContent value="privacy-policy">
          <PrivacyPolicyConfig />
        </TabsContent>

        <TabsContent value="search-slogan">
          <SearchSloganConfig />
        </TabsContent>


        <TabsContent value="faq">
          <FaqConfig />
        </TabsContent>

        <TabsContent value="contact-page">
          <ContactPageConfig />
        </TabsContent>

        <TabsContent value="terms-conditions">
          <TermsConditionsConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
}