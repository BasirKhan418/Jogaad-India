import React from "react";
import {
  IconHome,
  IconUser,
  IconCalendar,
  IconSettings,
  IconFileText,
  IconShoppingBag,
  IconPlus,
} from "@tabler/icons-react";

export interface NavLink {
  label: string;
  href: string;
  icon: React.ReactElement;
}

export const useUserNavigation = () => {
  const links: NavLink[] = [
    {
      label: "Dashboard",
      href: "/user/dashboard",
      icon: React.createElement(IconHome, {
        className: "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
      }),
    },
    {
      label: "Services",
      href: "/user/bookings/new",
      icon: React.createElement(IconShoppingBag, {
        className: "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
      }),
    },
    {
      label: "My Bookings",
      href: "/user/bookings",
      icon: React.createElement(IconCalendar, {
        className: "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
      }),
    },
    {
      label: "Profile",
      href: "/user/profile",
      icon: React.createElement(IconUser, {
        className: "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
      }),
    },
  ];

  return { links };
};
