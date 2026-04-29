"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import { Suspense } from "react";
import LineAds from "./components/line-ad/line-ads";
import PosterAds from "./components/poster-ad/poster-ads";
import VideoPosterAd from "./components/video-ad/video-ads";
import Link from "next/link";
import Image from "next/image";

interface ContactInfo {
  companyName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  socialMediaLinks: string[];
  businessHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  supportEmail?: string;
  salesEmail?: string;
  emergencyContact?: string;
  websiteUrl?: string;
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
          }/server/configurations/contact-page`
        );
        if (response.ok) {
          const data = await response.json();
          setContactInfo(data);
        }
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen">{children}</div>

      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="PaisaAds - Broadcast Brilliance"
                  width={160}
                  height={53}
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trusted platform for classified advertisements. Connect
                buyers and sellers across various categories with ease and
                reliability.
              </p>
              <div className="flex space-x-4">
                {contactInfo?.socialMediaLinks &&
                  contactInfo.socialMediaLinks.length > 0 &&
                  contactInfo.socialMediaLinks
                    .slice(0, 3)
                    .map((link, index) => (
                      <Link
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <span className="sr-only">Social Media</span>
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 3.49-2.068 4.663-1.173 1.172-2.805 1.899-4.663 2.068-1.858-.169-3.49-.896-4.663-2.068C4.001 11.65 3.274 10.018 3.105 8.16c.169-1.858.896-3.49 2.068-4.663C6.346 2.324 7.978 1.597 9.836 1.428c1.858.169 3.49.896 4.663 2.069 1.172 1.173 1.899 2.805 2.069 4.663z" />
                        </svg>
                      </Link>
                    ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Browse Ads
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/post-ad"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Post Ad
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    My Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/help"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact Info</h3>
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {contactInfo && (
                    <>
                      <div className="flex items-start space-x-3">
                        <svg
                          className="h-5 w-5 text-gray-400 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <div>
                          <p className="text-gray-400 text-sm">
                            {contactInfo.address && `${contactInfo.address}, `}
                            {contactInfo.city && `${contactInfo.city}, `}
                            {contactInfo.state && `${contactInfo.state} `}
                            {contactInfo.postalCode &&
                              `${contactInfo.postalCode}, `}
                            {contactInfo.country || "Nepal"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <svg
                          className="h-5 w-5 text-gray-400 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <div className="space-y-1">
                          <p className="text-gray-400 text-sm">
                            {contactInfo.email}
                          </p>
                          {contactInfo.supportEmail && (
                            <p className="text-gray-400 text-xs">
                              Support: {contactInfo.supportEmail}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <svg
                          className="h-5 w-5 text-gray-400 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <div className="space-y-1">
                          <p className="text-gray-400 text-sm">
                            {contactInfo.phone}
                          </p>
                          {contactInfo.alternatePhone && (
                            <p className="text-gray-400 text-xs">
                              Alt: {contactInfo.alternatePhone}
                            </p>
                          )}
                        </div>
                      </div>

                      {contactInfo.websiteUrl && (
                        <div className="flex items-start space-x-3">
                          <svg
                            className="h-5 w-5 text-gray-400 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"
                            />
                          </svg>
                          <div>
                            <Link
                              href={contactInfo.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-white transition-colors text-sm"
                            >
                              {contactInfo.websiteUrl.replace(
                                /^https?:\/\//,
                                ""
                              )}
                            </Link>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-400">
                  © {new Date().getFullYear()}{" "}
                  {contactInfo?.companyName || "PaisaAds"}. All rights reserved.
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-xs text-gray-500">
                  Developed and maintained by{" "}
                  <Link
                    href="https://mobifish.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    MobiFish
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
