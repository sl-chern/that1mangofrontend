import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import mockImg from '../../Assets/user_pict.png'
import './style.css'

export default function Participant({name, picture, roles = []}) {

  const navigate = useNavigate()

  return (
    <a href={`/user/${name}`}>
      <div className="participant"> 
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
    </a>
  )
}
