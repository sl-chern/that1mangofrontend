import React, { useEffect, useState, useRef } from 'react'
import './style.css'
import {RiCloseLine} from 'react-icons/ri'
import { IconContext } from 'react-icons'
import TextInput from '../TextInput/TextInput'
import Button from '../Button/Button'
import useValidator from '../../hooks/useValidator'
import Message from '../Message/Message'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { change, changeId, changeIsStaff } from './loginSlice'

export default function Login(props) {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const [mode, setMode] = useState()

  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")

  const [loginDirty, setLoginDirty] = useState(false)
  const [passwordDirty, setPasswordDirty] = useState(false)

  const [loginError, setLoginError] = useState({err:false, text: ""})

  let loginErr = useRef({})
  let passwordErr = useRef({})

  const validator = useValidator()

  const handleBlur = (event) => {
    switch(event.target.name)
    {
      case "Логин или почта": 
        setLoginDirty(true)
        break
      case "Пароль": 
        setPasswordDirty(true)
        break
      default:
        break
    }
  }

  const closeLoginMenu = () => {
    props.setVisibility(false)

    setLogin("")
    setPassword("")

    setLoginDirty(false)
    setPasswordDirty(false)

    loginErr.current = {}
    passwordErr.current = {}

    setLoginError({err:false, text: ""})
  }

  useEffect(() => {
    setMode(localStorage.getItem("mode"))
  }, [props.visibility])

  const handleSubmit = (e) => {
    e.preventDefault()

    if(loginErr.current.err || passwordErr.current.err)
      return

    setLoading(true)

    const url = '/users/login/'

    const data = {
      username: login,
      password: password
    }

    axios.post(url, JSON.stringify(data))
    .then(res => {

      localStorage.setItem("access", res.data.access)
      localStorage.setItem("refresh", res.data.refresh)

      let info = jwt_decode(res.data.access)

      dispatch(change(info.username))
      dispatch(changeId(info.user_id))
      dispatch(changeIsStaff(info.is_superuser))

      setLoading(false)

      closeLoginMenu()
    })
    .catch(res => {
      setLoading(false)
      setLoginError({
        err: true,
        text: "Активированного аккаунта с такими данными не существет, если вы ранее регестрировались перейдите на почту, которую вы указывали при регистрации, для активации аккаунта"
      })
    })

  }

  let errorBlock

  if(loginError.err) {
    errorBlock = <Message text={loginError.text}/>
  }
  else {
    errorBlock = null
  }

  if(props.visibility)
    return (
      <div className="loginSpace">
        <div className="loginBackground" onClick={() => closeLoginMenu()}></div>

        <div className="loginContent">
          <div className="closeButtonBlock">
            <div className="closeButton" onClick={() => closeLoginMenu()}>
              <IconContext.Provider value={mode === 'true' ?{ color: 'white', size: '20px' }:{ color: 'black', size: '20px' }}>
                <RiCloseLine/>
              </IconContext.Provider>
            </div>
          </div>

          <div className="signInHeaderBlock">
            <h2 className="signInHeader">Войти в аккаунт</h2>
          </div>

          {errorBlock}

          <div className="formBlock">
            <form className="signInForm" onSubmit={e => handleSubmit(e)}>
              <TextInput
                type="text" 
                setData={validator} 
                onBlur={handleBlur} 
                value={login} 
                setValue={setLogin}
                name={"Логин или почта"}
                error={loginErr}
                constraints={{}}
              >
                {loginDirty && loginErr.current.err ? loginErr.current.text : "Логин или почта"}
              </TextInput>

              <TextInput
                type="password" 
                setData={validator} 
                onBlur={handleBlur} 
                value={password} 
                setValue={setPassword}
                name={"Пароль"}
                error={passwordErr}
                constraints={{}}
              >
                {passwordDirty && passwordErr.current.err ? passwordErr.current.text : "Пароль"}
              </TextInput>

              <div className="signInButtonBlock">
                <Button loading={loading}>Войти</Button>
              </div>
            </form>
          </div>

          <div className="options">
            <div className="option-content" onClick={() => {
              closeLoginMenu()
              props.setResetVisibility(true)
            }}>
              <p className="option-text">Забыли пароль?</p>
            </div>
            <p className="slash">/</p>
            <div className="option-content" onClick={() => {
              closeLoginMenu()
              props.setSignUpVisibility(true)
            }}>
              <p className="option-text">Нет аккаунта?</p>
            </div>
          </div>
        </div>
      </div>
    )
  else
    return null
}
