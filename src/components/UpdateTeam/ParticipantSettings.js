import React, { useEffect, useState } from 'react'
import {RiCloseLine} from 'react-icons/ri'
import { IconContext } from 'react-icons'
import Button from '../Button/Button'
import api from '../../services/api'
import { useDispatch, useSelector } from 'react-redux'
import { changeNotifications } from '../../components/Notifications/notificationsSlice'
import useSelectTheme from '../../hooks/useSecteTheme'
import Select from 'react-select'
import mockImg from '../../Assets/user_pict.png'
import { selectTheme } from '../Header/themeSlice'
import { selectId } from '../Login/loginSlice'

const options = [
  { value: 'admin', label: 'Админ' },
  { value: 'scanner', label: 'Сканер' },
  { value: 'translator', label: 'Переводчик' },
  { value: 'cleaner', label: 'Клинер' },
  { value: 'typesetter', label: 'Тайпер' },
  { value: 'editor', label: 'Эдитор' },
  { value: 'corrector', label: 'Корректор' },
  { value: 'beta_reader', label: 'Бета читатель' },
  { value: 'uploader', label: 'Загрузчик' },
]

export default function ParticipantSettings({visibility, setVisibility, setPrevVisibility, name, profile_pic, team, curPartSettings, setDeletePart, id, setTeam}) {

  const darkTheme = useSelector(selectTheme)

  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const [mode, setMode] = useState()

  const userId = useSelector(selectId)

  const closeResetMenu = () => {
    setVisibility(false)
    setPrevVisibility(true)
  }

  useEffect(() => {
    setMode(localStorage.getItem("mode"))

    let rolesAr = []
    if(team.participants[curPartSettings])
      if(team.participants[curPartSettings].roles)
        team.participants[curPartSettings].roles.forEach(el =>{
          rolesAr.push({
            value: el.slug, label: el.name
          })
        })

    setSortValue(rolesAr)

  }, [visibility])

  const styles = useSelectTheme(darkTheme, '300px')

  const [sortValue, setSortValue] = useState()

  const handleSubmit = async () => {

    setLoading(true)

    const url = '/titles/team/participant/'

    let rolesArr = []
    let rolesData = []

    sortValue.forEach(element => {
      rolesArr.push({name: element.label, slug: element.value})
      rolesData.push(element.value)
    })

    const data = {
      team: team.id,
      user: id,
      roles: rolesData
    }

    try {
      await api.put(url, JSON.stringify(data))

      let newParticipants = [...team.participants]
      newParticipants[curPartSettings].roles = rolesArr

      setTeam({
        ...team,
        participants: newParticipants,
      })

      if(rolesArr.findIndex(element => element.slug === 'admin') === -1, data.user === userId)
      {
        setVisibility(false)
        setPrevVisibility(false)
      }

      dispatch(changeNotifications({type:'success', title:`Обновление информации об участнике`, text:`Информация об участнике была обновлена`}))
    }
    catch(err) {
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:`Ошибка обновления информации об участнике`, text:`Авторизируйтесь для обновления информации об участнике`}))
      else
        dispatch(changeNotifications({type:'error', title:`Ошибка обновления информации об участнике`, text: Object.entries(err.response.data).map(([key, value]) => value)}))
    }

    setLoading(false)
  }

  const deleteUser = () => {
    setVisibility(false)
    setDeletePart(true)
  }

  if(visibility)
    return (
      <div className="loginSpace">
        <div className="loginBackground" onClick={() => closeResetMenu()}></div>

        <div className="loginContent items-center">
          <div className="closeButtonBlock">
            <div className="closeButton" onClick={() => closeResetMenu()}>
              <IconContext.Provider value={mode === 'true' ?{ color: 'white', size: '20px' }:{ color: 'black', size: '20px' }}>
                <RiCloseLine/>
              </IconContext.Provider>
            </div>
          </div>

          <div className="signInHeaderBlock">
            <h2 className="signInHeader text-3xl">Настройки участника</h2>
          </div>

          <div className="part-update__part-info">
            <div className="part-update__img-block">
              <img className="part-update__img" src={profile_pic || mockImg} alt={name}/>
            </div>
            <div className="manga-team__name-block">
              <p className="part-update__name default-text">{name}</p>
            </div>
          </div>

          <Select 
            value = {sortValue}
            onChange={e => setSortValue(e)}
            styles={styles}
            options={options}
            isOptionDisabled={option => option.disabled}
            isSearchable={false}
            isMulti={true}
          /> 

          <div className="flex flex-row justify-between w-1/2 mt-4 mx-auto">
            <Button loading={loading} onClick={() => handleSubmit()}>Изменть</Button>
            <Button onClick={() => deleteUser()}>Удалить</Button>
          </div>
        </div>
      </div>
    )
  else
    return null
}



