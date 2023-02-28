import React, { useEffect, useState, useRef } from 'react'
import {RiCloseLine} from 'react-icons/ri'
import { IconContext } from 'react-icons'
import TextInput from '../TextInput/TextInput'
import Button from '../Button/Button'
import useValidator from '../../hooks/useValidator'
import axios from 'axios'
import './style.css'
import { useDispatch } from 'react-redux'
import { changeMes } from '../ActivationMessage/messageSlice'

export default function ResetWindow(props) {

  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const [mode, setMode] = useState()

  const [email, setEmail] = useState("")
  const [emailDirty, setEmailDirty] = useState(false)

  let emailErr = useRef({})

  const validator = useValidator()

  const handleBlur = (event) => {
    switch(event.target.name)
      {
        case "Почта": 
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
  }

  useEffect(() => {
    setMode(localStorage.getItem("mode"))
  }, [props.visibility])

  const handleSubmit = (e) => {
    e.preventDefault()

    if(emailErr.current.err)
      return

    setLoading(true)

    const url = "/users/send-password-reset-email/"

    const data = {
      email: email
    }

    axios.post(url, data)
    .then(() => {
      setLoading(false)
      dispatch(changeMes(`Письмо с ссылкой на страницу сброса вашего пароля было отправлено вам на почту: ${data.email}`))
      closeResetMenu()
      props.setActMesVisibility(true)
    })
    .catch(res => {
      emailErr.current = {
        err: true,
        text: res.response.data.email[0]
      }
      setLoading(false)
    })
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
            <h2 className="signInHeader">Сброс пароля</h2>
          </div>

          <div className="resetTextBlock">
            <p className="resetText">Введите почту на которую прийдет письмо с ссылкой на страницу сброса вашего пароля</p>
          </div>

          <div className="formBlock">
            <form className="signInForm" onSubmit={e => handleSubmit(e)}>

              <TextInput
                type="text" 
                setData={validator} 
                onBlur={handleBlur} 
                value={email} 
                setValue={setEmail}
                name={"Почта"}
                error={emailErr}
                constraints={{isEmail:true}}
              >
                {emailDirty && emailErr.current.err ? emailErr.current.text : "Почта"}
              </TextInput>

              <div className="signInButtonBlock">
                <Button loading={loading}>Отправить</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  else
    return null
}
