import React from 'react'
import { AiFillHeart } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { selectAge } from '../Login/loginSlice'
import './style.css'

export default function PopularTitle({likes, name, poster, slug, title_type, age_rating}) {

  const userAge = useSelector(selectAge)

  return (
    <a className="w-full" href={`/title/${slug}`}>
      <div className="popular-title">
        <div className="popular-title__poster-block">
          <img style={age_rating === "M" && userAge < 18 ? {"filter": "blur(12px)"} : {}} className="popular-tile__poster" alt={name} src={poster}/>
        </div>

        <div className="popular-title__info-block">
          <div className="popular-title__name-block">
            <p className="popular-title__name">{name}</p>
            <div className="popular-title__dark-effect"></div>
          </div>

          <div className="popular-title__type-block">
            <p className="popular-title__type">{title_type ? title_type.name : ""}</p>
          </div>

          <div className="popular-title__mark-blcok">
            <div>
              <AiFillHeart className="icon" size="20px"/>
            </div>
            <p className="popular-title__mark">{likes}</p>
          </div>
        </div>
      </div>
    </a>
    
  )
}
