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
import SettingsType from './SettingsType'
import mockImg from '../../Assets/user_pict.png'
import { useNavigate } from 'react-router-dom'
import { GrFormClose } from 'react-icons/gr'
import { change, changePict, changeAge } from '../Login/loginSlice'
import ChangePassword from './ChangePassword'

export default function UserSettings(props) {

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [mode, setMode] = useState()
  
  const [dateError, setDateError] = useState(false)
  const [dateErrorText, setDateErrorText] = useState("")

  const [login, setLogin] = useState("")
  const [description, setDescription] = useState("")
  const [userImg, setUserImg] = useState("")
  const [date, setDate] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")

  const [loginDirty, setLoginDirty] = useState(false)
  const [dateDirty, setDateDirty] = useState(false)
  const [monthDirty, setMonthDirty] = useState(false)
  const [yearDirty, setYearDirty] = useState(false)

  let loginErr = useRef({})
  let dateErr = useRef({})
  let monthErr = useRef({})
  let yearErr = useRef({})

  const validator = useValidator()

  const [curType, setCurType] = useState(0)

  const [drag, setDrag] = useState(false)

  const inputRef = useRef()

  const handleBlur = (event) => {
    switch(event.target.name)
      {
        case "Логин": 
          setLoginDirty(true)
          break
        case "День": 
          setDateDirty(true)
          break
        case "Месяц": 
          setMonthDirty(true)
          break
        case "Год": 
          setYearDirty(true)
          break
        default:
          break
      }
  }

  const closeSignUpMenu = () => {
    props.setVisibility(false)

    setLogin("")
    setDate("")
    setMonth("")
    setYear("")

    setLoginDirty(false)
    setDateDirty(false)
    setMonthDirty(false)
    setYearDirty(false)

    loginErr.current = {}
    dateErr.current = {}
    monthErr.current = {}
    yearErr.current = {}
  }

  useEffect(() => {
    let birthDate = new Date(props.user.birth_date)

    setMode(localStorage.getItem("mode"))
    setLogin(props.user.username)
    setDescription(props.user.about)
    setUserImg(props.user.profile_pic || mockImg)
    setDate(birthDate.getDate().toString())
    setMonth((birthDate.getMonth() + 1).toString())
    setYear(birthDate.getFullYear().toString())
  }, [props.visibility, props.user])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(loginErr.current.err || dateErr.current.err || monthErr.current.err || yearErr.current.err)
      return

    setLoading(true)

    const url = `/users/user/update/${props.user.id}/`

    let data = new FormData()
    data.append('username', login)
    data.append('about', description)
    data.append('birth_date', `${year.slice(-4)}-${month.slice(-2)}-${date.slice(-2)}`)

    if(userImg instanceof FormData)
      data.append('profile_pic', userImg.get('profile_pic'))

    try {
      await api.patch(url, data)

      setLoading(false)

      dispatch(changeNotifications({type:'success', title:'Изменение информации пользователя', text:'Информация пользователя была изменена'}))

      let newInfo = {
        username: data.get('username'),
        about: data.get('about'),
        birth_date: data.get('birth_date')
      }

      if(userImg instanceof FormData)
        newInfo = {
          ...newInfo,
          profile_pic: URL.createObjectURL(data.get('profile_pic'))
        }

      props.setUser({
        ...props.user,
        ...newInfo,
      })

      dispatch(change(data.get('username')))

      if(userImg instanceof FormData) {
        dispatch(changePict(URL.createObjectURL(data.get('profile_pic'))))
      }

      const userAge = new Date(Date.now() - new Date(newInfo.birth_date)).getUTCFullYear() - 1970

      dispatch(changeAge(userAge))

      navigate(`/user/${login}`, {replace: true})
    }
    catch (err) {
      setLoading(false)
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:'Ошибка изменение информации пользователя', text:'Авторизируйтесь для редактирования информации пользователя'}))
      else
        dispatch(changeNotifications({type:'error', title:'Ошибка изменение информации пользователя', text: Object.entries(err.response.data).map(([key, value]) => value)}))
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
    getImageFromFile(file)
  }

  const getImageFromFile = (file) => {
    if(file.size > process.env.REACT_APP_MAX_IMAGE_SIZE) {
      dispatch(changeNotifications({type:'error', title:'Ошибка загрузки изображения', text:'Размер изображения превышает 5МБ'}))
      return
    }
    let formData = new FormData()
    formData.append('profile_pic', file)
    setUserImg(formData)
    setDrag(false)
  }

  const deleteImg = async () => {

    if(userImg === null || userImg === mockImg)
      return

    const url = `/users/user/delete-profile-pic/${props.user.id}/`

    try {
      await api.delete(url)
      setUserImg(null)
      props.setUser({
        ...props.user,
        profile_pic: null,
      })
      dispatch(changePict(null))
      dispatch(changeNotifications({type:'success', title:'Удаление изображения профиля', text:'Изображение профиля было удалено'}))
    }
    catch(err) {
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:'Ошибка удаление изображения профиля', text:'Авторизируйтесь для удаления изображения профиля'}))
      else
        dispatch(changeNotifications({type:'error', title:'Ошибка удаление изображения профиля', text: err.response.data.details}))
    }
  }

  const handleDelete = () => {
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

          <div className="user-settings__settings-type-block">
            <SettingsType index={0} curType={curType} setCurType={setCurType}>Изменить данные</SettingsType>
            <SettingsType index={1} curType={curType} setCurType={setCurType}>Смена пароля</SettingsType>
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
                  name={"Логин"}
                  error={loginErr}
                  constraints={{min:3, max:30, isLogin: true}}
                >
                  {loginDirty && loginErr.current.err ? loginErr.current.text : "Логин"}
                </TextInput>

                <div className="sign-up__date-block">
                  <div className="sign-up__date-header">
                    <p className="sign-up__date-header-text">Дата рождения</p>
                  </div>
                  <div className="sign-up__date-inputs-block">
                    <div className="sign-up__date-input">
                      <TextInput
                        type="text" 
                        setData={validator} 
                        onBlur={handleBlur} 
                        value={date} 
                        setValue={setDate}
                        name={"День"}
                        error={dateErr}
                        constraints={{isDay: {month: month.length > 0 ? +month : null, year: year.length > 0 ? +year : null}}}
                      >
                        {dateDirty && (dateErr.current.err || dateError) ? dateErrorText : "День"}
                      </TextInput>
                    </div>

                    <div className="sign-up__date-input">
                      <TextInput
                        type="text" 
                        setData={validator} 
                        onBlur={handleBlur} 
                        value={month} 
                        setValue={setMonth}
                        name={"Месяц"}
                        error={monthErr}
                        constraints={{minNumb:1, maxNumb:12}}
                      >
                        {monthDirty && monthErr.current.err ? monthErr.current.text : "Месяц"}
                      </TextInput>
                    </div>

                    <div className="sign-up__date-input">
                      <TextInput
                        type="text" 
                        setData={validator} 
                        onBlur={handleBlur} 
                        value={year} 
                        setValue={setYear}
                        name={"Год"}
                        error={yearErr}
                        constraints={{minNumb:new Date().getFullYear() - 100, maxNumb:new Date().getFullYear() - 3}}
                      >
                        {yearDirty && yearErr.current.err ? yearErr.current.text : "Год"}
                      </TextInput>
                    </div>
                  </div>
                </div>

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
                    <img src={userImg instanceof FormData ? URL.createObjectURL(userImg.get('profile_pic')) : userImg} alt={props.user.username}/>
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
                      {drag ? "Отпустите файл" : "Перетащите сюда новое фото профиля"}
                      <input ref={inputRef} hidden type='file' onChange={e => changeImg(e)}/>
                    </label>
                  </div>
                </div>

                <div className="signInButtonBlock w-full flex justify-between">
                  <Button loading={loading} onClick={e => handleSubmit(e)}>Изменить</Button>
                  <Button onClick={() => handleDelete()}>Удалить аккаунт</Button>
                </div>
              </form> 
              :
              curType === 1 ?
                <ChangePassword />
                : null
            }
            
          </div>
        </div>
      </div>
    )
  else
    return null
}
