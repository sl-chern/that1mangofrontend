import React, { useState, useEffect } from 'react'
import './style.css'
import mockImg from '../../Assets/user_pict.png'
import getStringDate from '../Comment/comment.funtions'
import UserNotificationsButton from '../UserNotificationsButton/UserNotificationsButton'
import { MdClose } from 'react-icons/md'
import { BsCheck } from 'react-icons/bs'
import { AiOutlineEye } from 'react-icons/ai'
import { VscTrash } from 'react-icons/vsc'
import api from '../../services/api'
import { useDispatch, useSelector } from 'react-redux'
import { changeNotifications } from '../Notifications/notificationsSlice'
import { changeCount, selectCount } from '../Authorization/userNotificationsSlice'
import { selectAge } from '../Login/loginSlice'

export default function UserNotification({chapter, created_at, friend, id, team, title, type, user, notifications, setNotifications, is_read}) {

  const dispatch = useDispatch()

  const [notTitle, setNotTitle] = useState("")
  const [picture, setPicture] = useState()
  const [text, setText] = useState("")
  const [creationDate, setCreationDate] = useState("")
  const [link, setLink] = useState("")
  const [blur, setBlur] = useState(false)

  const countNots = useSelector(selectCount)

  const userAge = useSelector(selectAge)

  useEffect(() => {

    switch (type.slug) {
      case 1:
        
        setPicture(title.poster)
        setNotTitle(title.name)
        setLink(`/title/${title.slug}/${team.slug}/${chapter.volume_number}/${chapter.chapter_number}`)
        setText(`Том ${chapter.volume_number} Глава ${chapter.chapter_number} ${chapter.name} от команды ${team.name} была добавлена`)
        if(title.age_rating === "M" && userAge < 18)
          setBlur(true)

        break

      case 2:

        setPicture(title.poster)
        setNotTitle(title.name)
        setLink(`/title/${title.slug}`)
        setText(`${type.name} на «${title.title_status.name}»`)
        if(title.age_rating === "M" && userAge < 18)
          setBlur(true)
        
        break

      case 3:
        
        setPicture(friend.profile_pic)
        setNotTitle(friend.username)
        setLink(`/user/${friend.username}`)
        setText(`${type.name}`)

        break

      case 4:

        setPicture(friend.profile_pic)
        setNotTitle(friend.username)
        setLink(`/user/${friend.username}`)
        setText(`${type.name}`)
        
        break
      
      case 5:

        setPicture(team.picture)
        setNotTitle(team.name)
        setLink(`/team/${team.slug}`)
        setText(`${type.name}`)
      
        break

      case 6:

        setPicture(team.picture)
        setNotTitle(team.name)
        setLink(`/team/${team.slug}`)
        setText(`${type.name}`)
        
        break

      case 7:

        setPicture(title.poster)
        setNotTitle(title.name)
        setLink(`/title/${title.slug}?content=comments`)
        setText(`${type.name}`)
        if(title.age_rating === "M" && userAge < 18)
          setBlur(true)
        
        break

      case 8:

        setPicture(title.poster)
        setNotTitle(title.name)
        setLink(`/title/${title.slug}?content=chapters`)
        setText(`Том ${chapter.volume_number} Глава ${chapter.chapter_number} ${chapter.name} от команды ${team.name} была успешно загружена`)
        if(title.age_rating === "M" && userAge < 18)
          setBlur(true)

        break
    
      default:
        break
    }

    let crDate = new Date(created_at)

    setCreationDate(crDate.toLocaleString('ru-RU').replace(',', '').slice(0, -3))
  }, [id])
  
  const onCheckHandler = async () => {
    const url = `/social/notification/${id}/`

    try {
      let checked = [...notifications[1]], notChecked = [...notifications[0]]
      
      let checkedNot = notChecked.filter(element => element.id === id)
      notChecked = notChecked.filter(element => element.id !== id)
      checkedNot[0].is_read = true

      checked = [...checked, checkedNot[0]]
      
      checked.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      dispatch(changeCount(countNots - 1))

      setNotifications({
        '0': notChecked,
        '1': checked
      })

      await api.post(url)
    }
    catch(err) {
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:`Ошибка изменения статуса уведомления`, text:`Авторизируйтесь для изменения статуса уведомления`}))
      else
        dispatch(changeNotifications({type:'error', title:`Ошибка изменения статуса уведомления`, text: Object.entries(err.response.data).map(([key, value]) => value)}))
    }
  }

  const onDeleteHandler = async () => {
    const url = `/social/notification/${id}/`

    try {
      deleteFromNotifications()
      await api.delete(url)
    }
    catch(err) {
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:`Ошибка удаления уведомления`, text:`Авторизируйтесь для удаления уведомления`}))
      else
        dispatch(changeNotifications({type:'error', title:`Ошибка удаления уведомления`, text: Object.entries(err.response.data).map(([key, value]) => value)}))
    }
  }

  const onConfirmHandler = async () => {
    let url

    if(type.slug === 3)
      url = `/social/accept-friend-invite/${id}/`
    else
      url = `/social/accept-team-invite/${id}/`


    try {
      deleteFromNotifications()
      await api.post(url)
    }
    catch(err) {
      console.log(err)
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:`Ошибка подтверждения`, text:`Авторизируйтесь для подтверждения`}))
      else
        dispatch(changeNotifications({type:'error', title:`Ошибка подтверждения`, text: Object.entries(err.response.data).map(([key, value]) => value)}))
    }
  }

  const deleteFromNotifications = () => {
    let checked = [...notifications[1]], notChecked = [...notifications[0]]
      
    if(is_read) {
      checked = checked.filter(element => element.id !== id)
    }
    else {
      notChecked = notChecked.filter(element => element.id !== id)
    }
    
    dispatch(changeCount(notChecked.length))

    setNotifications({
      '0': notChecked,
      '1': checked
    })
  }

  return (
    <div className="user-notification">
      <a href={`${link}`} className="user-notification__picture-link">
        <div className="user-notification__picture-block">
          <img style={blur ? {"filter": "blur(4px)"} : {}} className="user-notification__picture" src={picture ?? mockImg} alt={notTitle}/>
        </div>
      </a>
      <div className="user-notification__content">
        <div className="user-notification__text-content">
          <div className="user-notification__notification-title-block">
            <p className="user-notification__notification-title">{notTitle}</p>
          </div>
          <div className="user-notification__notification-text-block">
            <p className="user-notification__notification-text">{text}</p>
            <p className="user-notification__notification-date">{creationDate}</p>
          </div>
        </div>
        <div className="user-notification__buttons">
          {
            type.slug === 3 || type.slug === 5 ?
              <div className="user-notification__buttons-block">
                <UserNotificationsButton onClick={onConfirmHandler}>
                  <BsCheck size='20px' className="icon"/>
                </UserNotificationsButton>
                <UserNotificationsButton onClick={onDeleteHandler}>
                  <MdClose size='20px' className="icon"/>
                </UserNotificationsButton>
              </div>
              : null
          }
          
          <div className="user-notification__buttons-block">
            {
              !is_read ?
                <UserNotificationsButton onClick={onCheckHandler}>
                  <AiOutlineEye size='20px' className="icon"/>
                </UserNotificationsButton>
                : null
            }
            <UserNotificationsButton onClick={onDeleteHandler}>
              <VscTrash size='20px' className="icon"/>
            </UserNotificationsButton>
          </div>
        </div>
      </div>
    </div>
  )
}
