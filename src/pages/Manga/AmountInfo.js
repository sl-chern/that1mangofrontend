import React from 'react'

export default function AmountInfo({icon, tip, amount}) {
  return (
    <div className="amountBlock group">
      {icon}
      <p className="rating">{amount}</p>

      <div className="tip">{tip}</div>
      <div className="tipArrow"></div>
    </div>
  )
}
