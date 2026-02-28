import { GlobalTypes } from "@/types/global.type";
import React from "react";

const NavbarLayout: React.FC<GlobalTypes.BaseLayout> = ({ children }) => {
  return (
    <aside className="
        z-10 
        lg:flex lg:flex-col lg:gap-8 lg:p-8 lg:sticky lg:top-0 lg:h-screen 
        sm:fixed sm:left-0 sm:bottom-0 sm:right-0 sm:flex sm:flex-row sm:items-end 
        sm:justify-center sm:gap-3 sm:p-3
        w-full
        ">
      {children}
    </aside>
  );
};

export default NavbarLayout;
