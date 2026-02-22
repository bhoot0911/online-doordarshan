"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Home" },
        { href: "/dashboard", label: "Explore" },
        { href: "/about", label: "About" },
    ];

    return (
        <nav className="navbar">
            <Link href="/" className="navbar-logo">
                <i className="fas fa-tv"></i> Online Doordarshan
            </Link>
            <ul className="navbar-links">
                {links.map((l) => (
                    <li key={l.href}>
                        <Link
                            href={l.href}
                            className={pathname === l.href ? "active" : ""}
                        >
                            {l.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
