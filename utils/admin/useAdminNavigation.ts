import React from "react";
import {
  IconDashboard,
  IconCategory,
  IconChartBar,
  IconUser,
  IconSettings,
  IconLogout,
  IconUserPlus,
  IconUsersGroup,
  IconFileText,
  IconCurrencyRupee
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
      label: "Service Providers",
      href: "/admin/employees",
      icon: React.createElement(IconUserPlus, {
        className: "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
      }),
    },
    {
      label: "Employees",
      href: "/admin/field-executives",
      icon: React.createElement(IconUsersGroup, {
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
      href: "/admin/fees",
      icon: React.createElement(IconCurrencyRupee, {
        className: "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
      }),
    },
    {
      label: "Payment Logs",
      href: "/admin/payment-logs",
      icon: React.createElement(IconFileText, {
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