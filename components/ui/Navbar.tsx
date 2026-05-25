'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Show, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Library", href: "/" },
  { label: "Add New", href: "/books/new" },
  { label: "Pricing", href: "/subscriptions" },
];

const Navbar = () => {
  const pathName = usePathname();
  const { user } = useUser();
  

  return (
    <header className="w-full fixed z-50 bg-[var(--bg-primary)]">
      <div className="wrapper navbar-height py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex gap-0.5 items-center">
          <Image
            src="/assets/logo.png"
            alt="Bookified"
            width={42}
            height={26}
          />
          <span className="logo-text">Bookified</span>
        </Link>

        {/* Nav */}
        <nav className="w-fit flex gap-7.5 items-center">

          {navItems.map(({ label, href }) => {
            const isActive =
              pathName === href ||
              (href !== "/" && pathName.startsWith(href));

            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "nav-link-base",
                  isActive
                    ? "nav-link-active"
                    : "text-black hover:opacity-70"
                )}
              >
                {label}
              </Link>
            );
          })}

          {/* Auth */}
          <div className="flex gap-4 items-center">

            {/* NOT LOGGED IN */}
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="px-4 py-2 border rounded-md">
                  Sign In
                </button>
              </SignInButton>
            </Show>

            {/* LOGGED IN */}
            <Show when="signed-in">
              <div className="flex items-center gap-3">
                <UserButton afterSignOutUrl="/" />

                {user?.firstName && (
                  <span className="text-sm font-medium">
                    {user.firstName}
                  </span>
                )}
              </div>
            </Show>

          </div>

        </nav>
      </div>
    </header>
  );
};

export default Navbar;