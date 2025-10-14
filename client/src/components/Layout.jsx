import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="container-app py-8">
        <Outlet />
      </main>
    </div>
  );
}