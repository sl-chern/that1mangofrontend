import React from 'react'

export default function Unauthorized() {
  return (
    <div className="not-found">
      <div className="not-found__text-block">
        <p className="not-found__text">401</p>
        <div className="not-found__info-block">
          <p className="unauth__info">Вы</p>
          <p className="unauth__info">не</p>
          <p className="unauth__info">авторизированы</p>
        </div>
      </div>
    </div>
  )
}
