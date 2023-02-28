import React, { useEffect, useState } from 'react'
import {RiCloseLine} from 'react-icons/ri'
import { IconContext } from 'react-icons'
import Button from '../Button/Button'
import api from '../../services/api'
import { useDispatch } from 'react-redux'
import { changeNotifications } from '../../components/Notifications/notificationsSlice'

export default function DeleteList({visibility, setVisibility, setPrevVisibility, url, callback, text, textTitle, textNot, data}) {

  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const [mode, setMode] = useState()

  const closeResetMenu = () => {
    setVisibility(false)
  }

  useEffect(() => {
    setMode(localStorage.getItem("mode"))
  }, [visibility])

  const handleSubmit = async () => {

    setLoading(true)

    try {
      if(data) {
        let apiData = {...data}
        let rolesSlugs = []
        if(apiData.roles) {
          apiData.roles.forEach(element => {
            rolesSlugs.push(element.slug)
          })
        }
        apiData = {
          ...apiData,
          roles: rolesSlugs
        }
        await api.delete(url, { data: apiData })
      }
      else
        await api.delete(url)

      setLoading(false)
      setVisibility(false)
      dispatch(changeNotifications({type:'success', title:`Удаление ${textNot}`, text:`${textTitle} был(а) успешно удален`}))
      if(callback)
        callback()
    }
    catch(err) {
      setLoading(false)
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:`Ошибка удаления ${textNot}`, text:`Авторизируйтесь для удаления ${textNot}`}))
      else
        dispatch(changeNotifications({type:'error', title:`Ошибка удаления ${textNot}`, text: Object.entries(err.response.data).map(([key, value]) => value)}))
    }
  }

  const cancel = () => {
    setVisibility(false)
    if(setPrevVisibility)
      setPrevVisibility(true)
  }

  if(visibility)
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
            <h2 className="signInHeader">Удалить {text}</h2>
          </div>

          <div className="resetTextBlock">
            <p className="resetText">Вы точно хотите удалить {text}?</p>
          </div>

          <div className="flex flex-row justify-between w-1/2 mt-4 mx-auto">
            <Button loading={loading} onClick={() => handleSubmit()}>Удалить</Button>
            <Button onClick={() => cancel()}>Отмена</Button>
          </div>
        </div>
      </div>
    )
  else
    return null
}
