import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navbar } from '../components/layout/Navbar'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-white text-[#171717]">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  ),
})
