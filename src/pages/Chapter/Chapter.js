import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import './style.css'
import api from '../../services/api'
import Authorazation from '../../components/Authorization/Authorazation'
import { FaBlind } from 'react-icons/fa'
import { BsMoonStarsFill } from 'react-icons/bs'
import useDarkMode from '../../hooks/useDarkMode'
import Login from '../../components/Login/Login'
import SignUp from '../../components/SignUp/SignUp'
import ActivationMessage from '../../components/ActivationMessage/ActivationMessage'
import ResetWindow from '../../components/ResetWindow/ResetWindow'
import homeImg from '../../Assets/icon.png'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { RiArrowUpSFill } from 'react-icons/ri'
import mockImg from '../../Assets/user_pict.png'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { changeNotifications } from '../../components/Notifications/notificationsSlice'
import { Oval } from 'react-loader-spinner'
import { selectTheme } from '../../components/Header/themeSlice'
import NotFound from '../../components/NotFound/NotFound'
import { selectAge, selectId } from '../../components/Login/loginSlice'
import Notifications from '../../components/Notifications/Notifications'
import Forbidden from '../../components/Forbidden/Forbidden'
import Unauthorized from '../../components/Unauthorized/Unauthorized'

export default function Chapter() {
  const dispatch = useDispatch()

  const [mode, setMode] = useDarkMode()

  const [toggleStyle, setToggleStyle] = useState()
  const [loginVisibility, setLoginVisibility] = useState(false)
  const [signUpVisibility, setSignUpVisibility] = useState(false)
  const [actMesVisibility, setActMesVisibility] = useState(false)
  const [resetVisibility, setResetVisibility] = useState(false)

  const params = useParams()

  const [chapter, setChapter] = useState({})
  const [chapters, setChapters] = useState([])

  const [backButtonDisabled, setBackButtonDisabled] = useState(false)
  const [forwardButtonDisabled, setForwardButtonDisabled] = useState(false)

  const [curIndex, setCurIndex] = useState()

  const [chapterSelectVisibility, setchapterSelectVisibility] = useState(false)
  const [pageSelectVisibility, setPageSelectVisibility] = useState(false)

  const [curPage, setCurPage] = useState(1)

  const [headerClassList, setHeaderClassList] = useState("chapter__header")

  const [isLiked, setIsLiked] = useState(false)

  const [loading, setLoading] = useState(true)

  const [notFound, setNotFound] = useState(false)
  const [forbidden, setForbidden] = useState(false)
  const [unauth, setUnauth] = useState(false)

  const select = useRef()
  const selBlock = useRef()
  const selectControlRef = useRef()

  const darkTheme = useSelector(selectTheme)

  const oldScroll = useRef(window.scrollY)

  const userId = useSelector(selectId)
  const userAge = useSelector(selectAge)

  useEffect(() => {
    const fetchData = async () => {
      const url = `/titles/chapter/${params.slug}/${params.team}/${params.volume}/${params.number}/`

      try {
        const res = await api.get(url)

        setChapter(res.data)
  
        setIsLiked(res.data.liked_by_user)
        
        setLoading(false)
      }
      catch(err) {
        if(err.response.status === 403)
          setForbidden(true)
        if(err.response.status === 401)
          setUnauth(true)
        if(err.response.status === 404)
          setNotFound(true)
        setLoading(false)
      }
    }

    fetchData()

    document.addEventListener('click', handleClick)
    document.addEventListener('scroll', hideIfScroll)

    return() => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('scroll', hideIfScroll)
    }
  }, [userAge])

  const handleClick = (e) => {
    try{
      if(!select.current.contains(e.target))
        setchapterSelectVisibility(false)
    }
    catch(err) {

    }

    try{
      if(!selectControlRef.current.contains(e.target))
        setPageSelectVisibility(false)
    }
    catch(err) {

    }
  }

  const hideIfScroll = e => {
    if(oldScroll.current > window.scrollY)
      setHeaderClassList('chapter__header')
    else
      setHeaderClassList('chapter__header chapter__header_hidden')
    oldScroll.current = window.scrollY
  }

  const handleScroll = e => {
    const arr = document.querySelectorAll('.chapter__title-page')

    let page

    arr.forEach((item, index) => {
      let coords = item.getBoundingClientRect()
      if(coords.top - 10 < 0) {
        page = index + 1
      }
    })

    page = page ?? 1

    if(page !== curPage)
      setCurPage(page)
  }

  useEffect(() => {
    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [curPage])

  useEffect(() => {
    const fetchChapterData = async () => {
      const url = `/titles/chapters/${params.slug}/${params.team}/`

      try {
        const res = await api.get(url)

        setChapters(res.data)
  
        const curIndex = res.data.findIndex(element => element.volume_number === +params.volume && element.chapter_number === +params.number)

        setCurIndex(curIndex)

        if(curIndex === 0)
          setForwardButtonDisabled(true)

        if(curIndex === res.data.length - 1)
          setBackButtonDisabled(true)

        if(res.data.length > 5)
          selBlock.current.style.overflowY = 'scroll'
      }
      catch(err) {

      }
    }

    fetchChapterData()
  }, [])

  useEffect(() => {
    if(typeof mode == 'undefined') {
      if (window.matchMedia) {
        if(window.matchMedia('(prefers-color-scheme: dark)').matches){
          setMode(true);
        } else {
          setMode(false)
        }
      } else {
        setMode(true)
      }
    }
    mode ? setToggleStyle("toggle") : setToggleStyle("toggle switched")
  }, [mode, setMode])

  const handleToggle = () => {
    setMode(!mode)
  }

  const onPageSelectOptionClick = (index) => {
    document.querySelector(`#chapter__title-page-${index}`).scrollIntoView({
      behavior: 'smooth'
    })
  }

  const hideHeader = () => {
    if(headerClassList === 'chapter__header')
      setHeaderClassList('chapter__header chapter__header_hidden')
    else 
      setHeaderClassList('chapter__header')
  }

  const onLikeHandler = async () => {
    if(userId === null) {
      dispatch(changeNotifications({type:'error', title:'Лайк не поствален', text:'Авторизируйтесь для проставления лайков'}))
      return
    }

    if(!isLiked) {
      setIsLiked(true)

      const url = "/titles/chapter/like/"

      const data = {
        chapter_id: chapter.id
      }
      
      try {
        await api.post(url, JSON.stringify(data))
      }
      catch(err) {
        if(err.response.data.refresh) {
          dispatch(changeNotifications({type:'error', title:'Лайк не поствален', text:'Авторизируйтесь для проставления лайков'}))
        }
        else {
          dispatch(changeNotifications({type:'error', title:'Ошибка', text:'Лайк не поствален'}))
        }
      }
    }
  }

  if(loading)
    return (
      <div className="chapter relative">
        <div className="spinnerBlock absolute top-1/2 -translate-y-1/2">
          <Oval color={darkTheme ? "white" : "black"} secondaryColor={darkTheme ? "white" : "black"} height="50px" width="50px"/>
        </div>
      </div>
    )
  
  if(unauth)
    return (
      <div className="chapter relative">
        <Unauthorized />
      </div>
    )

  if(forbidden)
    return (
      <div className="chapter relative">
        <Forbidden />
      </div>
    )

  if(notFound)
    return (
      <div className="chapter relative">
        <NotFound />
      </div>
    )

  return (
    <div className="chapter">
      <div className={headerClassList}>
        <div className="chapter__header-content">
          <div className="chapter__link-container">
            <a href={`/`}>
              <div className="chapter__home-link">
                <img src={homeImg} alt="home" className="chapter__home-link-img"/>
              </div>
            </a>
            <div className="chapter__titles-block">
              <a className="chapter__back-link" href={`/title/${params.slug}?content=chapters`}>
                <div className="chapter__back-link-block">
                  <p className="chapter__back-link-text default-text">{chapter.title ? chapter.title.name : ""}</p>
                </div>
              </a>
              <div className="chpater__chapter-name-block">
                <p className="chpater__chapter-name">{chapter.name}</p>
              </div>
            </div>
          </div>

          <div className="chapter__chapters-buttons">
            {
              backButtonDisabled ? 
                <div className="chapter__chapter-change-button-disabled">
                  <IoIosArrowBack className="chapter__icon-disabled" size={"30px"}/>
                </div>
                :
                <a href={chapters[curIndex+1] ? `/title/${params.slug}/${params.team}/${chapters[curIndex+1].volume_number}/${chapters[curIndex+1].chapter_number}/` : "/"}>
                  <div className="chapter__chapter-change-button">
                    <IoIosArrowBack className="icon" size={"30px"}/>
                  </div>
                </a>
            }

            <div className="chapter__chapters-nav-button" onClick={() => {if(chapters.length > 1) setchapterSelectVisibility(true)}} ref={select}>
              <p className="chapter__chapters-nav-button-text default-text">{`Том ${chapter.volume_number} Глава ${chapter.chapter_number}`}</p>
            </div>

            {
              forwardButtonDisabled ? 
                <div className="chapter__chapter-change-button-disabled">
                  <IoIosArrowForward className="chapter__icon-disabled" size={"30px"}/>
                </div>
                :
                <a href={chapters[curIndex-1] ? `/title/${params.slug}/${params.team}/${chapters[curIndex-1].volume_number}/${chapters[curIndex-1].chapter_number}/` : "/"}>
                  <div className="chapter__chapter-change-button">
                    <IoIosArrowForward className="icon" size={"30px"}/>
                  </div>
                </a>
            }
          </div>

          {
            chapterSelectVisibility ?
              <div style={chapters.length > 5 ? {'overflowY': 'scroll'}: {}} className="chapter__chapter-select" ref={selBlock}>
                {
                  chapters.map((item, index) => {
                    if(index !== curIndex) 
                      return(
                        <a href={`/title/${params.slug}/${params.team}/${item.volume_number}/${item.chapter_number}/`}>
                          <div className="chapter__chapter-select-item" key={`chapter${index}`}>
                            <p className="chapter__chapters-nav-button-text default-text">{`Том ${item.volume_number} Глава ${item.chapter_number}`}</p>
                          </div>
                        </a>
                      )
                    else 
                      return (
                        <div className="chapter__chapter-select-item chapter__chapter-select-item_selected" key={`chapter${index}`}>
                          <p className="chapter__chapters-nav-button-text default-text">{`Том ${item.volume_number} Глава ${item.chapter_number}`}</p>
                        </div>
                      )
                  })
                }
              </div>
              : null
          }

          <div className="chapter__options">
            <div className={"toggle-switch"} onClick={() => handleToggle()}>
              <div className={toggleStyle}>
                {mode ? 
                <BsMoonStarsFill size={"16px" } color="white"/>:
                <FaBlind size={"16px" } color="black"/>}
              </div>
            </div>
            <Authorazation 
              setLoginVisibility={setLoginVisibility} 
              setSignUpVisibility={setSignUpVisibility}
            />
          </div>
        </div>
      </div>

      <div className="chapter__content">
        <div className="chapter__pages">
          {
            chapter.images ?
              chapter.images[0] ?
                chapter.images.map((item, index) => 
                  <img 
                    src={item}
                    alt={`mangaPage${index}`}
                    key={`mangaPage${index}`}
                    className={`chapter__title-page`}
                    id={`chapter__title-page-${index}`}
                    onClick={() => hideHeader()}
                  />
                )
                : <div className="chapters">
                    <div className="cahapters__text-container">
                      <p className="chapters__text default-text">Страницы к этой главе не были загружены</p>
                    </div>
                  </div>
              : null
          }

          {
            chapter.images ?
              chapter.images[0] ? 
                <div className="chapter__pages-select">
                  <div className="chapter__pages-select-control" ref={selectControlRef} onClick={() => setPageSelectVisibility(true)}>
                    <p className="chapter__pages-select-control-text default-text">Страница {curPage}</p>
                    <div>
                      <RiArrowUpSFill className='icon' size={"20px"}/>
                    </div>
                  </div>

                  {
                    pageSelectVisibility ?
                      <div style={chapter.images.length > 8 ? {'overflowY': 'scroll'}: {}} className="chapter__pages-select-options">
                        {
                          [...Array(chapter.images.length).keys()].map(item => 
                            <div className="chapter__pages-select-option" key={`pagesItem${item}`} onClick={() => onPageSelectOptionClick(item)}>
                              <p className="chapter__pages-select-option-text default-text">Страница {item + 1}</p>
                            </div>
                          )
                        }
                      </div>
                      : null
                  }
                  
                </div>
              : null : null
          }
        </div>

        <div className="chapter__footer"> 
          <a href={`/team/${chapter.team ? chapter.team.slug : ""}`}>
            <div className="chapter__team">
              <div className="chapter__team-img-block">
                <img className="chapter__team-img" alt={chapter.team ? chapter.team.name : ""} src={chapter.team ? chapter.team.picture ?? mockImg : mockImg}/>
              </div>

              <div className="chapter__team-name-block">
                <p className="chapter__team-name default-text">{chapter.team ? chapter.team.name : ""}</p>
              </div>
            </div>
          </a>

          <div className="chapter__lukas" onClick={() => onLikeHandler()}>
            <div>
              {
                isLiked ?
                  <AiFillHeart size={"20px"} className="icon-inverted"/>
                  : <AiOutlineHeart size={"20px"} className="icon-inverted"/>
              }
            </div>
            <div className="chapter__lukas-text-block">
              <p className="chapter__lukas-text">Понравилось</p>
            </div>
          </div>
        </div>
      </div>

      <Login visibility={loginVisibility} setVisibility={setLoginVisibility} setSignUpVisibility={setSignUpVisibility} setResetVisibility={setResetVisibility}/>
      <SignUp visibility={signUpVisibility} setVisibility={setSignUpVisibility} setActMesVisibility={setActMesVisibility}/>
      <ActivationMessage visibility={actMesVisibility} setVisibility={setActMesVisibility}/>
      <ResetWindow visibility={resetVisibility} setVisibility={setResetVisibility} setActMesVisibility={setActMesVisibility}/>

      <Notifications />
    </div>
  )
}
