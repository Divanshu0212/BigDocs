import React from 'react'
import { Features, Footer, Header, Hero, SearchSection } from '../components/main'

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <SearchSection />
      </main>
      <Footer />
    </div>
  )
}

export default Landing
