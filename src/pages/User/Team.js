import React from 'react'
import { useNavigate } from 'react-router-dom'
import mockImg from '../../Assets/user_pict.png'

export default function Team({name, picture, slug, param}) {

  const navigate = useNavigate()

  return (
    <a href={`/${param}/${slug}`}>
      <div className="user-team">
        <div className="manga-team__img-block">
          <img className="manga-team__img" src={picture || mockImg} alt={name}/>
        </div>
        <div className="manga-team__name-block">
          <p className="manga-team__name default-text">{name}</p>
        </div>
      </div>
    </a>
  )
}
