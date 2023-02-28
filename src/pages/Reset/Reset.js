import React, { useState, useRef, useEffect } from 'react'
import TextInput from '../../components/TextInput/TextInput'
import Button from '../../components/Button/Button'
import useValidator from '../../hooks/useValidator'
import axios from 'axios'
import './style.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { changeNotifications } from '../../components/Notifications/notificationsSlice'

export default function Reset() {

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const [searchParams, setSearchParams] = useSearchParams({})

  const [confError, setConfError] = useState(false)

  const [loading, setLoading] = useState(false)

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [passwordDirty, setPasswordDirty] = useState(false)
  const [confirmPasswordDirty, setConfirmPasswordDirty] = useState(false)

  let passwordErr = useRef({})
  let confPasswordErr = useRef({})

  const validator = useValidator()

  useEffect(() => {
    validator(confirmPassword, setConfirmPassword, confPasswordErr, {compare: password})
    setConfError(confirmPasswordDirty ? confPasswordErr.current.err : false)
  }, [password, confirmPassword, validator, confirmPasswordDirty])

  const handleBlur = (event) => {
    switch(event.target.name)
      {
        case "Пароль": 
          setPasswordDirty(true)
          break
        case "Подтвердите пароль": 
          setConfirmPasswordDirty(true)
          break
        default:
          break
      }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if(passwordErr.current.err || confPasswordErr.current.err)
      return

    setLoading(true)

    const url = '/users/password-reset/'

    const data = {
      user_id: searchParams.get("id"),
      token: searchParams.get("token"),
      new_password: password
    }

    axios.post(url, JSON.stringify(data))
    .then(() => {
      dispatch(changeNotifications({type: 'success', text: "Пароль был успешно изменён", title: "Сброс пароля"}))
      setLoading(false)
      navigate('/')
    })
    .catch((res) => {
      if(typeof res.response.data.data !== "undefined" || typeof res.response.data.user_id[0] !== 'undefined' || typeof res.response.data.token[0] !== 'undefined') {
        dispatch(changeNotifications({type: 'error', text: "Время на использование ключа активации истекло или он недействителен", title: "Ошибка сброса пароля"}))
        navigate('/')
        setLoading(false)
      }

      if(typeof res.response.data.new_password[0] !== 'undefined') {
        passwordErr.current = {
          err: true,
          text: res.response.data.new_password[0]
        }
        confPasswordErr.current = {
          err: true,
          text: res.response.data.new_password[0]
        }

        setLoading(false)
      }
    })
  }

  return (
    <div className="resetSpace">
      <div className="resetContent">

        <div className="signInHeaderBlock">
          <h2 className="signInHeader">Сброс пароля</h2>
        </div>

        <div className="resetTextBlock">
          <p className="resetText">Введите новый пароль</p>
        </div>

        <div className="formBlock">
          <form className="signInForm" onSubmit={e => handleSubmit(e)}>
      
            <TextInput
              type="password" 
              setData={validator} 
              onBlur={handleBlur} 
              value={password} 
              setValue={setPassword}
              name={"Пароль"}
              error={passwordErr}
              constraints={{min:8}}
            >
              {passwordDirty && passwordErr.current.err ? passwordErr.current.text : "Пароль"}
            </TextInput>

            <TextInput
              type="password" 
              setData={validator} 
              onBlur={handleBlur} 
              value={confirmPassword} 
              setValue={setConfirmPassword}
              name={"Подтвердите пароль"}
              error={confPasswordErr}
              constraints={{compare: password}}
            >
              {confirmPasswordDirty && (confPasswordErr.current.err || confError) ? confPasswordErr.current.text : "Подтвердите пароль"}
            </TextInput>

            <div className="signInButtonBlock">
              <Button loading={loading}>Изменить</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
