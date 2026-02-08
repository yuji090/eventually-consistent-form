import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/eventual", label: "Eventually Consistent" },
  { to: "/events", label: "Out Of Order Events" },
  { to: "/pagination", label: "Broken Pagination" },
  { to: "/validation", label: "Validation That Lies" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="w-full bg-black/60 backdrop-blur border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LEFT : LOGO + BRAND */}
        <div className="flex items-center gap-3">
          <img
            src="https://www.bhumio.com/assets/images/brand/brand-logo-horizontal.svg"
            alt="Bhumio"
            className="h-8"
          />
          <span className="text-white font-semibold hidden sm:block">
            Frontend Intern Assignment
          </span>
        </div>

        {/* RIGHT : NAV LINKS */}
        <nav className="flex gap-5">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition ${
                pathname === l.to
                  ? "text-blue-400"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
