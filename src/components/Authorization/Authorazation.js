import React, { useEffect, useState, useRef } from 'react'
import './style.css'
import Button from '../Button/Button'
import { useSelector, useDispatch } from 'react-redux'
import { selectLogin } from '../Login/loginSlice'
import { IconContext } from 'react-icons'
import { AiOutlineBell, AiOutlineUser } from 'react-icons/ai'
import api from '../../services/api'
import UsersOptions from '../UsersOptions/UsersOptions'
import { useNavigate } from 'react-router-dom'
import { changeCount, selectCount } from './userNotificationsSlice'

export default function Authorazation(props) {

  const dispatch = useDispatch()

  const login = useSelector(selectLogin)

  const notificationsCount = useSelector(selectCount)

  const [mode, setMode] = useState()
  const [visibility, setVisibility] = useState(false)
  const but = useRef()

  const navigate = useNavigate()
  
  useEffect(() => {
    setMode(localStorage.getItem("mode"))
  }, [localStorage.getItem("mode")])

  useEffect(() => {

    if(login !== "") {

      const url = "/social/count-notifications/"

      api.get(url)
      .then(res => {
        if(res.data.notifications > 0)
          dispatch(changeCount(res.data.notifications))
      })

    }

  }, [login])

  const handleClick = (e) => {
    if(!but.current.contains(e.target))
      setVisibility(!visibility)
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return() => document.removeEventListener('click', handleClick)
  }, [])

  if(login === "")
    return (
      <div className="authorizationBlock">
        <Button onClick={() => props.setLoginVisibility(true)}>Login</Button>
        <Button onClick={() => props.setSignUpVisibility(true)} outline={true}>Sign up</Button>
      </div>
    )
  else
    return (
      <div className="authorizationBlock">
        <IconContext.Provider value={mode === "true" ? { color: 'white', size: '28px' } : { color: 'black', size: '28px' }}>
          <a href={`/notifications`}>
            <div className="userButton">
              <AiOutlineBell />
              {
                notificationsCount > 0 ?
                  <div className="numberOfNotifications">
                    {notificationsCount}
                  </div>
                  : null
              }
            </div>
          </a>
          <div ref={but} className="userButton" onClick={() => visibility ? setVisibility(false) : setVisibility(true) }>
            <AiOutlineUser />
          </div>
          <UsersOptions visibility={visibility} setVisibility={setVisibility}/>
        </IconContext.Provider>
      </div>
    )
}
