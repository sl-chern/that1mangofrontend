import React, { useEffect, useState, useRef } from 'react'
import TextInput from '../TextInput/TextInput'
import Button from '../Button/Button'
import useValidator from '../../hooks/useValidator'
import api from '../../services/api'
import { useDispatch } from 'react-redux'
import { changeNotifications } from '../Notifications/notificationsSlice'

export default function ChangePassword({visibility}) {

  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const [confError, setConfError] = useState(false)

  const [oldPassword, setOldPassword] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [oldPasswordDirty, setOldPasswordDirty] = useState(false)
  const [passwordDirty, setPasswordDirty] = useState(false)
  const [confirmPasswordDirty, setConfirmPasswordDirty] = useState(false)

  let oldPasswordErr = useRef({})
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
        case "Старвый пароль": 
          setOldPasswordDirty(true)
          break
        case "Новый пароль": 
          setPasswordDirty(true)
          break
        case "Подтвердите пароль": 
          setConfirmPasswordDirty(true)
          break
        default:
          break
      }
  }

  const clearForm = () => {
    setOldPassword("")
    setPassword("")
    setConfirmPassword("")

    setOldPasswordDirty(false)
    setPasswordDirty(false)
    setConfirmPasswordDirty(false)

    oldPasswordErr.current = {}
    passwordErr.current = {}
    confPasswordErr.current = {}
  }

  useEffect(() => {
    return () => clearForm()
  }, [visibility])

  const handleSubmit = async e => {
    e.preventDefault()

    if(oldPasswordErr.current.err || passwordErr.current.err || confPasswordErr.current.err)
      return

    setLoading(true)

    const url = '/users/change-password/'

    const data = {
      old_password: oldPassword,
      new_password: password,
    }

    try {
      await api.patch(url, JSON.stringify(data))
      dispatch(changeNotifications({type:'success', title:'Смена пароля', text: 'Пароль был успешно изменен'}))
      clearForm()
    }
    catch(err) {
      console.log(err.response)
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:`Ошибка смены пароля`, text:`Авторизируйтесь для смены пароля`}))
      else
        dispatch(changeNotifications({type:'error', title:`Ошибка смены пароля`, text: Object.entries(err.response.data).map(([key, value]) => value)}))
    }


    setLoading(false)
  }

  return (
    <form className="signInForm" onSubmit={e => handleSubmit(e)}>
      <TextInput
        type="password" 
        setData={validator} 
        onBlur={handleBlur} 
        value={oldPassword} 
        setValue={setOldPassword}
        name={"Старый пароль"}
        error={oldPasswordErr}
        constraints={{}}
      >
        {oldPasswordDirty && oldPasswordErr.current.err ? oldPasswordErr.current.text : "Старый пароль"}
      </TextInput>

      <TextInput
        type="password" 
        setData={validator} 
        onBlur={handleBlur} 
        value={password} 
        setValue={setPassword}
        name={"Новый пароль"}
        error={passwordErr}
        constraints={{min:8, max:25}}
      >
        {passwordDirty && passwordErr.current.err ? passwordErr.current.text : "Новый пароль"}
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
  )
}
