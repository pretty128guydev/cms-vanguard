"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";
import AdminClaimLinks from "./AdminClaimLinks";
import { useClaimFormContext } from "@/context/claimform-provider";
import { useMultiStepContext } from "@/context/multistep-provider";
import { useAdjusterNavigationContext } from "@/context/adjusterNavigation-provider";
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";
import Logout from "./Logout";
const Sidebar = () => {
  const {
    watchingvalues: { peril },
    getValues,
  } = useClaimFormContext();
  const { step, onStepClick } = useMultiStepContext();
  const { step: adjusterStep, onStepClick: adjusterOnStepClick } =
    useAdjusterNavigationContext();
  const query = useParams();
  const path = usePathname();
  const defaultStep = query.id
    ? [
        "Inspection",
        "Risk",
        "Cause of Loss",
        "Damages",
        "PSEs",
        "Coverage",
        "Other Tasks",
      ]
    : [
        "Welcome",
        "Loss",
        "Risk",
        "Cause of Loss",
        "Damages",
        "PSEs",
        "Assignment",
        "Success",
      ];
  const [steps, setSteps] = useState(defaultStep);
  const [menuItems, setMenuItems] = useState([]);
  useEffect(() => {
    let perilName = getValues("peril") || "";
    perilName = perilName.replace(/Loss/g, "");
    path === "/claims/create"
      ? setSteps([
          "Welcome",
          `${perilName} ${perilName && "-"} Loss`,
          `${perilName} ${perilName && "-"} Risk`,
          `${perilName} ${perilName && "-"} Cause of Loss`,
          `${perilName} ${perilName && "-"} Damages`,
          "PSEs",
          "Assignment",
          "Success",
        ])
      : setSteps([]);

    path === "/claims/inspect/:id" &&
      query.id &&
      setSteps([
        "Inspection",
        "Risk",
        "Cause of Loss",
        "Damages",
        "PSEs",
        "Coverage",
        "Other Tasks",
      ]);
  }, [peril, getValues, path, query.id]);

  return (
    <Sheet>
      <SheetTrigger className="block sm:hidden">
        <AiOutlineMenu className="block sm:hidden" size={"20"} />
      </SheetTrigger>
      <SheetContent className="px-2 block sm:hidden" side="left">
        <SheetHeader>
          <Link href="/" className="flex md:me-24 items-center">
            {/* <Image
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-6 sm:h-8 me-1 sm:me-2"
            alt="FlowBite Logo"
            width={32}
            height={32}
          />
          <span className="text-lg md:text-2xl font-bold tracking-tight sm:text-xl whitespace-nowrap ">
            Vanguard Landmark
          </span> */}

            <div className="flex items-center justify-center mb-6">
              <Image
                src="/icons/logo2019.png"
                alt="FlowBite Logo"
                width={100}
                height={32}
              />
            </div>
          </Link>
        </SheetHeader>
        <AdminClaimLinks
          steps={steps}
          step={query?.id ? adjusterStep : step}
          onStepClick={query?.id ? adjusterOnStepClick : onStepClick}
        />
        {/* {menuItems && menuItems.length > 0 && menuItems.map((item)=>{
          return(
            item.route ? <Link key={item.id} href={item.route}>item.item</Link> : item.item
          )
        })} */}
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
