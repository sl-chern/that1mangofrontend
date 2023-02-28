import React, { useState, useEffect } from 'react'
import './style.css'
import { useSelector, useDispatch } from 'react-redux'
import { 
  selectLogin, 
  selectId, 
  selectPict,
  change, 
  changeEmail, 
  changeUser, 
  changeId, 
  changeIsStaff,
  changePict,
  changeAge,
} from '../Login/loginSlice'
import axios from 'axios'
import usPict from '../../Assets/user_pict.png'
import { useNavigate } from 'react-router-dom'

export default function UsersOptions(props) {

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const login = useSelector(selectLogin)
  const id = useSelector(selectId)
  const pict = useSelector(selectPict)

  const [userInfo, setUserInfo] = useState({})

  const logout = () => {
    dispatch(change(""))
    dispatch(changeEmail(""))
    dispatch(changeId(null))
    dispatch(changeUser(null))
    dispatch(changeIsStaff(false))
    dispatch(changePict(null))
    dispatch(changeAge(0))

    props.setVisibility(false)

    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
  }

  useEffect(() => {
    const url = `/users/${id}/`

    axios.get(url)
    .then(res => {
      dispatch(changeUser(res.data))
      dispatch(changePict(res.data.profile_pic))

      const userAge = new Date(Date.now() - new Date(res.data.birth_date)).getUTCFullYear() - 1970

      dispatch(changeAge(userAge))

      setUserInfo(res.data)
    })
  }, [id, pict])

  if(props.visibility)
    return (
      <div className="usersOptions">
        <a href={`/user/${login}`}>
          <div className="shortInfo">
            <div className="shortInfoPhoto">
              <img src={pict || usPict} alt="User"/>
            </div>
            <div className="shortInfoLogin">
              <p>{login}</p>
            </div>
          </div>
        </a>
        <div className="logoutButton" onClick={() => logout()}>
          <p>Выйти</p>
        </div>
      </div>
    )
  else
    return null
}
