import React, { useState } from 'react'
import './style.css'
import Button from '../Button/Button'
import api from '../../services/api'
import { useDispatch, useSelector } from 'react-redux'
import { changeNotifications } from '../Notifications/notificationsSlice'
import { selectUser } from '../Login/loginSlice'

export default function CreateComment({label, replyTo, title, setVisibility, callback}) {

  const userInfo = useSelector(selectUser)

  const [comment, setComment] = useState("")

  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  const onClickHandler = async () => {

    setLoading(true)

    const url = `/social/comments/`

    let data = {
      title: title,
      comment: comment
    }

    if(replyTo)
      data = {
        ...data,
        reply_to: replyTo
      }
    
    try {
      const res = await api.post(url, JSON.stringify(data))
      if(callback)
        callback({
          ...res.data,
          user: {
            username: userInfo.username,
            profile_pic: userInfo.profile_pic,
          },
          vote: null,
          likes: 0,
          total_likes: 0,
          dislikes: 0,
          is_author: true,
          count_replies: 0
        })
      setComment("")
    }
    catch(err) {
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:`Ошибка отправки комментария`, text:`Авторизируйтесь для отправки комментария`}))
      else
        dispatch(changeNotifications({type:'error', title:`Ошибка отправки комментария`, text: Object.entries(err.response.data).map(([key, value]) => value)}))
    }
    
    setLoading(false)
  }

  return (
    <div className="create-comment">
      <div className="create-comment__comment">
        <div className="formGroup">
          <textarea 
            maxLength={1500}
            autoComplete="off" 
            className="formInput comment__textarea"
            placeholder=" " 
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <label className="formLabel bg-light-300">{label}</label>
        </div>
      </div>
      <div className="create-comment__options">
        <div className="create-comment__count-info">
          <p className="create-comment__count-text">{comment.length}/1500 символов</p>
        </div>
        <div className="create-comment__buttons">

          {
            replyTo ?
              <Button onClick={() => setVisibility(false)}>Отменить</Button>
              : null
          }
          
          <Button outline={true} onClick={() => onClickHandler()} loading={loading}>Отправить</Button>
        </div>
      </div>
    </div>
  )
}
