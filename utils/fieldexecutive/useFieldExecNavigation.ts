import React from "react";
import {
  IconHome,
  IconUser,
  IconTarget,
  IconMapPin,
  IconUsers,
  IconUserPlus,
} from "@tabler/icons-react";

export interface NavLink {
  label: string;
  href: string;
  icon: React.ReactElement;
}


export const useFieldExecNavigation = () => {
  const links: NavLink[] = [
    {
      label: "Dashboard",
      href: "/field-executive/dashboard",
      icon: React.createElement(IconHome, {
        className: "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
      }),
    },
    {
      label: "Add Employee",
      href: "/field-executive/add-employee",
      icon: React.createElement(IconUserPlus, {
        className: "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
      }),
    },
    {
      label: "Employees",
      href: "/field-executive/employees",
      icon: React.createElement(IconUsers, {
        className: "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
      }),
    },
    {
      label: "Profile",
      href: "/field-executive/profile",
      icon: React.createElement(IconUser, {
        className: "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
      }),
    },
  ];

  return { links };
};
