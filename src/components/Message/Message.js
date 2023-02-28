import React from 'react'

export default function Message(props) {
  return (
    <div className="errorBlock">
      <p className="errorText">{props.text}</p>
    </div>
  )
}