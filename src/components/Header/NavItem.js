import React from 'react'

export default function NavItem(props) {
  return (
    <a href={props.path ? `${props.path}` : `#`}>
      <div className="nav-block group" onClick={() => props.path ? "" : props.onClick()}>
        <div className="nav-content">
          <div>
              {props.icon}
          </div>
          <p className="navText">{props.text}</p>
        </div>
        <div className='hoverEffect'></div>
      </div>
    </a>
  )
}
