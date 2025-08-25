"use client"

import DistanceCalculator from "./components/ui/DistanceCalculator"
import GoogleMapDragDistance from "./components/ui/GoogleMapDragDistance"
import Navbar from "./components/ui/Navbar"
import { useState } from "react"

export default function Home() {
  return (
    <main
      className="h-screen bg-cover bg-center flex flex-col"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70')",
      }}
    >
      <Navbar/>
      <DistanceCalculator />
    </main>
  )
}
