import { Book, Calendar, Camera, File, Github, Layers, Linkedin, Mail, MessageCircle, Pen, User, Verified } from "lucide-react"
import { NavbarItems } from "./constants.type"

const NAVBAR_ITEMS: NavbarItems[] = [
    {
        name: 'About',
        route: '/about',
        icon: User,
        key: 'A'
    },
    {
        name: 'Readme',
        route: '/readme',
        icon: Book,
        key: 'E'
    },
    {
        name: 'Picks',
        route: '/picks',
        icon: Verified,
        key: 'I'
    },
    {
        name: 'Projects',
        route: '/projects',
        icon: Layers,
        key: 'O'
    },
    {
        name: 'Photos',
        route: '/photos',
        icon: Camera,
        key: 'U'
    },
    {
        name: 'Posts',
        route: '/posts',
        icon: Pen,
        key: 'Y'
    },
];

const CONNECT_ITEMS = [
    {
        name: "Calendar",
        route: "https://www.cal.eu/kunal-gaur",
        icon: Calendar,
        key: "C",
        action: "external",
    },
    {
        name: "Email",
        route: "",
        icon: Mail,
        key: "M",
        action: "copy-email",
    },
    {
        name: "Github",
        route: "https://github.com/kunallgaurr",
        icon: Github,
        key: "G",
        action: "external",
    },
    {
        name: "Message me",
        route: "/contact",
        icon: MessageCircle,
        key: "T",
        action: "navigate",
    },
    {
        name: "Read.cv",
        route: `${process.env.NEXT_PUBLIC_HOST}/kunal_gaur_resume.pdf`,
        icon: File,
        key: "R",
        action: "external",
    },
    {
        name: "LinkedIn",
        route: "https://www.linkedin.com/in/kunal-gaur-connect/",
        icon: Linkedin,
        key: "L",
        action: "external",
    },
];

export const constants = {
    NAVBAR_ITEMS,
    CONNECT_ITEMS,
    EMAIL: "http.kunalgaur@outlook.com",
    PHONE_NUMBER: "+91 7303421656",
};
