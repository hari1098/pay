"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Phone, Save, Eye, AlertCircle, Building, Mail, MapPin, Clock, Globe, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import api from "@/lib/api";

interface BusinessHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface ContactPage {
  _id?: string;
  companyName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates?: Coordinates;
  socialMediaLinks: string[];
  businessHours: BusinessHours;
  supportEmail?: string;
  salesEmail?: string;
  emergencyContact?: string;
  websiteUrl?: string;
  isActive: boolean;
  lastUpdated: Date;
  updatedBy: string;
}

interface ContactPageForm {
  companyName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates: {
    latitude: number | string;
    longitude: number | string;
  };
  socialMediaLinks: string[];
  businessHours: BusinessHours;
  supportEmail: string;
  salesEmail: string;
  emergencyContact: string;
  websiteUrl: string;
}

const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  monday: "9:00 AM - 6:00 PM",
  tuesday: "9:00 AM - 6:00 PM",
  wednesday: "9:00 AM - 6:00 PM",
  thursday: "9:00 AM - 6:00 PM",
  friday: "9:00 AM - 6:00 PM",
  saturday: "10:00 AM - 4:00 PM",
  sunday: "Closed"
};

export default function ContactPageConfig() {
  const [formData, setFormData] = useState<ContactPageForm>({
    companyName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    coordinates: {
      latitude: "",
      longitude: ""
    },
    socialMediaLinks: [""],
    businessHours: DEFAULT_BUSINESS_HOURS,
    supportEmail: "",
    salesEmail: "",
    emergencyContact: "",
    websiteUrl: ""
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const queryClient = useQueryClient();

  const { data: currentContact, isLoading, error } = useQuery({
    queryKey: ["contact-page"],
    queryFn: async () => {
      const { data } = await api.get("/configurations/contact-page");
      return data as ContactPage;
    }
  });

  const updateContactMutation = useMutation({
    mutationFn: async (contactData: ContactPageForm) => {

      const cleanedData = {
        ...contactData,
        coordinates: {
          latitude: contactData.coordinates.latitude ? Number(contactData.coordinates.latitude) : undefined,
          longitude: contactData.coordinates.longitude ? Number(contactData.coordinates.longitude) : undefined
        },
        socialMediaLinks: contactData.socialMediaLinks.filter(link => link.trim() !== "")
      };
      
      const { data } = await api.post("/configurations/contact-page", cleanedData);
      return data;
    },
    onSuccess: () => {
      toast.success("Contact page updated successfully");
      queryClient.invalidateQueries({ queryKey: ["contact-page"] });
      setHasChanges(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update contact page");
    }
  });

  useEffect(() => {
    if (currentContact) {
      setFormData({
        companyName: currentContact.companyName,
        email: currentContact.email,
        phone: currentContact.phone,
        alternatePhone: currentContact.alternatePhone || "",
        address: currentContact.address,
        city: currentContact.city,
        state: currentContact.state,
        postalCode: currentContact.postalCode,
        country: currentContact.country,
        coordinates: {
          latitude: currentContact.coordinates?.latitude || "",
          longitude: currentContact.coordinates?.longitude || ""
        },
        socialMediaLinks: currentContact.socialMediaLinks.length > 0 ? currentContact.socialMediaLinks : [""],
        businessHours: currentContact.businessHours,
        supportEmail: currentContact.supportEmail || "",
        salesEmail: currentContact.salesEmail || "",
        emergencyContact: currentContact.emergencyContact || "",
        websiteUrl: currentContact.websiteUrl || ""
      });
      setHasChanges(false);
    }
  }, [currentContact]);

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleNestedChange = (field: string, nestedField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: {

        ...(prev[field as keyof ContactPageForm] as Record<string, any>),
        [nestedField]: value
      }
    }));
    setHasChanges(true);
  };

  const handleBusinessHoursChange = (day: keyof BusinessHours, value: string) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSocialLinksChange = (index: number, value: string) => {
    setFormData(prev => {
      const newLinks = [...prev.socialMediaLinks];
      newLinks[index] = value;
      return { ...prev, socialMediaLinks: newLinks };
    });
    setHasChanges(true);
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialMediaLinks: [...prev.socialMediaLinks, ""]
    }));
    setHasChanges(true);
  };

  const removeSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialMediaLinks: prev.socialMediaLinks.filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateContactMutation.mutate(formData);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load contact page configuration. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Page Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Company Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) => handleFormChange("companyName", e.target.value)}
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Website URL</Label>
                    <Input
                      value={formData.websiteUrl}
                      onChange={(e) => handleFormChange("websiteUrl", e.target.value)}
                      placeholder="https://www.yourcompany.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Contact Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFormChange("email", e.target.value)}
                      placeholder="contact@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleFormChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input
                      type="email"
                      value={formData.supportEmail}
                      onChange={(e) => handleFormChange("supportEmail", e.target.value)}
                      placeholder="support@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sales Email</Label>
                    <Input
                      type="email"
                      value={formData.salesEmail}
                      onChange={(e) => handleFormChange("salesEmail", e.target.value)}
                      placeholder="sales@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Alternate Phone</Label>
                    <Input
                      value={formData.alternatePhone}
                      onChange={(e) => handleFormChange("alternatePhone", e.target.value)}
                      placeholder="+1 (555) 987-6543"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Emergency Contact</Label>
                    <Input
                      value={formData.emergencyContact}
                      onChange={(e) => handleFormChange("emergencyContact", e.target.value)}
                      placeholder="+1 (555) 911-0000"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Address Information</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Street Address</Label>
                    <Textarea
                      value={formData.address}
                      onChange={(e) => handleFormChange("address", e.target.value)}
                      placeholder="123 Main Street, Suite 100"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        value={formData.city}
                        onChange={(e) => handleFormChange("city", e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State/Province</Label>
                      <Input
                        value={formData.state}
                        onChange={(e) => handleFormChange("state", e.target.value)}
                        placeholder="State"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Postal Code</Label>
                      <Input
                        value={formData.postalCode}
                        onChange={(e) => handleFormChange("postalCode", e.target.value)}
                        placeholder="12345"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input
                        value={formData.country}
                        onChange={(e) => handleFormChange("country", e.target.value)}
                        placeholder="Country"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Latitude (Optional)</Label>
                      <Input
                        type="number"
                        step="any"
                        value={formData.coordinates.latitude}
                        onChange={(e) => handleNestedChange("coordinates", "latitude", e.target.value)}
                        placeholder="40.7128"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Longitude (Optional)</Label>
                      <Input
                        type="number"
                        step="any"
                        value={formData.coordinates.longitude}
                        onChange={(e) => handleNestedChange("coordinates", "longitude", e.target.value)}
                        placeholder="-74.0060"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Business Hours</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData.businessHours).map(([day, hours]) => (
                    <div key={day} className="space-y-2">
                      <Label className="capitalize">{day}</Label>
                      <Input
                        value={hours}
                        onChange={(e) => handleBusinessHoursChange(day as keyof BusinessHours, e.target.value)}
                        placeholder="9:00 AM - 5:00 PM or Closed"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Social Media Links</h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSocialLink}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Link
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.socialMediaLinks.map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={link}
                        onChange={(e) => handleSocialLinksChange(index, e.target.value)}
                        placeholder="https://www.facebook.com/yourcompany"
                      />
                      {formData.socialMediaLinks.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSocialLink(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  {showPreview ? "Hide" : "Show"} Preview
                </Button>
                <div className="flex items-center gap-2">
                  {hasChanges && (
                    <span className="text-sm text-muted-foreground">
                      Unsaved changes
                    </span>
                  )}
                  <Button
                    onClick={handleSave}
                    disabled={!hasChanges || updateContactMutation.isPending || !formData.companyName.trim()}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {updateContactMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>

              {currentContact && (
                <div className="text-sm text-muted-foreground border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span>
                      Last updated: {format(new Date(currentContact.lastUpdated), "PPpp")}
                    </span>
                    <span>
                      Updated by: {currentContact.updatedBy}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Page Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Contact {formData.companyName}</h2>
                <p className="text-muted-foreground">Get in touch with us through any of the following methods</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-6 w-6 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Email Us</h4>
                      <p className="text-sm text-muted-foreground">{formData.email}</p>
                      {formData.supportEmail && (
                        <p className="text-xs text-muted-foreground">Support: {formData.supportEmail}</p>
                      )}
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-6 w-6 text-green-600" />
                    <div>
                      <h4 className="font-medium">Call Us</h4>
                      <p className="text-sm text-muted-foreground">{formData.phone}</p>
                      {formData.alternatePhone && (
                        <p className="text-xs text-muted-foreground">Alt: {formData.alternatePhone}</p>
                      )}
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-red-600" />
                    <div>
                      <h4 className="font-medium">Visit Us</h4>
                      <p className="text-sm text-muted-foreground">
                        {formData.address}<br />
                        {formData.city}, {formData.state} {formData.postalCode}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Business Hours
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(formData.businessHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between py-1">
                      <span className="capitalize font-medium">{day}:</span>
                      <span className="text-muted-foreground">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {formData.socialMediaLinks.filter(link => link.trim()).length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.socialMediaLinks.filter(link => link.trim()).map((link, index) => (
                      <Badge key={index} variant="outline" className="p-2">
                        <Globe className="h-3 w-3 mr-1" />
                        {new URL(link).hostname}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}