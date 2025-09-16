import React from "react";
import { NavbarCart, NavbarCartPlaceholder } from "./navbar-cart";
import { NavbarLinks } from "./navbar-links";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

function Navbar() {
  return (
    <nav className="border-b shadow-xs">
      <div className="max-w-7xl mx-auto p-4 py-2 flex justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="px-0 sm:hidden">
              <span className="sr-only">Open Menu</span>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>

            <NavbarLinks className="flex-col items-stretch px-4 gap-2" />
          </SheetContent>
        </Sheet>

        <NavbarLinks className="hidden sm:flex" />

        <ul className="flex items-center gap-2">
          <React.Suspense fallback={<NavbarCartPlaceholder />}>
            <NavbarCart />
          </React.Suspense>
        </ul>
      </div>
    </nav>
  );
}

export { Navbar };
