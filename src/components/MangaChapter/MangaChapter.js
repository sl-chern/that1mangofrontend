import React, { useEffect, useState } from 'react'
import './style.css'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import api from '../../services/api'
import { useDispatch, useSelector } from 'react-redux'
import { changeNotifications } from '../Notifications/notificationsSlice'
import { selectIsStaff } from '../Login/loginSlice'
import { VscTrash } from 'react-icons/vsc'
import { TbPencil } from 'react-icons/tb'

export default function MangaChapter({volume_number, chapter_number, date_added, name, likes, id, liked_by_user, isParticipant, setCurChapter, setDeleteVisibility, setEditVisibility, titleSlug, teamSlug}) {

  const dispatch = useDispatch()

  const [like, setLike] = useState(liked_by_user)
  const [lukases, setLukases] = useState(likes)

  const isStaff = useSelector(selectIsStaff)

  useEffect(() => {
    setLike(liked_by_user)
    setLukases(likes)
  }, [liked_by_user, likes])

  const handleClick = async () => {
    if(like)
      return

    const url = "/titles/chapter/like/"

    const data = {
      chapter_id: id
    }
    
    try {
      await api.post(url, JSON.stringify(data))
      setLike(true)
      setLukases(lukases + 1)
    }
    catch(err) {
      if(err.response.data.refresh) {
        dispatch(changeNotifications({type:'error', title:'Лайк не поствален', text:'Авторизируйтесь для проставления лайков'}))
      }
      else {
        dispatch(changeNotifications({type:'error', title:'Ошибка', text:'Лайк не поствален'}))
      }
    }
  }

  const editHandler = () => {
    setCurChapter({id, volume_number, chapter_number, name})
    setEditVisibility(true)
  }

  const deleteHandler = () => {
    setCurChapter({id})
    setDeleteVisibility(true)
  }

  return (
    <div className="manga-chapter">
      <a className="manga-chapter__link" href={`/title/${titleSlug}/${teamSlug}/${volume_number}/${chapter_number}`}>
        <div className="manga-chapter__content group">
          <div className="manga-chapter__info">
            <p className="manga-chapter__info-text default-text">{`Том ${volume_number} Глава ${chapter_number}`}</p>
          </div>
          <div className="manga-chapter__title-block">
            <p className="manga-chapter__title default-text">{name}</p>
            <div className="manga-chapter__title-dark"></div>
          </div>
          <div className="manga-chapter__data-block">
            <p className="manga-chapter__title default-text">{`${new Date(date_added).toLocaleString('ru-RU').slice(0, 10)}`}</p>
          </div>
        </div>
      </a>
      <div className="manga-chapter__chapter-buttons">
        {
          isParticipant ?
            <div className="manga-chapter__chapter-button" onClick={() => editHandler()}>
              <TbPencil className="icon"/>
            </div> 
            : null
        }
        {
          isParticipant || isStaff ? 
            <div className="manga-chapter__chapter-button" onClick={() => deleteHandler()}>
              <VscTrash className="icon"/>
            </div>
            : null
        }
        <div className="manga-chapter__like" onClick={() => handleClick()}>
          <div className="manga-chapter__like-content">
            <div className="manga-chapter__like_button">
              {like ?
                <AiFillHeart className="icon"/> :
                <AiOutlineHeart className="icon"/>
              }
            </div>
            <div className="manga-chapter__like_info">
              <p className="manga-chapter__like-text default-text">{lukases}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
