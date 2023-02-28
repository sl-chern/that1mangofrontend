import React from 'react'
import './style.css'

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__text-block">
        <p className="not-found__text">404</p>
        <div className="not-found__info-block">
          <p className="not-found__info">страница</p>
          <p className="not-found__info">не</p>
          <p className="not-found__info">найдена</p>
        </div>
      </div>
    </div>
  )
}
