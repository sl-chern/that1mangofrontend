import React, { useEffect, useState, useRef } from 'react'
import './style.css'
import axios from 'axios'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import mockImg from '../../Assets/user_pict.png'
import { useSelector } from 'react-redux'
import { selectTheme } from '../../components/Header/themeSlice'
import { FaSortAmountDown, FaSortAmountUpAlt } from 'react-icons/fa'
import useSelectTheme from '../../hooks/useSecteTheme'
import Select from 'react-select'
import { Oval } from 'react-loader-spinner'
import Title from '../../components/Title/Title'
import NotFound from '../../components/NotFound/NotFound'

const options = [
  { value: 'rating', label: 'По рейтингу' },
  { value: 'name', label: 'По имени' },
  { value: 'date_added', label: 'По дате добавления' },
  { value: 'chapters', label: 'По количеству глав' },
]

export default function Person({type}) {

  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const dark = useSelector(selectTheme)

  const [darkMode, setDarkMode] = useState(dark)

  const [team, setTeam] = useState({alternative_names: []})

  const customStyles = useSelectTheme(darkMode)

  const [desc, setDesc] = useState(true)
  const [sortValue, setSortValue] = useState(options[0])

  const [titles, setTitles] = useState([])

  const [loadingContent, setLoadingContent] = useState(true)
  const [loadingTeam, setLoadingTeam] = useState(true)

  const nextUrl = useRef()
  const titlesBlock = useRef()

  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setDarkMode(dark)
  }, [dark])

  useEffect(() => {
    const url = `/titles/${type}/${params.slug || params.id}/`

    setNotFound(false)

    setLoadingTeam(true)

    const fetchData = async () => {
      try {
        const {data} = await axios.get(url)
        setLoadingTeam(false)
        setTeam(data)
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

    setLoadingContent(true)
    
    let order = "?order="

    if(sortValue.value) {
      let descValue = desc ? "-" : ""
      order += descValue + sortValue.value
    }
    
    const url = `/titles/${type}/titles/${params.slug || params.id}${order}`

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

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [titles])

  if(notFound) 
    return <NotFound />

  if(!loadingTeam)
    return (
      <div className="team-page-vertical">
        <div className="team-page__info-block-horizontal">
          <div className="team-page__picture-block-person">
            <img src={team.picture || mockImg} alt={team.name} className="team-page__picture"/>
          </div>

          <div className="team-page__info-content">
            <div className="team-page__title-block">
              <p className="team-page__title">{team.name}</p>
            </div>
            <div className="team-page__alt-name-block">
              {team.alternative_names.map((item, index) => 
                <p className="team-page__alt-name" key={`altname${index}`}>{item}</p>
              )}
            </div>
            <div className="team-page__description-block">
              <p className="team-page__description default-text">{team.description}</p>
            </div>
          </div>
        </div>

        <div className="team-page__info-block-horizontal">
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
                  {titles.map((item, index) => 
                    <Title 
                      key={`title${index}`}
                      poster={item.poster} 
                      name={item.name}
                      title_type={item.title_type.name || ""}
                      total_rating={item.total_rating}
                      age_rating={item.age_rating.name || ""}
                      slug={item.slug}
                    />
                  )}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  else 
    return(
      <div className="spinnerBlock mt-20">
        <Oval color={darkMode ? "white" : "black"} secondaryColor={darkMode ? "white" : "black"} height="50px" width="50px"/>
      </div>
    )
}