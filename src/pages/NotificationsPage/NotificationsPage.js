import React, { useEffect, useState } from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectId } from '../../components/Login/loginSlice'
import api from '../../services/api'
import UserNotification from '../../components/UserNotification/UserNotification'
import { selectTheme } from '../../components/Header/themeSlice'
import { Oval } from 'react-loader-spinner'
import Button from '../../components/Button/Button'
import useSelectTheme from '../../hooks/useSecteTheme'
import Select from 'react-select'
import { changeNotifications } from '../../components/Notifications/notificationsSlice'
import { changeCount } from '../../components/Authorization/userNotificationsSlice'

const options = [
  { value: '0', label: 'Непрочитанные' },
  { value: '1', label: 'Прочитанные' },
]

export default function NotificationsPage() {
  const dispatch = useDispatch()

  const darkTheme = useSelector(selectTheme)

  const navigate = useNavigate()

  const id = useSelector(selectId)

  const [curType, setCurType] = useState(options[0])

  const [notifications, setNotifications] = useState({'0': [], "1": []})

  const [loading, setLoading] = useState(true)

  const styles = useSelectTheme(darkTheme)

  useEffect(() => {
    if(id === -1)
      return

    if(id === null)
      navigate('/')

    const fetchData = async () => {
      setLoading(true)

      const url = '/social/notifications/'

      try {
        const res = await api.get(url)

        let notificationsObj = {
          '0': res.data.filter(elememt => !elememt.is_read),
          '1': res.data.filter(elememt => elememt.is_read),
        }

        setNotifications(notificationsObj)
      }
      catch(err) {

      }

      setLoading(false)
    }

    fetchData()
  }, [id])

  const readAll = async () => {
    const url = '/social/notifications/read-all/'

    try {
      let notificationArray = [...notifications[0], ...notifications[1]], newNotsArray = []

      notificationArray.forEach(element => 
        newNotsArray.push({...element, is_read: true})
      )

      newNotsArray.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setNotifications({
        '0': [],
        '1': [...newNotsArray]
      })

      dispatch(changeCount(0))

      await api.post(url)
    } 
    catch(err) {
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:`Ошибка изменения статуса уведомлений`, text:`Авторизируйтесь для изменения статуса уведомлений`}))
      else
        dispatch(changeNotifications({type:'error', title:`Ошибка изменения статуса уведомлений`, text: Object.entries(err.response.data).map(([key, value]) => value)}))
    }
  }

  const deleteAll = async () => {
    const url = '/social/notifications/delete/'

    const data = {
      is_read: curType.value === '0' ? false : true
    }

    try {
      let notObject = {
        '0': curType.value === '0' ? [] : [...notifications[0]],
        '1': curType.value === '1' ? [] : [...notifications[1]]
      }

      setNotifications(notObject)
      
      dispatch(changeCount(0))

      await api.delete(url, { data: data })
    } 
    catch(err) {
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:`Ошибка удаления уведомлений`, text:`Авторизируйтесь для удаления уведомлений`}))
      else
        dispatch(changeNotifications({type:'error', title:`Ошибка удаления уведомлений`, text: Object.entries(err.response.data).map(([key, value]) => value)}))
    }
  }

  if(loading)
    return (
      <div className="spinnerBlock">
        <Oval color={darkTheme ? "white" : "black"} secondaryColor={darkTheme ? "white" : "black"} height="50px" width="50px"/>
      </div>
    )
  else
    return (
      <section className="notifications">
        <div className="notifications__title-block">
          <p className="notifications__title">Уведомления</p>
        </div>

        <section className="notifications__types-block">
          <Select 
            value = {curType}
            onChange={e => setCurType(e)}
            styles={styles}
            options={options}
            isOptionDisabled={option => option.disabled}
            isSearchable={false}
          />

          <div className="notifiations__buttons-block">
            <Button onClick={() => readAll()}>Прочитать все</Button>
            <Button onClick={() => deleteAll()} outline={true}>Удалить все</Button>
          </div>
        </section>

        <section className="notifications__content">
          {
            notifications[curType.value].length > 0 ?
              notifications[curType.value].map((item, index) => 
                <UserNotification
                  {...item}
                  key={`userNotifications${index}`}
                  notifications={notifications}
                  setNotifications={setNotifications}
                />
              ) :
              <div className="cahapters__text-container mx-auto">
                <p className="chapters__text default-text">Уведомления отсутствуют</p>
              </div>
          }
        </section>
      </section>
    )
}
