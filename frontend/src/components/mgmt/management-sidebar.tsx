"use client";

import type React from "react";

import { Role } from "@/lib/enum/roles.enum";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Gift,
  Grid,
  ImageIcon,
  LayoutDashboard,
  Settings,
  Tag,
  UsersIcon,
  Video,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ManagementSidebarProps {
  userRole: Role;
  pathname: string;
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: Role[];
  submenu?: {
    title: string;
    href: string;
  }[];
}

export function ManagementSidebar({
  userRole,
  pathname,
  isOpen = false,
  onClose,
}: ManagementSidebarProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      href: "/mgmt/dashboard",
      icon: LayoutDashboard,
      roles: [Role.SUPER_ADMIN, Role.EDITOR, Role.REVIEWER],
    },
    {
      title: "Reports",
      href: "/mgmt/dashboard/reports",
      icon: BarChart3,
      roles: [Role.SUPER_ADMIN, Role.EDITOR, Role.REVIEWER],
    },
    {
      title: "Ad Slots Overview",
      href: "/mgmt/dashboard/ad-slots-overview",
      icon: Grid,
      roles: [Role.SUPER_ADMIN, Role.EDITOR, Role.REVIEWER],
    },
    {
      title: "Categories",
      href: "/mgmt/dashboard/categories",
      icon: Tag,
      roles: [Role.SUPER_ADMIN],
      submenu: [
        { title: "Add Categories", href: "/mgmt/dashboard/categories/add" },
        { title: "View Categories", href: "/mgmt/dashboard/categories/view" },
      ], 
    },

    {
      title: "Configurations",
      href: "/mgmt/dashboard/configurations",
      icon: Settings,
      roles: [Role.SUPER_ADMIN],
      submenu: [
        {
          title: "Ad Pricing",
          href: "/mgmt/dashboard/configurations/ad-pricing",
        },
        {
          title: "Privacy Policy",
          href: "/mgmt/dashboard/configurations/privacy-policy",
        },
        {
          title: "Search Slogan",
          href: "/mgmt/dashboard/configurations/search-slogan",
        },
        {
          title: "About Us",
          href: "/mgmt/dashboard/configurations/about-us",
        },
        {
          title: "FAQ",
          href: "/mgmt/dashboard/configurations/faq",
        },
        {
          title: "Contact Page",
          href: "/mgmt/dashboard/configurations/contact-page",
        },
        {
          title: "Terms and Conditions",
          href: "/mgmt/dashboard/configurations/tc",
        },
      ],
    },
    {
      title: "Review Ads",
      href: "/mgmt/dashboard/review-ads",
      icon: FileText,
      roles: [Role.SUPER_ADMIN, Role.EDITOR, Role.REVIEWER],
      submenu: [
        { title: "Line Ads", href: "/mgmt/dashboard/review-ads/line" },
        { title: "Poster Ads", href: "/mgmt/dashboard/review-ads/poster" },
        { title: "Video Ads", href: "/mgmt/dashboard/review-ads/video" },
      ],
    },
    {
      title: "Published Ads",
      href: "/mgmt/published-ads",
      icon: CheckCircle,
      roles: [Role.SUPER_ADMIN, Role.EDITOR, Role.REVIEWER],
      submenu: [
        { title: "Line Ads", href: "/mgmt/dashboard/published-ads/line" },
        { title: "Poster Ads", href: "/mgmt/dashboard/published-ads/poster" },
        { title: "Video Ads", href: "/mgmt/dashboard/published-ads/video" },
      ],
    },
    {
      title: "Ads On Hold",
      href: "/mgmt/dashboard/ads-on-hold",
      icon: Clock,
      roles: [Role.SUPER_ADMIN, Role.EDITOR, Role.REVIEWER],
      submenu: [
        { title: "Line Ads", href: "/mgmt/dashboard/ads-on-hold/line" },
        { title: "Poster Ads", href: "/mgmt/dashboard/ads-on-hold/poster" },
        { title: "Video Ads", href: "/mgmt/dashboard/ads-on-hold/video" },
      ],
    },
    {
      title: "Rejected Ads",
      href: "/mgmt/dashboard/rejected-ads",
      icon: XCircle,
      roles: [Role.SUPER_ADMIN, Role.EDITOR, Role.REVIEWER],
      submenu: [
        { title: "Line Ads", href: "/mgmt/dashboard/rejected-ads/line" },
        { title: "Poster Ads", href: "/mgmt/dashboard/rejected-ads/poster" },
        { title: "Video Ads", href: "/mgmt/dashboard/rejected-ads/video" },
      ],
    },
    {
      title: "Users",
      href: "/mgmt/dashboard/users",
      icon: UsersIcon,
      roles: [Role.SUPER_ADMIN],
    },
  ];

  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(title);
    }
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={cn(
        "w-64 bg-white border-r shadow-sm overflow-y-auto fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 border-b">
          <Link href="/mgmt/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-primary">PaisaAds</span>
          </Link>
        </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems
            .filter((item) => item.roles.includes(userRole))
            .map((item) => {
              const active = isActive(item.href);
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isSubmenuOpen = openSubmenu === item.title;

              return (
                <li key={item.title}>
                  {hasSubmenu ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleSubmenu(item.title)}
                        className={cn(
                          "flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100",
                          active && "bg-gray-100 font-medium"
                        )}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        <span className="flex-1 text-left">{item.title}</span>
                        {isSubmenuOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      {isSubmenuOpen && (
                        <ul className="pl-9 space-y-1">
                          {item.submenu?.map((subitem) => (
                            <li key={subitem.title}>
                              <Link
                                href={subitem.href}
                                onClick={onClose}
                                className={cn(
                                  "flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100",
                                  isActive(subitem.href) &&
                                    "bg-gray-100 font-medium"
                                )}
                              >
                                {subitem.title === "Line Ads" && (
                                  <FileText className="h-4 w-4 mr-2" />
                                )}
                                {subitem.title === "Video Ads" && (
                                  <Video className="h-4 w-4 mr-2" />
                                )}
                                {subitem.title === "Poster Ads" && (
                                  <ImageIcon className="h-4 w-4 mr-2" />
                                )}
                                {subitem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100",
                        active && "bg-gray-100 font-medium"
                      )}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.title}
                    </Link>
                  )}
                </li>
              );
            })}
        </ul>
      </nav>
    </div>
    </>
  );
}
