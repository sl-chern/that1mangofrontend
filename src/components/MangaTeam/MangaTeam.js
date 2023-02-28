import React, { useState, useEffect } from 'react'
import './style.css'
import { AiOutlineBell, AiFillBell } from 'react-icons/ai'
import api from '../../services/api'
import { useDispatch } from 'react-redux'
import { changeNotifications } from '../Notifications/notificationsSlice'

export default function MangaTeam({id, manga_id, name, picture, curTeam, setCurTeam, index, subscribedTeams}) {

  const dispatch = useDispatch()

  const [classList, setClassList] = useState("manga-team group")
  const [iconClassList, setIconClassList] = useState("icon")
  const [textClassList, setTextClassList] = useState("manga-team__name default-text")
  const [buttonClassList, setButtonClassList] = useState("manga-team__subscription-button")
  const [darkEffect, setDarkEffect] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    const ind = subscribedTeams.findIndex(element => element === id)
    if(ind !== -1)
      setSubscribed(true)
    else
      setSubscribed(false)
  }, [id])

  useEffect(() => {
    if(index === curTeam) {
      setClassList("manga-team manga-team_active group")
      setIconClassList("icon-inverted")
      setTextClassList("manga-team__name default-text default-text_inverted")
      setButtonClassList("manga-team__subscription-button manga-team__subscription-button_active")
      setDarkEffect("manga-team__name-block-dark manga-team__name-block-dark_active")
    }
    else {
      setClassList("manga-team group")
      setIconClassList("icon")
      setTextClassList("manga-team__name default-text")
      setButtonClassList("manga-team__subscription-button")
      setDarkEffect("manga-team__name-block-dark")
    }
  }, [curTeam])

  const handleSubscribe = async () => {
    const data = {
      team: id,
      title: manga_id
    }

    if(subscribed) {
      try {
        await api.delete('/social/unsubscribe/', {data: JSON.stringify(data)})
        setSubscribed(false)
        dispatch(changeNotifications({type: 'success', title: 'Отписка', text: 'Вы были отписаны от обновлений'}))
      }
      catch(err) {
        if(err.response.data.refresh)
          dispatch(changeNotifications({type: 'error', title: 'Ошибка отмены подписки', text: 'Авторизируйтесь для отмены подписки'}))
        else
          dispatch(changeNotifications({type: 'error', title: 'Ошибка', text: 'Подписка не была отмена'}))
      }
    }
    else {
      try {
        await api.post('/social/subscribe/', JSON.stringify(data))
        setSubscribed(true)
        dispatch(changeNotifications({type: 'success', title: 'Подписка', text: 'Вы были подписаны на обновления'}))
      }
      catch(err) {
        if(err.response.data.refresh)
          dispatch(changeNotifications({type: 'error', title: 'Ошибка оформления подписки', text: 'Авторизируйтесь для оформления подписки'}))
        else
          dispatch(changeNotifications({type: 'error', title: 'Ошибка', text: 'Подписка не была оформлена'}))
      }
    }
  }

  return (
    <div className="manga-team-container ">
      <div className={classList} onClick={() => setCurTeam(index)}>
        <div className="manga-team__img-block">
          <img className="manga-team__img" src={picture} alt={name}/>
        </div>
        <div className="manga-team__name-block">
          <p className={textClassList}>{name}</p>
          <div className={darkEffect}></div>
        </div>
      </div>
      <div className={buttonClassList} onClick={() => handleSubscribe()}>
        {subscribed ?
          <AiFillBell className={iconClassList} size="20px"/> :
          <AiOutlineBell className={iconClassList} size="20px"/> 
        }
      </div>
    </div>
    
  )
}
