import React, { useEffect, useState, useRef } from 'react'
import {RiCloseLine} from 'react-icons/ri'
import { IconContext } from 'react-icons'
import TextInput from '../TextInput/TextInput'
import Button from '../Button/Button'
import useValidator from '../../hooks/useValidator'
import api from '../../services/api'
import { useDispatch } from 'react-redux'
import { changeNotifications } from '../Notifications/notificationsSlice'
import './style.css'
import SettingsType from '../UserSettings/SettingsType'
import mockImg from '../../Assets/user_pict.png'
import { useNavigate } from 'react-router-dom'
import { GrFormClose } from 'react-icons/gr'
import UpdateParticipants from './UpdateParticipants'

export default function UpdateTeam(props) {

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [mode, setMode] = useState()

  const [login, setLogin] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [userImg, setUserImg] = useState("")

  const [loginDirty, setLoginDirty] = useState(false)
  const [slugDirty, setSlugDirty] = useState(false)

  let loginErr = useRef({})
  let slugErr = useRef({})

  const validator = useValidator()

  const [curType, setCurType] = useState(0)

  const [drag, setDrag] = useState(false)

  const inputRef = useRef()

  const handleBlur = (event) => {
    switch(event.target.name)
      {
        case "Название": 
          setLoginDirty(true)
          break
        case "Ссылка": 
          setSlugDirty(true)
          break
        default:
          break
      }
  }

  const closeSignUpMenu = () => {
    props.setVisibility(false)

    setLogin("")
    setSlug("")

    setLoginDirty(false)
    setSlugDirty(false)

    loginErr.current = {}
    slugErr.current = {}
  }

  useEffect(() => {
    setMode(localStorage.getItem("mode"))
    setLogin(props.team.name)
    setSlug(props.team.slug)
    setDescription(props.team.description)
    setUserImg(props.team.picture || mockImg)
  }, [props.visibility, props.team])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(loginErr.current.err || slugErr.current.err)
      return

    setLoading(true)

    const url = `/titles/team/${props.team.slug}/`

    let data = new FormData()
    data.append('name', login)
    data.append('description', description)
    data.append('slug', slug)

    if(userImg instanceof FormData)
      data.append('picture', userImg.get('picture'))

    try {
      await api.patch(url, data)
      setLoading(false)
      dispatch(changeNotifications({type:'success', title:'Изменение информации о команде', text:'Информация о команде была изменена'}))
      let newInfo = {
        name: data.get('name'),
        description: data.get('description'),
        slug: data.get('slug')
      }
      if(userImg instanceof FormData)
        newInfo = {
          ...newInfo,
          picture: URL.createObjectURL(data.get('picture'))
        }
      props.setTeam({
        ...props.team,
        ...newInfo,
      })
      navigate(`/team/${slug}`, {replace: true})
    }
    catch (err) {
      setLoading(false)
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:'Ошибка изменение информации о команде', text:'Авторизируйтесь для редактирования информации о команде'}))
      else
        dispatch(changeNotifications({type:'error', title:'Ошибка изменение информации о команде', text: Object.entries(err.response.data).map(([key, value]) => value)}))
    }
  }

  const changeImg = e => {
    e.preventDefault()
    let file = inputRef.current.files[0]
    getImageFromFile(file)
  }

  const handleStartDrag = e => {
    e.preventDefault()
    setDrag(true)
  }

  const handleLeaveDrag = e => {
    e.preventDefault()
    setDrag(false)
  }

  const handleDrop = e => {
    e.preventDefault()
    let file = e.dataTransfer.files[0]
    console.log(file)
    getImageFromFile(file)
  }

  const getImageFromFile = (file) => {
    if(file.size > process.env.REACT_APP_MAX_IMAGE_SIZE) {
      dispatch(changeNotifications({type:'error', title:'Ошибка загрузки изображения', text:'Размер изображения превышает 5МБ'}))
      return
    }
    let formData = new FormData()
    formData.append('picture', file)
    setUserImg(formData)
    setDrag(false)
  }

  const deleteImg = async () => {

    if(userImg === null || userImg === mockImg)
      return

    const url = `/titles/team/delete-team-picture/${props.team.id}/`

    try {
      await api.delete(url)
      setUserImg(null)
      props.setTeam({
        ...props.team,
        picture: null,
      })
      dispatch(changeNotifications({type:'success', title:'Удаление изображения команды', text:'Изображение команды было удалено'}))
    }
    catch(err) {
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:'Ошибка удаление изображения команды', text:'Авторизируйтесь для удаления изображения команды'}))
      else
        dispatch(changeNotifications({type:'error', title:'Ошибка удаление изображения команды', text: err.response.data.details}))
    }
  }

  const handleDelete = async () => {
    props.setVisibility(false)
    props.setDeleteVisibility(true)
  }

  if(props.visibility)
    return (
      <div className="loginSpace">
        <div className="loginBackground" onClick={() => closeSignUpMenu()}></div>

        <div className="loginContent">
          <div className="closeButtonBlock">
            <div className="closeButton" onClick={() => closeSignUpMenu()}>
              <IconContext.Provider value={mode === 'true' ?{ color: 'white', size: '20px' }:{ color: 'black', size: '20px' }}>
                <RiCloseLine/>
              </IconContext.Provider>
            </div>
          </div>

          <div className="signInHeaderBlock">
            <h2 className="signInHeader">Настройки</h2>
          </div>

          <div className="user-settings__team-settings-type-block">
            <SettingsType index={0} curType={curType} setCurType={setCurType}>Изменить данные</SettingsType>
            <SettingsType index={1} curType={curType} setCurType={setCurType}>Настройки участников</SettingsType>
          </div>

          <div className="formBlock">

            {curType === 0 ?
              <form className="signInForm" onSubmit={e => e.preventDefault()}>
                <TextInput
                  type="text" 
                  setData={validator} 
                  onBlur={handleBlur} 
                  value={login} 
                  setValue={setLogin}
                  name={"Название"}
                  error={loginErr}
                  constraints={{min:1, max:30, isTeamName:true}}
                >
                  {loginDirty && loginErr.current.err ? loginErr.current.text : "Название"}
                </TextInput>

                <TextInput
                  type="text" 
                  setData={validator} 
                  onBlur={handleBlur} 
                  value={slug} 
                  setValue={setSlug}
                  name={"Ссылка"}
                  error={slugErr}
                  constraints={{min:1, max:30, slug:true}}
                >
                  {slugDirty && slugErr.current.err ? slugErr.current.text : "Ссылка"}
                </TextInput>

                <div className="formGroup">
                  <textarea 
                    maxLength={300}
                    autoComplete="off" 
                    className="formInput user-settings__textarea"
                    placeholder=" " 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                  <label className="formLabel">Описание</label>
                </div>

                <div className="user_settings__img-settings">
                  <div className="user_settings__img-block group" onClick={() => deleteImg()}>
                    <img src={userImg instanceof FormData ? URL.createObjectURL(userImg.get('picture')) : userImg} alt={props.team.name}/>
                    <div className="user_settings__hover-effect"></div>
                    <GrFormClose className="icon user_settings__hover-effect-icon" size={"30px"}/>
                  </div>
                  <div className="user-settings__drag-and-drop-block">
                    <label 
                      className="user-settings__drag-and-drop-label default-text"
                      onDragStart={e => handleStartDrag(e)}
                      onDragOver={e => handleStartDrag(e)}
                      onDragLeave={e => handleLeaveDrag(e)}
                      onDrop={e => handleDrop(e)}
                    >
                      {drag ? "Отпустите файл" : "Перетащите сюда новое фото команды"}
                      <input ref={inputRef} hidden type='file' onChange={e => changeImg(e)}/>
                    </label>
                  </div>
                </div>

                <div className="signInButtonBlock w-full flex justify-between">
                  <Button loading={loading} onClick={e => handleSubmit(e)}>Изменить</Button>
                  <Button onClick={() => handleDelete()}>Удалить команду</Button>
                </div>
              </form> 
              :
              curType === 1 ?
                <UpdateParticipants 
                  parts={props.team.participants} 
                  setUpdateVisibility={props.setVisibility}
                  setUpdatePart={props.setUpdatePart}
                  setCurPartSettings={props.setCurPartSettings}
                />
                : null
            }
            
          </div>
        </div>
      </div>
    )
  else
    return null
}
