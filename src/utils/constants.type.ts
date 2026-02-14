import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type IconTye = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
export interface NavbarItems {
    name: string,
    route: string,
    icon: IconTye,
    key: string
}