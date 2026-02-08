import Navbar from "./Navbar";

export default function Layout({ title, children }) {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-black via-slate-900 to-black text-white">
      
      {/* TOP NAV */}
      <Navbar />

      {/* PAGE CONTENT */}
      <main className="max-w-6xl mx-auto w-full px-6 py-10">
        {title && (
          <h1 className="text-2xl font-bold mb-8">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
