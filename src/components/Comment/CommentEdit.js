import React, { useEffect, useState } from 'react'
import './style.css'
import Button from '../Button/Button'

export default function CommentEdit({value, setVisibility, callback}) {

  const [comment, setComment] = useState("")

  const [loading, setLoading] = useState(false)

  const onClickHandler = async () => {
    setLoading(true)
    await callback(comment)
    setVisibility(false)
    setLoading(false)
  }

  useEffect(() => {
    setComment(value)
  }, [value])

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
          <label className="formLabel dark:bg-dark-300 bg-light-500">Комментарий</label>
        </div>
      </div>
      <div className="create-comment__options">
        <div className="create-comment__count-info">
          <p className="create-comment__count-text">{comment.length}/1500 символов</p>
        </div>
        <div className="create-comment__buttons">
          <Button onClick={() => setVisibility(false)}>Отменить</Button>
          <Button outline={true} onClick={() => onClickHandler()} loading={loading}>Изменить</Button>
        </div>
      </div>
    </div>
  )
}
