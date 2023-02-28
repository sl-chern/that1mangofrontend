import React, { useState, useEffect } from 'react'
import './style.css'
import api from '../../services/api'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import mockImg from '../../Assets/user_pict.png'
import Button from '../../components/Button/Button'
import Tabs from '../../components/Tabs/Tabs'
import UserSettings from '../../components/UserSettings/UserSettings'
import DeleteList from '../../components/DeleteList/DeleteList'
import { useDispatch, useSelector } from 'react-redux'
import { 
  change, 
  changeEmail, 
  changeUser, 
  changeId, 
  changeIsStaff,
  changePict,
  selectId
} from '../../components/Login/loginSlice'
import { selectTheme } from '../../components/Header/themeSlice'
import SettingsType from '../../components/UserSettings/SettingsType'
import Team from './Team'
import AddTeam from '../../components/AddTeam/AddTeam'
import { Oval } from 'react-loader-spinner'
import { changeNotifications } from '../../components/Notifications/notificationsSlice'
import NotFound from '../../components/NotFound/NotFound'

export default function User() {

  const id = useSelector(selectId)

  const location = useLocation()
  const params = useParams()
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const [user, setUser] = useState({friends:[]})
  const [lists, setLists] = useState([])
  const [teams, setTeams] = useState([])

  const [settings, setSettings] = useState(false)
  const [deleteUser, setDeleteUser] = useState(false)
  const [addTeam, setAddTeam] = useState(false)

  const [curType, setCurType] = useState(0)
  
  const [loadingPage, setLoadingPage] = useState(true)
  const [loadingLists, setLoadingLists] = useState(true)

  const darkTheme = useSelector(selectTheme)

  const [isOwner, setIsOwner] = useState(false)
  const [isFriend, setIsFriend] = useState(false)
  const [isRequest, setIsRequest] = useState(false)

  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if(id === -1)
      return
    
    setNotFound(false)

    const urlUser = `/users/user/${params.username}/`

    setLoadingPage(true)

    const fetchUserData = async () => {
      try {
        const { data } = await api.get(urlUser)
        setUser(data)
        setTeams(data.teams)
        setIsFriend(data.is_friend)
        setIsRequest(data.requested_friendship)
        setIsOwner(data.email ? true : false)
      }
      catch(err) {
        if(err.response.status === 404)
          setNotFound(true)
      }
      setLoadingPage(false)
    }

    fetchUserData()

  }, [location.pathname, params.username, id])

  useEffect(() => getListsList(), [user])

  const getListsList = () => {
    const urlLists = `/social/lists/lists/${user.username}/`

    setLoadingLists(true)

    const fetchListData = async () => {
      try {
        const { data } = await api.get(urlLists)
        setLists(data)
      }
      catch(err) {

      }
      setLoadingLists(false)
      
    }

    fetchListData()
  }

  const afterDelete = () => {
    navigate('/', {replace: true})

    dispatch(change(""))
    dispatch(changeEmail(""))
    dispatch(changeId(null))
    dispatch(changeUser(null))
    dispatch(changeIsStaff(false))
    dispatch(changePict(null))

    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
  }

  const handleAddFriend = async () => {
    const url = `/social/friend-request/`

    const data = {
      user: user.id
    }

    try {
      await api.post(url, JSON.stringify(data))
      dispatch(changeNotifications({type:'success', title:`Добавление в друзья`, text:`Запрос на добавление в друзья был успешно отправлен`}))
      setIsRequest(true)
    }
    catch(err) {
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:`Ошибка добавления в друзья`, text:`Авторизируйтесь для отпраки запроса на добавление в друзья`}))
      else
        dispatch(changeNotifications({type:'error', title:`Ошибка добавления в друзья`, text: Object.entries(err.response.data).map(([_, value]) => value)}))
    }
  }

  const handleDeleteFriend = async () => {
    const url = `/social/remove-friend/`

    const data = {
      friend: user.id
    }

    try {
      await api.delete(url, { data: JSON.stringify(data) })
      dispatch(changeNotifications({type:'success', title:`Удаление из друзей`, text:`Запрос на добавление в друзья был успешно отправлен`}))
      setIsFriend(false)
    }
    catch(err) {
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:`Ошибка удаления из друзей`, text:`Авторизируйтесь для удаления из друзей`}))
      else
        dispatch(changeNotifications({type:'error', title:`Ошибка удаления из друзей`, text: Object.entries(err.response.data).map(([_, value]) => value)}))
    }
  }

  useEffect(() => {
    if(id === null) {
      setIsOwner(false)
      setIsFriend(false)
      setIsRequest(false)
    }
  }, [id])

  if(notFound) 
    return <NotFound />

  if(loadingPage)
    return (
      <div className="spinnerBlock">
        <Oval color={darkTheme ? "white" : "black"} secondaryColor={darkTheme ? "white" : "black"} height="50px" width="50px"/>
      </div>
    )
  else
    return (
      <div className="user">
        <div className="user__info">
          <div className="user__picture-block">
            <img className="user__picture" src={user.profile_pic || mockImg} alt={user.username}/>
          </div>

          <div className="user__info-block">
            <div className="user__name-block">
              <p className="user__name">{user.username}</p>
              {
                isOwner ? <Button outline={true} onClick={() => setSettings(true)}>Настройки</Button>
                  : isFriend ? <Button outline={true} onClick={() => handleDeleteFriend()}>Удалить из друзей</Button>
                    : isRequest ? <Button outline={true}>Заявка отпралена</Button>
                      : id ? <Button outline={true} onClick={() => handleAddFriend()}>Добавить в друзья</Button>
                        : null
              }
              
            </div>

            <div className="user__email-block">
              {
                isOwner ? 
                  <p className="user__email">Email: {user.email}</p>
                  : null
              }
              {
                user.birth_date ? 
                  <p className="user__birth-date">{`Дата рождения: ${new Date(user.birth_date).toLocaleString('ru-RU').slice(0, 10)}`}</p>
                  : null
              }
            </div>

            <div className="user__description-block">
              <p className="user__description default-text">{user.about}</p>
            </div>
          </div>

          <div className="user__team-block">
            <div className="user__social-types-block">
              <SettingsType index={0} curType={curType} setCurType={setCurType}>Команды</SettingsType>
              <SettingsType index={1} curType={curType} setCurType={setCurType}>Друзья</SettingsType>
            </div>
            
            {
              curType === 0 ?
                <div className="user__teams-content">
                  <div className="user__teams">
                    {teams.map((item, index) => 
                      <Team {...item} key={`userTeam${index}`} param={`team`}/>
                    )}
                  </div>
                  {isOwner ?
                    <Button onClick={() => setAddTeam(true)}>Создать команду</Button>
                    : null
                  }
                </div>
              : curType === 1 ?
                <div className="user__teams-content">
                  <div className="user__teams">
                    {user.friends.map((item, index) => 
                      <Team 
                        name={item.username}
                        picture={item.profile_pic}
                        slug={item.username}
                        key={`userFriend${index}`} 
                        param={`user`}
                      />
                    )}
                  </div>
                </div>
              : null
            }
          </div>
        </div>

        <div className="user__more_info">
          {
            loadingLists ?
              <div className="spinnerBlock mt-40">
                <Oval color={darkTheme ? "white" : "black"} secondaryColor={darkTheme ? "white" : "black"} height="50px" width="50px"/>
              </div>
            : <Tabs list={lists} setList={getListsList} isOwner={isOwner ? true : false}/>
          }
        </div>

        <UserSettings visibility={settings} setVisibility={setSettings} user={user} setUser={setUser} setDeleteVisibility={setDeleteUser}/>

        <DeleteList 
          visibility={deleteUser} 
          setVisibility={setDeleteUser} 
          callback={afterDelete}
          setPrevVisibility={setSettings}
          url={`/users/user/delete/${user.id}/`} 
          text={'аккаунт'}
          textTitle={'Аккаунт'}
          textNot={'аккаунта'}
        />

        <AddTeam visibility={addTeam} setVisibility={setAddTeam} teams={teams} setTeams={setTeams}/>
      </div>
    )
}
