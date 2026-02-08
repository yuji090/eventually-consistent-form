import { Link } from "react-router-dom";

const routes = [
  { to: "/eventual", label: "Eventually Consistent Form" },
  { to: "/events", label: "Out Of Order Events" },
  { to: "/pagination", label: "Broken Pagination" },
  { to: "/validation", label: "Validation That Lies" },
];

export default function Home() {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center">
      
      {/* CENTER CONTENT */}
      <div className="flex flex-col items-center text-center px-6">
        
        {/* LOGO */}
        <img
          src="https://www.bhumio.com/assets/images/brand/brand-logo-horizontal.svg"
          alt="Bhumio"
          className="h-10 mb-6"
        />

        {/* TITLE */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Frontend Intern Assignment – Bhumio
        </h1>

        <p className="text-slate-400 mb-10 max-w-xl">
          Interactive implementations of real-world frontend system problems
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col gap-4 w-80">
          {routes.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="bg-blue-600 hover:bg-blue-700 transition text-white text-lg py-4 rounded-xl font-semibold shadow-lg"
            >
              {r.label}
            </Link>
          ))}
        </div>

        {/* FOOTER */}
        <p className="text-xs text-slate-500 mt-10">
          All exercises implemented fully on the frontend using React
        </p>
      </div>
    </div>
  );
}
