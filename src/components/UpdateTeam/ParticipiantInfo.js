import React, { useState } from 'react'
import mockImg from '../../Assets/user_pict.png'

export default function ParticipiantInfo({name, picture, roles, setUpdateVisibility, setUpdatePart, setCurPartSettings, index}) {

  const handleClick = () => {
    setUpdateVisibility(false)
    setUpdatePart(true)
    setCurPartSettings(index)
  }

  return (
    <div className="participant" onClick={() => handleClick()}> 
      <div className="participant__picture-block">
        <img className="participant__picture" src={picture || mockImg} alt={name}/>
      </div>
      <div className="participant__info">
        <div className="participant__name-block">
          <p className="participant__name">{name}</p>
        </div>
        <div className="participant__roles-block">
          {
            roles instanceof Array ?
              roles.map((item, index) => 
                <div className="participant__role" key={`participantrole${index}`}>
                  <p className="participant__role-name">{item.name}</p>
                </div>
              )
              : null
          }
        </div>
      </div>

      
    </div>
  )
}
