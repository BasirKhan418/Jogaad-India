import React from "react";
import {
  IconDashboard,
  IconUsers,
  IconCategory,
  IconCurrencyDollar,
  IconChartBar,
  IconUser,
  IconSettings,
  IconLogout
} from "@tabler/icons-react";

export interface NavigationLink {
  label: string;
  href: string;
  icon: React.ReactElement;
}

interface UseAdminNavigationReturn {
  links: NavigationLink[];
  logoutLink: NavigationLink;
}

export const useAdminNavigation = (): UseAdminNavigationReturn => {
  const links: NavigationLink[] = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: React.createElement(IconDashboard, {
        className: "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
      }),
    },
    {
      label: "Users",
      href: "#users",
      icon: React.createElement(IconUsers, {
        className: "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
      }),
    },
    {
      label: "Categories",
      href: "/admin/categories",
      icon: React.createElement(IconCategory, {
        className: "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
      }),
    },
    {
      label: "Fees",
      href: "#fees",
      icon: React.createElement(IconCurrencyDollar, {
        className: "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
      }),
    },
    {
      label: "Analytics",
      href: "#analytics",
      icon: React.createElement(IconChartBar, {
        className: "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
      }),
    },
    {
      label: "Profile",
      href: "/admin/profile",
      icon: React.createElement(IconUser, {
        className: "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
      }),
    },
    {
      label: "Settings",
      href: "#settings",
      icon: React.createElement(IconSettings, {
        className: "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
      }),
    },
  ];

  const logoutLink: NavigationLink = {
    label: "Logout",
    href: "#logout",
    icon: React.createElement(IconLogout, {
      className: "h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0"
    }),
  };

  return { links, logoutLink };
};