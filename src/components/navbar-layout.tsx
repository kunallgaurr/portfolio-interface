import { GlobalTypes } from "@/types/global.type";
import React from "react";

const NavbarLayout: React.FC<GlobalTypes.BaseLayout> = ({ children }) => {
  return (
    <aside className="
        lg:flex lg:flex-col lg:gap-8 lg:p-8 lg:sticky lg:top-0 lg:h-screen 
        sm:grid sm:place-items-center sm:fixed sm:left-0 sm:bottom-0 sm:right-0 w-full
        ">
      {children}
    </aside>
  );
};

export default NavbarLayout;
