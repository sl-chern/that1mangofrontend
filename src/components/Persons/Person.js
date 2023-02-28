import React from 'react'
import { useNavigate } from 'react-router-dom'
import imgMock from '../../Assets/user_pict.png'

export default function Person({img, name, slug, param}) {

  const navigate = useNavigate()

  return (
    <a href={`/${param}/${slug}`}>
      <div className="personBlock group">
        <div className="personImgBlock">
          <img src={img || imgMock} alt={name} className="personImg"/>
        </div>
        <div className="personNameBlock">
          <p className="personName">{name}</p>
          <div className="personNameBlock__darkEffect"></div>
        </div>
      </div>
    </a>
  )
}
