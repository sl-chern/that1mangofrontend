import React, { useEffect, useState, useRef } from 'react'
import {RiCloseLine} from 'react-icons/ri'
import { IconContext } from 'react-icons'
import TextInput from '../TextInput/TextInput'
import Button from '../Button/Button'
import useValidator from '../../hooks/useValidator'
import api from '../../services/api'
import Checkbox from '../Checkbox/Checkbox'
import { useDispatch } from 'react-redux'
import { changeNotifications } from '../../components/Notifications/notificationsSlice'

export default function AddList(props) {

  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const [mode, setMode] = useState()

  const [email, setEmail] = useState("")
  const [emailDirty, setEmailDirty] = useState(false)

  const [hidden, setHidden] = useState(null)

  let emailErr = useRef({})

  const validator = useValidator()

  const handleBlur = (event) => {
    switch(event.target.name)
      {
        case "Название": 
          setEmailDirty(true)
          break
        default:
          break
      }
  }

  const closeResetMenu = () => {
    props.setVisibility(false)

    setEmail("")

    setEmailDirty(false)

    emailErr.current = {}

    setHidden(null)
  }

  useEffect(() => {
    setMode(localStorage.getItem("mode"))
  }, [props.visibility])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(props.count === 20) {
      dispatch(changeNotifications({type:'error', title:'Ошибка создания списка', text:'У вас уже создано максимальное количество списков'}))
      return
    }

    if(emailErr.current.err)
      return

    setLoading(true)

    const url = '/social/lists/list/'

    const data = {
      name: email,
      hidden: hidden ? 1 : 0
    }

    try {
      await api.post(url, JSON.stringify(data))
      setLoading(false)
      props.setVisibility(false)
      dispatch(changeNotifications({type:'success', title:'Создание списка', text:'Список был успешно создан'}))
      props.setList()
    }
    catch(err) {
      setLoading(false)
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:'Ошибка создания списка', text:'Авторизируйтесь для создания списка'}))
      else
        dispatch(changeNotifications({type:'error', title:'Ошибка создания списка', text: err.response.data.details || err.response.data.name}))
    }
  }

  const onCheck = (value, name) => {
    setHidden(value)
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
            <h2 className="signInHeader">Добавить список</h2>
          </div>

          <div className="resetTextBlock">
            <p className="resetText">Введите название списка</p>
          </div>

          <div className="formBlock">
            <form className="signInForm" onSubmit={e => handleSubmit(e)}>

              <TextInput
                type="text" 
                setData={validator} 
                onBlur={handleBlur} 
                value={email} 
                setValue={setEmail}
                name={"Название"}
                error={emailErr}
                constraints={{min:2, max:30}}
              >
                {emailDirty && emailErr.current.err ? emailErr.current.text : "Название"}
              </TextInput>

              <div className="mt-4">
                <Checkbox 
                  label={"Скрыть список для гостей профиля"} 
                  value={hidden}
                  onClick={onCheck}
                />
              </div>

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
