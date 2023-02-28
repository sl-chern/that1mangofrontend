import React, { useEffect, useState, useRef } from 'react'
import './style.css'
import axios from 'axios'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import mockImg from '../../Assets/user_pict.png'
import Participant from '../../components/Participant/Participant'
import { useDispatch, useSelector } from 'react-redux'
import { selectTheme } from '../../components/Header/themeSlice'
import { FaSortAmountDown, FaSortAmountUpAlt } from 'react-icons/fa'
import useSelectTheme from '../../hooks/useSecteTheme'
import Select from 'react-select'
import { Oval } from 'react-loader-spinner'
import Title from '../../components/Title/Title'
import Stat from './Stat'
import { selectId } from '../../components/Login/loginSlice'
import Button from '../../components/Button/Button'
import DeleteList from '../../components/DeleteList/DeleteList'
import UpdateTeam from '../../components/UpdateTeam/UpdateTeam'
import ParticipantSettings from '../../components/UpdateTeam/ParticipantSettings'
import api from '../../services/api'
import { changeNotifications } from '../../components/Notifications/notificationsSlice'
import AddParticipant from '../../components/AddParticipant/AddParticipant'
import NotFound from '../../components/NotFound/NotFound'

const options = [
  { value: 'rating', label: 'По рейтингу' },
  { value: 'name', label: 'По имени' },
  { value: 'date_added', label: 'По дате добавления' },
  { value: 'chapters', label: 'По количеству глав' },
]

export default function Team() {

  const dispatch = useDispatch()

  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const curUserId = useSelector(selectId)

  const dark = useSelector(selectTheme)

  const [darkMode, setDarkMode] = useState(dark)

  const [team, setTeam] = useState({participants: []})

  const customStyles = useSelectTheme(darkMode)

  const [desc, setDesc] = useState(true)
  const [sortValue, setSortValue] = useState(options[0])

  const [titles, setTitles] = useState([])

  const [loadingContent, setLoadingContent] = useState(true)
  const [loadingTeam, setLoadingTeam] = useState(true)

  const [isOwner, setIsOwner] = useState(false)
  const [isParticipant, setIsParticipant] = useState(false)

  const [deleteTeam, setDeleteTeam] = useState(false)
  const [updateTeam, setUpdateTeam] = useState(false)
  
  const [updatePart, setUpdatePart] = useState(false)
  const [deletePart, setDeletePart] = useState(false)

  const [leaveLoading, setLeaveLoading] = useState(false)

  const [curPartSettings, setCurPartSettings] = useState(null)

  const [addPart, setAddPart] = useState(false)

  const [notFound, setNotFound] = useState(false)

  const nextUrl = useRef()
  const titlesBlock = useRef()

  useEffect(() => {
    setDarkMode(dark)
  }, [dark])

  useEffect(() => {
    const url = `/titles/team/${params.slug}/`

    setLoadingTeam(true)

    const fetchData = async () => {
      setNotFound(false)
      try {
        const {data} = await axios.get(url)
        setLoadingTeam(false)
        setTeam(data)

        let partUser = data.participants.find(element => element.user.id === curUserId)
        
        if(partUser) {
          setIsParticipant(true)
          if(partUser.roles && partUser.roles.findIndex(element => element.name === "Админ") !== -1)
            setIsOwner(true)
        }
      }
      catch(err) {
        if(err.response.status === 404)
          setNotFound(true)
        setLoadingTeam(false)
      }
    }

    fetchData()

  }, [location.pathname])

  useEffect(() => {
    if(curUserId === -1 || !team)
      return

    let partUser = team.participants.find(element => element.user.id === curUserId)
        
    if(partUser) {
      setIsOwner(false)
      setIsParticipant(true)
      if(partUser.roles && partUser.roles.findIndex(element => element.name === "Админ") !== -1) {
        setIsOwner(true)
        setIsParticipant(true)
      }
    }
    else {
      setIsOwner(false)
      setIsParticipant(false)
    }
  }, [curUserId, team])

  useEffect(() => {
    if(curUserId === -1)
      return

    setLoadingContent(true)
    
    let order = "?order="

    if(sortValue.value) {
      let descValue = desc ? "-" : ""
      order += descValue + sortValue.value
    }
    
    const url = `/titles/team/titles/${team.slug}${order}`

    const fetchData = async () => {
      try {
        const res = await axios.get(url)
        setTitles(res.data.results)
        setLoadingContent(false)
      }
      catch(err) {
        setLoadingContent(false)
      }
    }

    fetchData()

  }, [desc, sortValue, team])

  const handleScroll = () => {
    
    if(nextUrl.current) {
      const scrollBottom = titlesBlock.current.getBoundingClientRect().bottom <= window.innerHeight

      if (scrollBottom) {
        setLoadingContent(true)
        window.removeEventListener('scroll',  handleScroll)

        axios.get(nextUrl.current)
        .then(res => {
          setLoadingContent(false)
          setTitles([...titles, ...res.data.results])
          nextUrl.current = res.data.next
          window.addEventListener('scroll',  handleScroll)
        })
      }
    }
  }

  const afterPartDelete = (id) => {

    let newTeamParts = team.participants.filter(element => element.user.id !== id)

    console.log(newTeamParts, id)

    setTeam({
      ...team,
      participants: newTeamParts
    })

    setUpdateTeam(true)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [titles])

  const OnLeaveHandler = async () => {

    setLeaveLoading(true)

    const url = `/titles/team/participant/`

    const data = {
      team: team.id,
      user: curUserId,
    }

    try {
      await api.delete(url, { data: data })

      dispatch(changeNotifications({type:'success', title:`Успех`, text:`Вы успешно покинули команду`}))

      setIsOwner(false)
      setIsParticipant(false)

      let participantsArray = [...team.participants]

      participantsArray = participantsArray.filter(element => element.user.id !== curUserId)

      if(participantsArray.length === 0)
        navigate('/')
      else
        setTeam({
          ...team,
          participants: participantsArray
        })
    }
    catch(err) {
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:`Ошибка`, text:`Авторизируйтесь для того, чтобы покинуть команду`}))
      else
        dispatch(changeNotifications({type:'error', title:`Ошибка`, text: Object.entries(err.response.data).map(([key, value]) => value)}))
    }

    setLeaveLoading(false)
  }

  if(notFound) 
    return <NotFound />

  if(!loadingTeam)
    return (
      <div className="team-page">
        <div className="team-page__info-block">
          <div className="team-page__picture-block">
            <img src={team.picture || mockImg} alt={team.name} className="team-page__picture"/>
          </div>
          
          <div className="team-page__participants-block">
            <div className="team-page__participants-title">
              <p className="team-page__participants-title-text">Участники</p>
            </div>

            <div className="team-page__participants">
              {
                team.participants.map((item,index) => 
                  <Participant 
                    key={`participant${index}`}
                    name={item.user.username}
                    picture={item.user.profile_pic}
                    roles={item.roles}
                  />
                )
              }
              {
                isOwner ?
                  <Button onClick={() => setAddPart(true)}>Добавить участника</Button>
                  : null
              }
            </div>
          </div>
        </div>

        <div className="team-page__more-info-block">
          <div className="team-page__info-content">
            <div className="team-page__title-block">
              <p className="team-page__title">{team.name}</p>
              
              <div className="flex flex-row">
                {
                  isOwner ? 
                    <Button onClick={() => setUpdateTeam(true)}>Настройки</Button>
                    : null
                }
                {
                  isParticipant ?     
                    <Button outline={true} onClick={() => OnLeaveHandler()} loading={leaveLoading}>Покинуть</Button>
                    : null
                }
              </div>
            </div>
            <div className="team-page__stats-block">
              <Stat title={"Тайтлов"} value={team.total_titles}/>
              <Stat title={"Глав"} value={team.total_chapters}/>
              <Stat title={"Лайков"} value={team.total_likes}/>
            </div>
            <div className="team-page__description-block">
              <p className="team-page__description default-text">{team.description}</p>
            </div>
          </div>

          <div className="team-page__titles-block">
            <div className="team-page__titles-header">
              <div className="team-page__titles-title-block">
                <p className="team-page__titles-title">Тайтлы</p>
              </div>

              <div className="sortBlock">
                <Select 
                  value = {sortValue}
                  onChange={e => setSortValue(e)}
                  styles={customStyles}
                  options={options}
                  isOptionDisabled={option => option.disabled}
                  isSearchable={false}
                />  
                <div className="switchSortButton" onClick={() => setDesc(!desc)}>
                  {desc ? 
                    <FaSortAmountDown size="30px" className="icon"/> : 
                    <FaSortAmountUpAlt size="30px" className="icon"/>
                  }
                </div>
              </div>
            </div>

            <div className="team-page__titles" ref={titlesBlock}>
              {
                loadingContent ? 
                <div className="spinnerBlock mt-20">
                  <Oval color={darkMode ? "white" : "black"} secondaryColor={darkMode ? "white" : "black"} height="50px" width="50px"/>
                </div> :
                <div className="mangaList">
                  {
                    titles.length > 0 ?
                      titles.map((item, index) => 
                        <Title 
                          key={`title${index}`}
                          poster={item.poster} 
                          name={item.name}
                          title_type={item.title_type.name || ""}
                          total_rating={item.total_rating}
                          age_rating={item.age_rating.name || ""}
                          slug={item.slug}
                        />
                      )
                      :
                      <div className="cahapters__text-container mx-auto">
                        <p className="chapters__text default-text">Тайтлы отсутствуют</p>
                      </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>

        <UpdateTeam 
          visibility={updateTeam}
          setVisibility={setUpdateTeam}
          team={team}
          setTeam={setTeam}
          deleteVisibility={deleteTeam}
          setDeleteVisibility={setDeleteTeam}
          parts={team.participants}
          setUpdatePart={setUpdatePart}
          setCurPartSettings={setCurPartSettings}
        />

        <DeleteList 
          visibility={deleteTeam} 
          setVisibility={setDeleteTeam} 
          callback={() => navigate('/')}
          setPrevVisibility={setUpdateTeam}
          url={`/titles/team/${team.slug}/`} 
          text={'команду'}
          textTitle={'Команда'}
          textNot={'команды'}
        />

        <ParticipantSettings 
          name={team.participants[curPartSettings] ? team.participants[curPartSettings].user.username : ""}
          profile_pic={team.participants[curPartSettings] ? team.participants[curPartSettings].user.profile_pic : null}
          id={team.participants[curPartSettings] ? team.participants[curPartSettings].user.id : null}
          setPrevVisibility={setUpdateTeam}
          visibility={updatePart}
          setVisibility={setUpdatePart}
          team={team}
          curPartSettings={curPartSettings}
          setDeletePart={setDeletePart}
          setTeam={setTeam}
        />

        <DeleteList 
          visibility={deletePart}
          setVisibility={setDeletePart}
          callback={() => afterPartDelete(team.participants[curPartSettings] ? team.participants[curPartSettings].user.id : null)}
          setPrevVisibility={setUpdateTeam}
          url={`/titles/team/participant/`}
          text={'участника'}
          textTitle={'Участник'}
          textNot={'участника'}
          data = {{
            team: team.id,
            user: team.participants[curPartSettings] ? team.participants[curPartSettings].user.id : null,
            roles: team.participants[curPartSettings] ? team.participants[curPartSettings].roles : null,
          }}
        />

        <AddParticipant 
          visibility={addPart}
          setVisibility={setAddPart}
          reqData={{team: team.id}}
        />

      </div>
    )
  else 
    return(
      <div className="spinnerBlock mt-20">
        <Oval color={darkMode ? "white" : "black"} secondaryColor={darkMode ? "white" : "black"} height="50px" width="50px"/>
      </div>
    )
}