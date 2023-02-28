import React, {useState, useEffect} from 'react'
import api from '../../services/api'
import {RiCloseLine} from 'react-icons/ri'
import './style.css'
import RatingButton from './RatingButton'
import { useDispatch } from 'react-redux'
import { change, changeId, changeEmail, changeIsStaff, changeUser} from '../Login/loginSlice'

export default function RatingWindow({visibility, setVisibility, id, setMarksAmount, setRating, setMarks, titleRating, setAllMarks, setTitleRating}) {

  const dispatch = useDispatch()

  const [mark, setMark] = useState(null)

  const marks = [
    {"10": "До ДжоДжо недотягивает"},
    {"9": "Лучше коносубы"},
    {"8": "Лучше демон слейера"},
    {"7": "Лучше геройки"},
    {"6": "Лучше цитруса"},
    {"5": "Лучше пластиковых воспоминаний"},
    {"4": "Лучше помолвленой с незнакомцем"},
    {"3": "Лучше токийских мстюнов"},
    {"2": "Лучше первого сезона цикад"},
    {"1": "Лучше некопары"},
  ]

  const url = "/titles/title/get-rate/"

  useEffect(() => {

    const data = {
      title: id
    }

    if(id && !mark) {
      api.post(url, JSON.stringify(data))
      .then(res => {
        setMark(res.data.rating)
      })
      .catch(res => {
        if(res.response.status === 401) {
          localStorage.removeItem("access")
          localStorage.removeItem("refresh")

          dispatch(change(""))
          dispatch(changeId(null))
          dispatch(changeIsStaff(false))
          dispatch(changeEmail(""))
          dispatch(changeUser(null))
        }
        setMark(null)
      })
    }
    
  }, [id, visibility])

  if(visibility)
    return (
      <div className="loginSpace">
        <div className="loginBackground" onClick={() => setVisibility(false)}></div>

        <div className="loginContent">
          <div className="closeButtonBlock">
            <div className="closeButton" onClick={() => setVisibility(false)}>
              <RiCloseLine size="20px" className="icon"/>
            </div>
          </div>

          <div className="signInHeaderBlock">
            <h2 className="signInHeader">Оценить</h2>
          </div>

          <div className="ratingButtonsBlock">
            {marks.map((item, index) => 
              <RatingButton 
                mark={item} 
                key={`ratBu${index}`} 
                curMark={mark} 
                setMark={setMark} 
                id={id}
                setMarksAmount={setMarksAmount}
                setRating={setRating}
                setMarks={setMarks}
                titleRating={titleRating}
                setAllMarks={setAllMarks}
                setTitleRating={setTitleRating}
              />
            )}
          </div>
        </div>
      </div>
    )
  else
    return null
}