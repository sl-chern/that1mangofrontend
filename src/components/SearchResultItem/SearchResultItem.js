import React from 'react'
import './style.css'
import mockImg from '../../Assets/user_pict.png'
import { AiFillStar } from 'react-icons/ai'

export default function SearchResultItem({name, picture, onClick, rating, type}) {

  return (
    <div className="search-result-item group" onClick={onClick}>
      <div className="search-result-item__picture-block">
        <img className="search-result-item__picture" src={picture ?? mockImg} alt={name}/>
      </div> 
      {
        !rating ?
          <div className="search-result-item__name-block">
            <p className="search-result-item__name">{name}</p>
            <div className="search-result-item__dark-effect"></div>
          </div> 
          :
          <div className="search-result-item__info-block">
            <div className="search-result-item__name-block">
              <p className="search-result-item__name">{name}</p>
              <div className="search-result-item__dark-effect"></div>
            </div> 
            <div className="search-result-item__rating-block">
              <p className="popular-title__type">{type}</p>
              <div>
                <AiFillStar className="icon" size="20px"/>
              </div>
              <p className="popular-title__mark">{rating}</p>
            </div>
          </div>
      }
    </div>
  )
}
