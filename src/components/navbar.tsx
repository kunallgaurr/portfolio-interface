import { constants } from "@/utils/constants";
import Link from "next/link";
import React from "react";

const NavbarButton = ({ char }: { char: string }) => {
    return <span className="bg-[#85858555] rounded-[5px] w-[15px] text-xs grid place-items-center text-light">{char}</span>;
};

const Navbar = () => {
    return (
        <div className="bg-[var(--card-background)] rounded-[10px] p-2 flex flex-col text-sm">
            <Link href={"/"} className="p-2 flex justify-between hover:bg-[var(--accent-color-faded)] rounded-[5px] hover:text-[var(--accent-color)] mb-4 font-semibold text-[var(--font-color-faded)]">
                <span>kunalgaur.in</span>
                <NavbarButton char={"H"} />
            </Link>

            <span className="p-2 text-[var(--font-color-faded)] font-semibold">BROWSE</span>

            <div className="flex flex-col gap-1">
                {constants.NAVBAR_ITEMS.map(({icon, key, name, route}, index) => {
                    const Icon = icon;
                    return (
                        <Link href={route} key={key} className="p-2 flex justify-between hover:bg-[var(--accent-color-faded)] rounded-[5px] hover:text-[var(--accent-color)]">
                            <div className="flex gap-2 items-center">
                                <Icon size={16}/>
                                <span>{name}</span>
                            </div>

                            <NavbarButton char={key} />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Navbar;
