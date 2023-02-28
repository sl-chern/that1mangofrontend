import React, { useEffect, useState, useRef } from 'react'
import {RiCloseLine} from 'react-icons/ri'
import { IconContext } from 'react-icons'
import TextInput from '../TextInput/TextInput'
import Button from '../Button/Button'
import useValidator from '../../hooks/useValidator'
import api from '../../services/api'
import { useDispatch } from 'react-redux'
import { changeNotifications } from '../../components/Notifications/notificationsSlice'
import slugify from 'slugify'

export default function AddTeam(props) {

  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const [mode, setMode] = useState()

  const [email, setEmail] = useState("")
  const [slug, setSlug] = useState("")

  const [emailDirty, setEmailDirty] = useState(false)
  const [slugDirty, setSlugDirty] = useState(false)

  let emailErr = useRef({})
  let slugErr = useRef({})

  const validator = useValidator()

  const handleBlur = (event) => {
    switch(event.target.name)
      {
        case "Название": 
          setEmailDirty(true)
          break
        case "Ссылка": 
          setSlugDirty(true)
          break
        default:
          break
      }
  }

  const closeResetMenu = () => {
    props.setVisibility(false)

    setEmail("")
    setSlug("")

    setEmailDirty(false)
    setSlugDirty(false)

    emailErr.current = {}
    slugErr.current = {}
  }

  useEffect(() => {
    setMode(localStorage.getItem("mode"))
  }, [props.visibility])

  const handleSubmit = async (e) => {
    e.preventDefault()

    setEmailDirty(true)
    setSlugDirty(true)

    if(emailErr.current.err || slugErr.current.err)
      return

    setLoading(true)

    const url = '/titles/team/'

    const data = {
      name: email,
      slug: slug,
    }

    try {
      await api.post(url, JSON.stringify(data))
      setLoading(false)
      props.setVisibility(false)
      dispatch(changeNotifications({type:'success', title:'Создание команды', text:'Команда была успешно создана'}))
      props.setTeams([
        ...props.teams,
        {slug:slug, name:email, picture:null}
      ])
    }
    catch(err) {
      setLoading(false)
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:'Ошибка создания команды', text:'Авторизируйтесь для создания команды'}))
      else
        dispatch(changeNotifications({type:'error', title:'Ошибка создания команды', text: Object.entries(err.response.data).map(([key, value]) => value)}))
    }
  }

  const setNameAndSlug = value => {
    setEmail(value)
    if(!slugDirty)
      validator(slugify(value, {
        replacement: '-', 
        lower: true,
      }), setSlug, slugErr, {min:1, max:30, slug:30})
  }

  if(props.visibility)
    return (
      <div className="loginSpace">
        <div className="loginBackground" onClick={() => closeResetMenu()}></div>

        <div className="loginContent">
          <div className="closeButtonBlock">
            <div className="closeButton" onClick={() => closeResetMenu()}>
              <IconContext.Provider value={mode === 'true' ?{ color: 'white', size: '20px' }:{ color: 'black', size: '20px' }}>
                <RiCloseLine/>
              </IconContext.Provider>
            </div>
          </div>

          <div className="signInHeaderBlock">
            <h2 className="signInHeader">Добавить Команду</h2>
          </div>

          <div className="resetTextBlock">
            <p className="resetText">Введите данные для создания команды</p>
          </div>

          <div className="formBlock">
            <form className="signInForm" onSubmit={e => handleSubmit(e)}>

              <TextInput
                type="text" 
                setData={validator} 
                onBlur={handleBlur} 
                value={email} 
                setValue={setNameAndSlug}
                name={"Название"}
                error={emailErr}
                constraints={{min:1, max:30, isTeamName:true}}
              >
                {emailDirty && emailErr.current.err ? emailErr.current.text : "Название"}
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

              <div className="signInButtonBlock">
                <Button loading={loading}>Добавить</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  else
    return null
}
