import React from 'react'

export default function Stat({title, value}) {
  return (
    <div className="stats-content">
      <p className="stats-content__stat-type">{title}</p>
      <p className="stats-content__stat-value">{value || 0}</p>
    </div>
  )
}
