export default function Navbar({ user }) {
  return (
    <header className="w-full bg-hero sticky top-0 z-40 backdrop-blur border-b border-line/60">
      <div className="container-app h-16 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
          <a href="/feed" className="text-[18px] font-semibold">CARPINCHOS DECIDEN</a>
        </div>
        <nav className="flex items-center gap-3">
          <a href="/projects/new" className="btn-ghost">Nuevo proyecto</a>
          <a href="/profile" className="btn-ghost rounded-full w-10 h-10 grid place-items-center">👤</a>
        </nav>
      </div>
    </header>
  );
}