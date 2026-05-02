"use client";

import Link from "next/link";

const pageLinks = ["dashboard", "kanban", "pomodoro", "notes"];

export default function Navbar() {
  return (
    <nav className="border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <h1 className="text-sm font-semibold text-[var(--text-primary)]">
          Productivity Suite
          <span className="ml-2 text-[10px] text-[var(--text-secondary)]">
            v1.0
          </span>
        </h1>

        {/* Links */}
        <ul className="flex items-center gap-2">
          {pageLinks.map((item) => (
            <li key={item}>
              <Link
                href={`/${item}`}
                className="
                  px-3 py-1.5 text-xs font-medium rounded-md
                  text-[var(--text-secondary)]
                  hover:text-[var(--text-primary)]
                  hover:bg-gray-100
                  transition
                "
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
