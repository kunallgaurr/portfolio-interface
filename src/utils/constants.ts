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
        name: 'Calender',
        route: '/about',
        icon: Calendar,
        key: 'C'
    },
    {
        name: 'Email',
        route: '/about',
        icon: Mail,
        key: 'M'
    },
    {
        name: 'Github',
        route: '/about',
        icon: Github,
        key: 'G'
    },
    {
        name: 'Text me',
        route: '/about',
        icon: MessageCircle,
        key: 'T'
    },
    {
        name: 'Read.cv',
        route: '/about',
        icon: File,
        key: 'R'
    },
    {
        name: 'LinkedIn',
        route: '/about',
        icon: Linkedin,
        key: 'L'
    },
]

export const constants = {
    NAVBAR_ITEMS
}