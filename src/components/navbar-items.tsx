import Link from "next/link";
import React from "react";

type NavbarItemProps = {
  icon: React.ElementType;
  name: string;
  route: string;
  shortcut: string;
};

const NavbarItem = ({
  icon: Icon,
  name,
  route,
  shortcut,
}: NavbarItemProps) => {
  return (
    <Link
      href={route}
      className="p-2 flex items-center justify-between rounded-md transition-colors hover:bg-[var(--accent-color-faded)] hover:text-[var(--accent-color)]"
    >
      <div className="flex items-center gap-2">
        <Icon size={16} />
        <span>{name}</span>
      </div>

      <span className="bg-[#85858555] rounded-md min-w-[18px] h-[18px] text-[10px] flex items-center justify-center text-[var(--font-color-faded)]">
        {shortcut}
      </span>
    </Link>
  );
};

export default NavbarItem;
