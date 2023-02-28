import React, { useEffect, useState } from 'react'
import './style.css'
import getStringDate from '../Comment/comment.funtions'
import mockImg from '../../Assets/user_pict.png'
import { useSelector } from 'react-redux'
import { selectAge } from '../Login/loginSlice'

export default function NewChapter({volume_number, chapter_number, date_added, name, team, title}) {

  const [creationDate, setCreationDate] = useState("")

  const userAge = useSelector(selectAge)

  useEffect(() => {
    getStringDate(date_added, setCreationDate)
  }, [date_added])

  return (
    <div className="new-chapter group">
      <a href={`/title/${title.slug}`}>
        <div className="new-chapter__poster-block">
          <img style={title.age_rating === "M" && userAge < 18 ? {"filter": "blur(12px)"} : {}} className="new-chapter__poster" src={title.poster} alt={title.name}/>
        </div>
      </a>
      
      <div className="new-chapter__info-block">
        <div className="new-chapter__chapter-info">
          <a href={`/title/${title.slug}`}>
            <div className="new-chapter__chapter-name">
              <p className="new-chapter__name default-text">{title.name}</p>
              <div className="new-chapter__dark-effect"></div>
            </div>
          </a>

          <a href={`/title/${title.slug}/${team.slug}/${volume_number}/${chapter_number}`}>
            <div className="new-chapter__chapter-number">
              <p className="new-chapter__text default-text">{`Том ${volume_number} Глава ${chapter_number} ${name ? " - " : ""} ${name}`}</p>
              <div className="new-chapter__dark-effect"></div>
            </div>
          </a>

          <div className="new-chapter__chapter-date">
            <p className="new-chapter__date">{creationDate}</p>
          </div>
        </div>

        <a className="h-3/4" href={`/team/${team.slug}`}>
          <div className="new-chapter__team-info">
            <div className="new-chapter__poster-team-block">
              <img className="new-chapter__poster-team" src={team ? team.picture || mockImg : mockImg} alt={team ? team.name : '???'}/>
            </div>

            <div className="new-chapter__team-name-block">
              <p className="new-chapter__team-name default-text">{team ? team.name : '???'}</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}
