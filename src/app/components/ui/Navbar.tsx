"use client"

export default function Navbar() {
  return (
    <nav className="bg-blue-900 px-6 py-4 flex justify-between items-center shadow">
      <div className="flex items-center gap-2">
        <span className="text-white font-bold text-xl">🚛 AutoTransport Pro</span>
      </div>
      <div className="flex gap-4">
        <a href="#" className="text-white hover:text-orange-300">Distance Calculator</a>
        <a href="#" className="text-white hover:text-orange-300">Dashboard</a>
      </div>
    </nav>
  )
}
