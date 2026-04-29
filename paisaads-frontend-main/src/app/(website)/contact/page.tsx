"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Globe, 
  AlertCircle,
  Users,
  ShoppingCart
} from "lucide-react";
import api from "@/lib/api";

export default function ContactPage() {
  const { data: contactData, isLoading, error } = useQuery({
    queryKey: ["contactPage"],
    queryFn: async () => {
      const { data } = await api.get("/configurations/contact-page");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !contactData) {
    return (
      <div className="pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600">Contact information not available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get in touch with {contactData.companyName || "us"}. We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Primary Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {contactData.email && (
                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">Email Address</p>
                    <a 
                      href={`mailto:${contactData.email}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {contactData.email}
                    </a>
                  </div>
                </div>
              )}

              {contactData.phone && (
                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium">Phone Number</p>
                    <a 
                      href={`tel:${contactData.phone}`}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      {contactData.phone}
                    </a>
                  </div>
                </div>
              )}

              {contactData.alternatePhone && (
                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium">Alternate Phone</p>
                    <a 
                      href={`tel:${contactData.alternatePhone}`}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      {contactData.alternatePhone}
                    </a>
                  </div>
                </div>
              )}

              {contactData.websiteUrl && (
                <div className="flex items-start gap-4">
                  <Globe className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <p className="font-medium">Website</p>
                    <a 
                      href={contactData.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {contactData.websiteUrl}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-red-600 mt-1" />
                <div>
                  <p className="font-medium mb-2">Office Location</p>
                  <div className="text-gray-700 space-y-1">
                    {contactData.address && <p>{contactData.address}</p>}
                    <p>
                      {[contactData.city, contactData.state, contactData.postalCode]
                        .filter(Boolean).join(', ')}
                    </p>
                    {contactData.country && <p>{contactData.country}</p>}
                  </div>
                  
                  {contactData.coordinates && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        Coordinates: {contactData.coordinates.latitude}, {contactData.coordinates.longitude}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {contactData.supportEmail && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                  Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">For technical support and help</p>
                <a 
                  href={`mailto:${contactData.supportEmail}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {contactData.supportEmail}
                </a>
              </CardContent>
            </Card>
          )}

          {contactData.salesEmail && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">For sales inquiries and partnerships</p>
                <a 
                  href={`mailto:${contactData.salesEmail}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {contactData.salesEmail}
                </a>
              </CardContent>
            </Card>
          )}

          {contactData.emergencyContact && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Emergency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">For urgent matters</p>
                <p className="text-gray-700 font-medium">{contactData.emergencyContact}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {contactData.businessHours && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Business Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(contactData.businessHours).map(([day, hours]) => (
                  <div key={day} className="text-center p-3 border rounded-lg">
                    <p className="font-medium capitalize">{day}</p>
                    <p className="text-sm text-gray-600">{hours as string}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {contactData.socialMediaLinks && contactData.socialMediaLinks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Follow Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {contactData.socialMediaLinks.map((link: string, index: number) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    Social Media {index + 1}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}