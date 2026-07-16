'use client'
import React from 'react'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import VisionSection from '../components/VisionSection'
import PlansSection from '../components/PlansSection'
import ContactSection from '../components/ContactSection'
import MapSection from '../components/MapSection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <VisionSection />
      <PlansSection />
      <ContactSection />
      <MapSection />
    </>
  )
}