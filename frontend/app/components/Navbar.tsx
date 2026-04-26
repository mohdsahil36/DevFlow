import Link from "next/link";

const pageLinks = ["dashboard", "kanban", "pomodoro", "notes"];

export default function Navbar() {
  return (
    <nav className="border-b-2 border-[#231f1a] bg-[#fdfbf4]/95 backdrop-blur-[1px]">
      <div
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6"
      >
        <h1 className="font-mono text-base font-bold tracking-wide text-[#231f1a] sm:text-lg">
          Productivity Suite <span className="text-xs text-[#6b6256]">v1.0</span>
        </h1>

        <ul className="flex flex-wrap justify-end gap-2 sm:gap-3">
          {pageLinks.map((item) => (
            <li key={item}>
              <Link
                href={`/${item}`}
                className="border-2 border-[#231f1a] bg-[#fffdf6] px-3 py-2
                           text-xs font-mono uppercase tracking-wide text-[#231f1a] sm:px-4 sm:text-sm
                           shadow-[3px_3px_0px_#231f1a]
                           transition-all duration-150
                           hover:bg-[#fff6dd]
                           hover:translate-x-[1px] hover:translate-y-[1px]
                           active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
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
