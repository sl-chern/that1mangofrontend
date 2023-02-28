import React, {useEffect, useRef} from 'react'
import './style.css'
import { AiFillStar } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { selectAge } from '../Login/loginSlice'

export default function Title({poster, name, title_type, total_rating, age_rating, slug}) {
  const ageRating = useSelector(selectAge)

  const imgRef = useRef()

  useEffect(() => {
    imgRef.current.style.backgroundImage = `url(${poster})`
  }, [poster, ageRating, age_rating])

  return (
    <a className="manga-title-link" href={`/title/${slug}`}>
      <div className="manga-title">
        <div className="overflow-hidden rounded">
          <div style={age_rating === "18+" && ageRating < 18 ? {"filter": "blur(12px)"} : {}} className="manga-title__poster-block" ref={imgRef}></div>
        </div>
        <div className="manga-title__rating-block">
          <AiFillStar className="icon-inverted"/>
          <p className="manga-title__rating-info">{parseFloat(total_rating.toFixed(2))}</p>
        </div>
        <div className="manga-title__age-block">
          <p className="manga-title__age-info">{age_rating}</p>
        </div>
        <div className="manga-title__info">
          <div className="manga-title__info-block">
            <p className="manga-title__main-info">{name}</p>
          </div>
          <div className="manga-title__info-block">
            <p className="manga-title__additional-info">{title_type}</p>
          </div>
        </div>
      </div>
    </a>
  )
}
