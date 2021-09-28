import NextLink from "next/link";
import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  ShieldCheckIcon,
} from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon, current: true },
  {
    name: "Users",
    href: "/settings/iam/users",
    icon: UsersIcon,
    current: false,
  },
  {
    name: "Roles",
    href: "/settings/iam/roles",
    icon: UserGroupIcon,
    current: false,
  },
  {
    name: "Permissions",
    href: "/settings/iam/permissions",
    icon: ShieldCheckIcon,
    current: false,
  },
];

function classNames(...classes: String[]) {
  return classes.filter(Boolean).join(" ");
}

const Sidebar = () => {
  return (
    <div className="hidden bg-gray-50 md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="text-3xl text-gray-800 text-right border-b-2 border-gray-800 w-auto tracking-tight">
              authz
            </div>
          </div>
          <div className="mt-10 flex-1 flex flex-col">
            <nav className="flex-1 space-y-1">
              {navigation.map((item) => (
                <NextLink href={item.href} key={item.name} passHref>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      navigation.map((_item, index) => {
                        navigation[index].current = _item.href === item.href;
                      });
                    }}
                    className={classNames(
                      item.current
                        ? "bg-gray-200"
                        : "text-gray-800 hover:bg-gray-100",
                      "group flex items-center px-2 py-2 text-sm font-medium"
                    )}
                  >
                    <item.icon
                      className="mr-3 flex-shrink-0 h-6 w-6 text-gray-500"
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                </NextLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Sidebar };
