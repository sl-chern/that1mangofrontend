import React, { useEffect, useState } from 'react'
import './style.css'
import { useDispatch, useSelector } from 'react-redux'
import mockImg from '../../Assets/user_pict.png'
import getStringDate from './comment.funtions'
import { AiFillLike, AiFillDislike, AiOutlineDislike, AiOutlineLike } from 'react-icons/ai'
import api from '../../services/api'
import { selectTheme } from '../Header/themeSlice'
import { Oval } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { changeNotifications } from '../Notifications/notificationsSlice'
import { BsReplyFill } from 'react-icons/bs'
import CreateComment from '../CreateComment/CreateComment'
import { selectId } from '../Login/loginSlice'
import CommentEdit from './CommentEdit'

export default function Comment({comment, count_replies, creation_date, dislikes, id, is_deleted, likes, vote, user = {}, titleId, is_author, comments, setComments}) {

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const darkMode = useSelector(selectTheme)

  const [replies, setReplies] = useState([])
  const [creationDate, setCreationDate] = useState("")

  const [visibility, setVisibility] = useState(false)

  const [userVote, setUserVote] = useState(vote)

  const [loadingReplies, setLoadingReplies] = useState(false)

  const [likesAmount, setLikesAmount] = useState(likes)
  const [dislikesAmount, setDislikesAmount] = useState(dislikes)

  const [replyVisibility, setReplyVisibility] = useState(false)

  const [repliesCount, setRepliesCount] = useState(count_replies)

  const [isAuthor, setIsAuthor] = useState(false)

  const [isDeleted, setIsDeleted] = useState(false)

  const userId = useSelector(selectId)

  const [editing, setEditing] = useState(false)

  const [userComment, setUserComment] = useState("")

  const [repliesLoaded, setRepliesLoaded] = useState(false)

  useEffect(() => {
    setReplies([])

    setEditing(false)
    setReplyVisibility(false)
    setVisibility(false)

    setUserComment(comment)

    setUserVote(vote)

    setLikesAmount(likes)
    setDislikesAmount(dislikes)

    setRepliesCount(count_replies)

    setIsAuthor(is_author)

    setIsDeleted(is_deleted)

    getStringDate(creation_date, setCreationDate)
  }, [comment, count_replies, creation_date, dislikes, id, is_deleted, likes, vote, user, is_author])

  useEffect(() => {
    let commentsArray = [...comments]

    let curComment = commentsArray.find(element => element.id === id)
    let curCommentIndex = commentsArray.findIndex(element => element.id === id)

    commentsArray[curCommentIndex] = {
      ...curComment,
      vote: userVote,
      dislikes: dislikesAmount,
      likes: likesAmount,
      count_replies: repliesCount,
      is_deleted: isDeleted
    }

    setComments(commentsArray)
  }, [userVote, repliesCount, isDeleted])

  useEffect(() => {
    if(userId === -1)
      return

    if(id === null)
      setIsAuthor(false)
  }, [userId])

  const onClickHandler = async () => {
    if(!visibility) {
      setVisibility(true)
      if(!repliesLoaded) {
        setLoadingReplies(true)
        
        const url = `/social/comments/replies/${id}/`
        const res = await api.get(url)

        setReplies(res.data.results)
        setLoadingReplies(false)

        setRepliesLoaded(true)
      }
    }
    else {
      setVisibility(false)
    }
  }

  const onLikeHandler = async () => {
    if(userVote)
      removeVote()
    else
      setVote(true)
  }

  const onDislikeHandler = async () => {
    if(userVote || userVote === null)
      setVote(false)
    else
      removeVote()
  }

  const setVote = async (vote) => {
    if(userId === null){
      dispatch(changeNotifications({type:'error', title:`Ошибка оценивания`, text:`Авторизируйтесь для оценивания комментариев`}))
      return
    }

    const url = `/social/comments/vote/`

    const data = {
      comment: id,
      vote: vote,
    }

    try {
      if(userVote === true) 
        setLikesAmount(likesAmount - 1)
      if(userVote === false) 
        setDislikesAmount(dislikesAmount - 1)
      setUserVote(vote)
      vote ? setLikesAmount(likesAmount + 1) : setDislikesAmount(dislikesAmount + 1)
      await api.post(url, JSON.stringify(data))
    }
    catch(err) {
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:`Ошибка оценивания`, text:`Авторизируйтесь для оценивания комментариев`}))
      else
        dispatch(changeNotifications({type:'error', title:`Ошибка оценивания`, text: Object.entries(err.response.data).map(([key, value]) => value)}))
    }
  }

  const removeVote = async () => {
    if(userId === null) {
      dispatch(changeNotifications({type:'error', title:`Ошибка оценивания`, text:`Авторизируйтесь для оценивания комментариев`}))
      return
    }

    const url = `/social/comments/vote-delete/${id}/`

    try {
      userVote ? setLikesAmount(likesAmount - 1) : setDislikesAmount(dislikesAmount - 1)
      setUserVote(null)
      await api.delete(url)
    }
    catch(err) {
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:`Ошибка оценивания`, text:`Авторизируйтесь для удаления оценки комментария`}))
      else
        dispatch(changeNotifications({type:'error', title:`Ошибка оценивания`, text: Object.entries(err.response.data).map(([key, value]) => value)}))
    }
  }

  const insertReply = (comment) => {
    setReplyVisibility(false)
    setRepliesCount(repliesCount + 1)
    setReplies([...replies, comment])
  }

  const deleteComment = async () => {
    const data = {
      is_deleted: true,
      id: id,
      comment: userComment
    }



    try {
      await updateData(data)
      dispatch(changeNotifications({type:'success', title:`Удаление комментария`, text:`Комментарий был успешно удален`}))
      setIsDeleted(true)
    }
    catch(err) {
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:`Ошибка удаления комментария`, text:`Авторизируйтесь для удаления комментария`}))
      else
        dispatch(changeNotifications({type:'error', title:`Ошибка удаления комментария`, text: Object.entries(err.response.data).map(([key, value]) => value)}))
    }
  }

  const updateComment = async (value) => {
    const data = {
      id: id,
      comment: value
    }

    try {
      await updateData(data)
      dispatch(changeNotifications({type:'success', title:`Редактирование комментария`, text:`Комментарий был успешно отредактирован`}))
      setUserComment(value)
    }
    catch(err) {
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:`Ошибка редактирования комментария`, text:`Авторизируйтесь для редактирования комментария`}))
      else
        dispatch(changeNotifications({type:'error', title:`Ошибка редактирования комментария`, text: Object.entries(err.response.data).map(([key, value]) => value)}))
    }
  }

  const updateData = async (data) => {
    const url = `/social/comments/update/`

    try {
      await api.patch(url, data)
    }
    catch(err) {
      throw(err)
    }
  }

  return (
    <div className="comment">
      <div className="comment__comment-block">
        <div className="comment__user-picture-block" onClick={() => navigate(`/user/${user.username}`)}>
          <img className="comment__user-picture" src={user ? user.profile_pic || mockImg : mockImg} alt={user ? user.username : '???'}/>
        </div>
        <div className="comment__comment-content">
          <div className="comment__comment-header">
            <div className="comment__comment-info">
              <div className="comment__info-block hover:cursor-pointer" onClick={() => navigate(`/user/${user.username}`)}>
                <p className="comment__username">{user ? user.username : '???'}</p>
              </div>
              <div className="comment__info-block">
                <p className="comment__date">{creationDate}</p>
              </div>
            </div>

            {
              isAuthor && !isDeleted && userId !== null ?
                <div className="comment__comment-buttons">
                  <div className="comment__replies-button" onClick={() => setEditing(true)}>
                    <p className="comment__button-text">Редактировать</p>
                  </div>
                  <div className="comment__replies-button" onClick={() => deleteComment()}>
                    <p className="comment__button-text">Удалить</p>
                  </div>
                </div>
                : null
            }
            
          </div>
          <div className="comment__text-block">
            
            {
              isDeleted ?
              <p className="comment__deleted-text">Комментарий был удален</p>
                : editing ? 
                  <CommentEdit 
                    value={userComment} 
                    setVisibility={setEditing}
                    callback={updateComment}
                  />
                  : <p className="comment__text">{userComment}</p>
            }
            
          </div>
          <div className="comment__options">
            <div className="comment__mark-block">
              <div className="comment__vote-button" onClick={() => onLikeHandler()}>
                <div>
                  {userVote ? <AiFillLike className="icon" size="16px"/> : <AiOutlineLike className="icon" size="16px"/>}
                </div>
                <p className="comment__vote-count">{likesAmount}</p>
              </div>
              <div className="comment__vote-button" onClick={() => onDislikeHandler()}>
                <div>
                  {userVote === false ? <AiFillDislike className="icon" size="16px"/> : <AiOutlineDislike  className="icon" size="16px"/>}
                </div>
                <p className="comment__vote-count">{dislikesAmount}</p>
              </div>
            </div>
            <div className="comment__reply-button" onClick={() => setReplyVisibility(true)}>
              <div>
                <BsReplyFill className="icon" size="16px"/>
              </div>
              <p className="comment__vote-count">Ответить</p>
            </div>
            
            {
              repliesCount > 0 ?
                <div className="comment__replies-button" onClick={() => onClickHandler()}>
                  <p className="comment__button-text">{visibility ? `Скрыть ответы` : `Показать ответы(${repliesCount})`}</p>
                </div>
              : null
            }
            
          </div>
        </div>
      </div>
      {
        replyVisibility ?
          <div className="comment__create-reply">
            <CreateComment 
              label={'Ответить'}
              replyTo={id}
              title={titleId}
              setVisibility={setReplyVisibility}
              callback={insertReply}
            />
          </div>
          :null
      }
      {
        visibility ? 
          loadingReplies ?
            <div className="spinnerBlock">
              <Oval color={darkMode ? "white" : "black"} secondaryColor={darkMode ? "white" : "black"} height="50px" width="50px"/>
            </div>
            : <div className="comment-replies">
              {replies.map((item, index) => 
                <Comment 
                  {...item}
                  comments={replies}
                  setComments={setReplies}
                  key={`replay${id}${index}`}
                  titleId={titleId}
                />
              )}
            </div>
        : null
      }
    </div>
  )
}
