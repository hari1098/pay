import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Role } from "@/lib/enum/roles.enum";
import {
  LayoutDashboard,
  BarChart3,
  Tag,
  Gift,
  Settings,
  FileText,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Video,
  ImageIcon,
  Menu,
  X,
} from "lucide-react";

interface ManagementSidebarProps {
  pathname: string;
}

interface MenuItem {
  title: string;
  href: string;
  icon: React.ElementType;
  submenu?: {
    title: string;
    href: string;
  }[];
}

export default function DashboardSidebar({ pathname }: ManagementSidebarProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Ads",
      href: "/dashboard/ads",
      icon: CheckCircle,
      submenu: [
        {
          title: "Line Ads",
          href: "/dashboard/my-ads/line-ads",
        },
        {
          title: "Poster Ads",
          href: "/dashboard/my-ads/poster-ads",
        },
        {
          title: "Video Ads",
          href: "/dashboard/my-ads/video-ads",
        },
      ],
    },
    {
      title: "Post new Ad",
      href: "/dashboard/post-ad",
      icon: FileText,
      submenu: [
        { title: "Line Ads", href: "/dashboard/post-ad/line-ad" },
        { title: "Poster Ads", href: "/dashboard/post-ad/poster-ad" },
        { title: "Video Ads", href: "/dashboard/post-ad/video-ad" },
      ],
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

  const handleMobileClose = () => {
    setIsMobileOpen(false);
  };

  const sidebarContent = (
    <nav className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Menu</h2>
        <button
          onClick={handleMobileClose}
          className="p-2 rounded hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <ul className="space-y-1">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isSubmenuOpen = openSubmenu === item.title;

          return (
            <li key={item.title}>
              {hasSubmenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={cn(
                      "flex items-center w-full px-3 py-2 text-sm",
                      active && "font-medium"
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isSubmenuOpen && "rotate-90"
                      )}
                    />
                  </button>
                  {isSubmenuOpen && (
                    <ul className="pl-6 space-y-1">
                      {item.submenu?.map((subitem) => (
                        <li key={subitem.title}>
                          <Link
                            href={subitem.href}
                            onClick={handleMobileClose}
                            className={cn(
                              "block px-3 py-2 text-sm",
                              isActive(subitem.href) && "font-medium"
                            )}
                          >
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
                  onClick={handleMobileClose}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm",
                    active && "font-medium"
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
  );

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-3 left-4 z-40 p-2 bg-white rounded-md shadow-md"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={handleMobileClose}
        >
          <div
            className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}

      <div className="hidden lg:block w-64 bg-white border-r shadow-sm overflow-y-auto ">
        {sidebarContent}
      </div>
    </>
  );
}
