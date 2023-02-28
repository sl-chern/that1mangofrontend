import React from 'react'
import './style.css'

export default function UserNotificationsButton({onClick, children}) {

  return (
    <div className="user-notifications-button" onClick={() => onClick()}>
      {children}
    </div>
  )
}
