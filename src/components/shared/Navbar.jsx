"use client";
import { FaCircleUser } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Sidebar from "./Sidebar";
import { useAuthContext } from "@/context/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import Logout from "./Logout";

const Navbar = () => {
  const { isUserLoggedIn, isLoading, isAdjuster, currentUser } =
    useAuthContext();
  return (
    <div className="py-4 px-6 fixed top-0 flex z-50 justify-between items-center w-full bg-white shadow-md">
      <div className="flex items-center gap-2">
        <Sidebar />
        <Link href="/" className="flex md:me-24 items-center">
          <div className="flex items-center justify-center mb-6">
            <Image
              src="/icons/logo2019.png"
              alt="FlowBite Logo"
              width={100}
              height={32}
            />
          </div>
        </Link>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center cursor-pointer">
              {currentUser && (
                <span className="mr-2 flex flex-col items-end">
                  <span>{currentUser.name}</span>
                  <span className="text-[9px]">{currentUser.email}</span>
                </span>
              )}
              <FaCircleUser size="30px" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem className="cursor-pointer">
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Logout />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
