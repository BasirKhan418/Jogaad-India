import React from "react";
import {
  IconDashboard,
  IconUser,
  IconCalendar,
  IconCurrencyDollar,
  IconChartBar,
  IconSettings,
  IconLogout,
  IconBriefcase,
  IconClipboardList
} from "@tabler/icons-react";

export interface NavigationLink {
  label: string;
  href: string;
  icon: React.ReactElement;
}

interface UseEmployeeNavigationReturn {
  links: NavigationLink[];
  logoutLink: NavigationLink;
}

export const useEmployeeNavigation = (): UseEmployeeNavigationReturn => {
  const links: NavigationLink[] = [
    {
      label: "Dashboard",
      href: "/employee/dashboard",
      icon: React.createElement(IconDashboard, {
        className: "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
      }),
    },
    {
      label: "Bookings",
      href: "/employee/bookings",
      icon: React.createElement(IconClipboardList, {
        className: "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
      }),
    },
    {
      label: "Profile",
      href: "/employee/profile",
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
