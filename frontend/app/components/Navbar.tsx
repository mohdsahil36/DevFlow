import Link from "next/link";

const pageLinks = ["dashboard", "kanban", "pomodoro", "notes"];

export default function Navbar() {
  return (
    <nav className="bg-[#e3dfd9] border-b-4 border-black">
      <div
        className="max-w-6xl mx-auto py-5 
                      flex items-center justify-between"
      >
        <h1 className="text-base sm:text-lg font-bold font-mono tracking-wide">
          Productivity Suite <span className="text-xs">v1.0</span>
        </h1>

        <ul className="flex gap-3 sm:gap-4">
          {pageLinks.map((item) => (
            <li key={item}>
              <Link
                href={`/${item}`}
                className="px-3 sm:px-4 py-2 border-2 border-black bg-white 
                           shadow-[3px_3px_0px_#1f1f1f] 
                           text-xs sm:text-sm font-mono uppercase
                           transition-all duration-150
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
