import { GlobalTypes } from "@/types/global.type";
import React from "react";

const NavbarLayout: React.FC<GlobalTypes.BaseLayout> = ({ children }) => {
    return <div className="p-8 flex flex-col gap-8">{children}</div>;
};

export default NavbarLayout;
