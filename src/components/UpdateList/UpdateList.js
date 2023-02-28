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

export default function UpdateList(props) {

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

    setEmailDirty(false)

    emailErr.current = {}
  }

  useEffect(() => {
    setMode(localStorage.getItem("mode"))

    const item = props.list[props.curList] || {}

    setHidden(item.hidden ? true : null)
    setEmail(item.name)

  }, [props.visibility])

  const handleSubmit = async (e) => {
    setLoading(true)

    if(emailErr.current.err)
      return

    const url = `/social/lists/list/${props.list[props.curList].id}/`

    const data = {
      name: email,
      hidden: hidden ? 1 : 0
    }

    try {
      await api.put(url, JSON.stringify(data))
      setLoading(false)
      props.setVisibility(false)
      dispatch(changeNotifications({type:'success', title:'Редактирование списка', text:'Список был успешно отредактирован'}))
      props.setList()
    }
    catch(err) {
      setLoading(false)
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:'Ошибка редактирования списка', text:'Авторизируйтесь для редактирования списка'}))
      else
        dispatch(changeNotifications({type:'error', title:'Ошибка редактирования списка', text: err.response.data.details || err.response.data.name}))
    }
  }

  const onCheck = (value, name) => {
    setHidden(value)
  }
  
  const delList = () => {
    props.setVisibility(false)
    props.setDeleteVisibility(true)
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
            <h2 className="signInHeader">Редактировать список</h2>
          </div>

          <div className="resetTextBlock">
            <p className="resetText">Измените настройки списка: {props.list[props.curList].name}</p>
          </div>

          <div className="formBlock">
            <form className="signInForm">

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

              <div className="flex flex-row justify-between w-3/4 mt-4">
                <Button loading={loading} onClick={() => handleSubmit()}>Изменить</Button>
                <Button onClick={() => delList()}>Удалить</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  else
    return null
}
