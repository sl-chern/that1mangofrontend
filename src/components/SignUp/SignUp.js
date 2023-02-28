import React, { useEffect, useState, useRef } from 'react'
import {RiCloseLine} from 'react-icons/ri'
import { IconContext } from 'react-icons'
import TextInput from '../TextInput/TextInput'
import Button from '../Button/Button'
import useValidator from '../../hooks/useValidator'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { changeMes } from '../ActivationMessage/messageSlice'

export default function SignUp(props) {

  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const [mode, setMode] = useState()

  const [confError, setConfError] = useState(false)
  const [dateError, setDateError] = useState(false)
  const [dateErrorText, setDateErrorText] = useState("")

  const [login, setLogin] = useState("")
  const [email, setEmail] = useState("")
  const [date, setDate] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [loginDirty, setLoginDirty] = useState(false)
  const [emailDirty, setEmailDirty] = useState(false)
  const [dateDirty, setDateDirty] = useState(false)
  const [monthDirty, setMonthDirty] = useState(false)
  const [yearDirty, setYearDirty] = useState(false)
  const [passwordDirty, setPasswordDirty] = useState(false)
  const [confirmPasswordDirty, setConfirmPasswordDirty] = useState(false)

  let loginErr = useRef({})
  let emailErr = useRef({})
  let dateErr = useRef({})
  let monthErr = useRef({})
  let yearErr = useRef({})
  let passwordErr = useRef({})
  let confPasswordErr = useRef({})

  const validator = useValidator()

  useEffect(() => {
    validator(confirmPassword, setConfirmPassword, confPasswordErr, {compare: password})
    setConfError(confirmPasswordDirty ? confPasswordErr.current.err : false)
  }, [password, confirmPassword, validator, confirmPasswordDirty])

  useEffect(() => {
    validator(date, setDate, dateErr, {isDay: {month: month.length > 0 ? +month : null, year: year.length > 0 ? +year : null}})
    setDateError(dateDirty ? dateErr.current.err : false)
    setDateErrorText(dateErr.current.text)
  }, [date, month, year, validator, dateDirty])

  const handleBlur = (event) => {
    switch(event.target.name)
      {
        case "Логин": 
          setLoginDirty(true)
          break
        case "Почта": 
          setEmailDirty(true)
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

  const closeSignUpMenu = () => {
    props.setVisibility(false)

    setLogin("")
    setEmail("")
    setDate("")
    setMonth("")
    setYear("")
    setPassword("")
    setConfirmPassword("")

    setLoginDirty(false)
    setEmailDirty(false)
    setDateDirty(false)
    setMonthDirty(false)
    setYearDirty(false)
    setPasswordDirty(false)
    setConfirmPasswordDirty(false)

    loginErr.current = {}
    emailErr.current = {}
    dateErr.current = {}
    monthErr.current = {}
    yearErr.current = {}
    passwordErr.current = {}
    confPasswordErr.current = {}
  }

  useEffect(() => {
    setMode(localStorage.getItem("mode"))
  }, [props.visibility])

  const handleSubmit = (e) => {
    e.preventDefault()

    if(loginErr.current.err || emailErr.current.err || passwordErr.current.err || confPasswordErr.current.err 
      || dateErr.current.err || monthErr.current.err || yearErr.current.err)
      return

    setLoading(true)

    const url = '/users/register/'

    const data = {
      email: email,
      username: login,
      password: password,
      birth_date: `${year.slice(-4)}-${month.slice(-2)}-${date.slice(-2)}`
    }

    axios.post(url, JSON.stringify(data))
    .then(res => {
      setLoading(false)
      dispatch(changeMes(`Письмо с подтверждением регистрации было отправлено вам на почту: ${data.email}`))
      closeSignUpMenu()
      props.setActMesVisibility(true)
    })
    .catch(res => {
      if(res.response.data.username)
        loginErr.current = {
          err: true,
          text: res.response.data.username[0]
        }
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
            <h2 className="signInHeader">Регистрация</h2>
          </div>

          <div className="formBlock">
            <form className="signInForm" onSubmit={e => handleSubmit(e)}>
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

              <TextInput
                type="password" 
                setData={validator} 
                onBlur={handleBlur} 
                value={password} 
                setValue={setPassword}
                name={"Пароль"}
                error={passwordErr}
                constraints={{min:8, max:25}}
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
                <Button loading={loading}>Зарегистрироваться</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  else
    return null
}
