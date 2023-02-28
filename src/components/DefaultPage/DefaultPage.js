import React from 'react'
import RickRoll from '../RickRoll/RickRoll'
import Header from '../Header/Header'
import Notifications from '../Notifications/Notifications'
import Footer from '../Footer/Footer'

export default function DefaultPage({children}) {
  return (
    <div className="flex flex-col justify-between min-h-screen bg-light-200 dark:bg-dark-100">
      <div className="grow flex flex-col">
        <Header />

        <main>
          {children}

          <Notifications />
        </main>

        <RickRoll keys={["r", "i", "c", "k", "r", "o", "l", "l"]}/>
      </div>
      <Footer />
    </div>
  )
}
