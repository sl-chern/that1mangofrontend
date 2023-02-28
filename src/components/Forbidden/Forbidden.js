import React from 'react'

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__text-block">
        <p className="not-found__text">403</p>
        <div className="not-found__info-block">
          <p className="forbidden__info">доступ</p>
          <p className="forbidden__info">запрещён</p>
        </div>
      </div>
    </div>
  )
}