import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { changeNotifications } from '../../components/Notifications/notificationsSlice'

export default function Activation() {

  const navigate = useNavigate()

  const dispatch = useDispatch()
  
  const [searchParams, setSearchParams] = useSearchParams({})

  useEffect(() => {
    const url = "/users/register/verify/"

    const data = {
      user_id: searchParams.get("id"),
      token: searchParams.get("token")
    }

    axios.post(url, JSON.stringify(data))
    .then(res => {
      dispatch(changeNotifications({type:'success', title:'Активация аккаунта', text: "Аккаунт был успешно активирован"}))
    })
    .catch(res => {
      dispatch(changeNotifications({type:'error', title:'Ошибка активации аккаунта', text: res.response.data.data}))
    })
    navigate(`/`)
  }, [])

  return null
}
