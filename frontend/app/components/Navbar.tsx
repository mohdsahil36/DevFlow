import Link from "next/link";

const pageLinks = ["dashboard", "kanban", "pomodoro", "notes", "profile"];

export default function Navvar() {
  return (
    <div className="flex justify-between p-2 border-b-2 uppercase">
      {" "}
      <h1>Productivity Suite 1.0</h1>
      <ul className="flex gap-4">
        {pageLinks.map((item) => (
          <li key={item} className="hover:underline underline-offset-4">
            <Link href={`/${item}`}>{item}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
