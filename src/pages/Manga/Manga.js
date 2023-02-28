import React, {useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import './style.css'
import api from '../../services/api'
import cov from '../../Assets/DimaLoh.png'
import { useSelector, useDispatch } from 'react-redux'
import { selectAge, selectId, selectLogin } from '../../components/Login/loginSlice'
import InfoBlock from './InfoBlock'
import AlternativeNames from './AlternativeNames'
import { AiFillStar, AiOutlinePlus } from 'react-icons/ai'
import { BsFillBookmarksFill, BsFillPersonCheckFill } from 'react-icons/bs'
import { AiFillHeart } from 'react-icons/ai'
import AmountInfo from './AmountInfo'
import { useSearchParams } from 'react-router-dom'
import TabList from '../../components/TabList/TabList'
import MangaInfo from '../../components/MangaInfo/MangaInfo'
import Persons from '../../components/Persons/Persons'
import RatingWindow from '../../components/RatingWindow/RatingWindow'
import ChaptersInfo from '../../components/ChaptersInfo/ChaptersInfo'
import { selectTheme } from '../../components/Header/themeSlice'
import { Oval } from 'react-loader-spinner'
import { AiOutlineBell, AiFillBell } from 'react-icons/ai'
import { changeNotifications } from '../../components/Notifications/notificationsSlice'
import SelectLists from '../../components/SelectLists/SelectLists'
import CommentsInfo from '../../components/CommentsInfo/CommentsInfo'
import NotFound from '../../components/NotFound/NotFound'
import setAllMarks from './manga.functions'
import UploadChapter from '../UploadChapter/UploadChapter'
import { IoIosShareAlt } from 'react-icons/io'
import Share from '../../components/Share/Share'
import { changeTitleLoading } from '../../components/Title/titleSlice'

export default function Manga() {

  const dispatch = useDispatch()

  const [manga, setManga] = useState({})

  const darkTheme = useSelector(selectTheme)

  const [rateVisibility, setRateVisibility] = useState(false)

  const [userLists, setUserLists] = useState([{name: "Списки"}])
  const [rating, setRating] = useState(null)
  const [marksAmount, setMarksAmount] = useState(null)
  const [marks, setMarks] = useState(null)
  const [titleRating, setTitleRating] = useState([])

  const params = useParams()

  const navigate = useNavigate()

  const userName = useSelector(selectLogin)

  const userId = useSelector(selectId)

  const [searchParams, setSearchParams] = useSearchParams()

  const [loading, setLoading] = useState(true)

  const location = useLocation()

  const [subscribed, setSubscribed] = useState(false)
  const [subscridedToTeams, setSubscridedToTeams] = useState([])

  const [notFound, setNotFound] = useState(false)

  const [addChapter, setAddChapter] = useState(false)

  const [teams, setTeams] = useState([])

  const [addChapterLoading, setAddChapterLoading] = useState(false)

  const [shareVisibility, setshareVisibility] = useState(false)

  const userAge = useSelector(selectAge)

  useEffect(() => {
    dispatch(changeTitleLoading(true))

    setNotFound(false)

    setLoading(true)

    if(!searchParams.get("content") || !(searchParams.get("content") === 'info' ||
    searchParams.get("content") === 'chapters' || searchParams.get("content") === 'comments'))
      setSearchParams({content: "info"}, {replace: true})

    const url = `titles/${params.slug}`

    api.get(url)
    .then(res => {
      setAllMarks(setMarksAmount, setRating, setMarks, setTitleRating, res.data.title.title_rating)

      setSubscribed(res.data.title.subscribed)
      setSubscridedToTeams(res.data.subscribed_to_teams)

      setManga(res.data.title)

      console.log(res.data)

      setLoading(false)

      dispatch(changeTitleLoading(false))
    })
    .catch((err) => {
      console.log(err);
      if(err.response.status === 404)
        setNotFound(true)
      else
        navigate('/')
    })

  }, [location.pathname])

  useEffect(() => {
    if(userId === -1)
      return

    const urlLists = `/social/lists/lists/${userName}/`

    const fetchListData = async () => {
      try {
        const { data } = await api.get(urlLists)
        setUserLists([
          {name: 'Списки', nothing: true},
          ...data
        ])
      }
      catch(err) {

      }
    }

    fetchListData()
  }, [userName])

  const handleSubscribe = async () => {
    const data = {
      title: manga.id
    }

    if(subscribed) {
      try {
        await api.delete('/social/unsubscribe/', {data: JSON.stringify(data)})
        setSubscribed(false)
        dispatch(changeNotifications({type: 'success', title: 'Отписка', text: 'Вы были отписаны от обновлений'}))
      }
      catch(err) {
        if(err.response.data.refresh)
          dispatch(changeNotifications({type: 'error', title: 'Ошибка отмены подписки', text: 'Авторизируйтесь для отмены подписки'}))
        else
          dispatch(changeNotifications({type: 'error', title: 'Ошибка', text: 'Подписка не была отмена'}))
      }
    }
    else {
      try {
        await api.post('/social/subscribe/', JSON.stringify(data))
        setSubscribed(true)
        dispatch(changeNotifications({type: 'success', title: 'Подписка', text: 'Вы были подписаны на обновления'}))
      }
      catch(err) {
        if(err.response.data.refresh)
          dispatch(changeNotifications({type: 'error', title: 'Ошибка оформления подписки', text: 'Авторизируйтесь для оформления подписки'}))
        else
          dispatch(changeNotifications({type: 'error', title: 'Ошибка', text: 'Подписка не была оформлена'}))
      }
    }
  }

  const addChapterButtonHandler = async () => {
    setAddChapterLoading(true)
    setTeams(null)
    
    try {
      const url = `/titles/chapter/teams-with-chapter-access/`

      const res = await api.get(url)

      setTeams(res.data.in_teams)

      setAddChapter(true)
    }
    catch(err) {
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:`Ошибка добавления главы`, text:`Авторизируйтесь для добавления главы`}))
      else
        dispatch(changeNotifications({type:'error', title:`Ошибка добавления главы`, text: Object.entries(err.response.data).map(([key, value]) => value)}))
    }

    setAddChapterLoading(false)
  }

  if(notFound) 
    return <NotFound />

  if(loading)
    return (
      <div className="spinnerBlock">
        <Oval color={darkTheme ? "white" : "black"} secondaryColor={darkTheme ? "white" : "black"} height="50px" width="50px"/>
      </div>
    )
  else
    return (
      <div className="manga">
        <div className="mangaSidebar">
          <div className="mangaPoster">
            <img style={manga.age_rating.slug === "M" && userAge < 18 ? {"filter": "blur(20px)"} : {}} src={manga.poster || cov} alt={manga.name}/>

            <div className="manga__option-buttons">
              <div className="subscribe-button-block">
                <div className="subscribe-button-block__button group" onClick={() => handleSubscribe()}>
                  {subscribed ? 
                    <AiFillBell className="icon" size={"26px"}/> :
                    <AiOutlineBell className="icon" size={"26px"}/>
                  }
                </div>
                <div className="subscribe-button-block__description-container">
                  <div className="subscribe-button-block__description-block">
                    <p className="subscribe-button-block__description">
                      {subscribed ? "Отписаться от обновлений" : "Подписаться на обновления"}
                    </p>
                  </div>
                </div>
              </div>

              {
                !manga.licensed ?
                  addChapterLoading ?

                    <div className="subscribe-button-block">
                      <div className="subscribe-button-block__button">
                        <Oval color={darkTheme ? "white" : "black"} secondaryColor={darkTheme ? "white" : "black"} height="20px" width="20px"/>
                      </div>
                    </div>

                    :

                    <div className="subscribe-button-block">
                      <div className="subscribe-button-block__button" onClick={() => addChapterButtonHandler()}>
                        <AiOutlinePlus className="icon" size={"26px"}/>
                      </div>
                      <div className="subscribe-button-block__description-container">
                        <div className="subscribe-button-block__description-block">
                          <p className="subscribe-button-block__description">Добавить главу</p>
                        </div>
                      </div>
                    </div>
                    : null
              }

              <div className="subscribe-button-block">
                <div className="subscribe-button-block__button group" onClick={() => setshareVisibility(true)}>
                  <IoIosShareAlt className="icon" size={"26px"}/>
                </div>
                <div className="subscribe-button-block__description-container">
                  <div className="subscribe-button-block__description-block">
                    <p className="subscribe-button-block__description">
                      Поделиться
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mangaButtons">
            <SelectLists
              userLists={userLists}
              id={manga.id}
            />
          </div>

          <div className="mangaInfo">
            <InfoBlock type="Тип" text={manga.title_type} param="type"/>
            <InfoBlock type="Формат выпуска" text={manga.release_format} param="release_format"/>
            <InfoBlock type="Год выпуска" text={{name:manga.release_year}} param="year"/>
            <InfoBlock type="Статус тайтла" text={manga.title_status} param="status"/>
            <InfoBlock type="Возрастной рейтинг" text={manga.age_rating} param="age"/>
            <InfoBlock type="Загружено глав" text={{name:`${manga.chapter_count} / ${manga.chapters ?? '?'}`}} param={null}/>
            <AlternativeNames names={manga.alternative_names}/>
          </div>
        </div>
        <div className="mangaContent">
          <div className="mangaTitle">
            <div className="titles">
              <div className="russianTitleContainer">
                <p className="russianTitle">{manga.name}</p>
              </div>
              <div className="englishTitleContainer">
                <p className="englishTitle">{manga.english_name}</p>
              </div>
            </div>

            <div className="ratingBlock">
              <div className="ratingButton" onClick={() => {
                if(manga.title_status.slug === 'Announcement')
                  dispatch(changeNotifications({type: 'error', title: 'Ошибка оценивания', text: 'Анонсированные тайтлы нельзя оценивать'}))
                else
                  setRateVisibility(true)
              }}>
                <AiFillStar className="icon" size={"25px"}/>
                <p className="rating">{parseFloat(rating).toFixed(2)}</p>
              </div>
              <AmountInfo 
                amount={marksAmount}
                icon={<BsFillPersonCheckFill className="icon" size={"25px"}/>}
                tip={"Оценили"}
              />
              <AmountInfo
                amount={manga.likes}
                icon={<AiFillHeart className="icon" size={"25px"}/>}
                tip={"Лайков на главах"}
              />
              <AmountInfo 
                amount={manga.in_lists}
                icon={<BsFillBookmarksFill className="icon" size={"25px"}/>}
                tip={"В списках у пользователей"}
              />
            </div>
          </div>

          <div className="contentBlock">
            <div className="mangaContentBlock">
              <TabList curTab={searchParams.get("content") || 'info'} list={[
                {name:"info", title:"Описание", onClick: () => setSearchParams({content: "info"}, {replace: true})},
                {name:"chapters", title:"Главы", onClick: () => setSearchParams({content: "chapters"}, {replace: true})},
                {name:"comments", title:"Комментарии", onClick: () => setSearchParams({content: "comments"}, {replace: true})},
              ]}/>

              <MangaInfo 
                curTab={searchParams.get("content") || 'info'} 
                name="info"
                description={manga.description}
                keywords={manga.keywords || []}
                marks={marks || []}
              />

              <ChaptersInfo
                curTab={searchParams.get("content") || 'info'} 
                name="chapters"
                licensed={manga.licensed}
                id={manga.id}
                ageRating={manga.age_rating ? manga.age_rating.slug : ""}
                teams={manga.teams || []}
                subscribed={subscridedToTeams || []}
                titleSlug={manga.slug}
              />

              <CommentsInfo
                curTab={searchParams.get("content") || 'info'} 
                name="comments"
                id={manga.id}
              />

            </div>

            <div className="mangaPersonBlock">
              <Persons title={"Переводчик"} pluralTitle={"Переводчики"} list={manga.teams || []} param="team"/>
              <Persons title={"Автор"} pluralTitle={"Автора"} list={manga.person ? manga.person.filter(element => element.title_role.name === 'Автор') : []} param="person"/>
              <Persons title={"Художник"} pluralTitle={"Художники"} list={manga.person ? manga.person.filter(element => element.title_role.name === 'Художник') : []} param="person"/>
              <Persons title={"Издатель"} pluralTitle={"Издатели"} list={manga.publisher || []} param="publisher"/>
            </div>
          </div>
        </div>
        <RatingWindow 
          visibility={rateVisibility} 
          setVisibility={setRateVisibility}
          id={manga.id}
          titleRating={titleRating}
          setAllMarks={setAllMarks}
          setMarksAmount={setMarksAmount}
          setRating={setRating}
          setMarks={setMarks}
          setTitleRating={setTitleRating}
        />

        <UploadChapter 
          visibility={addChapter}
          setVisibility={setAddChapter}
          titleId={manga.id}
          teams={teams}
        />

        <Share 
          visibility={shareVisibility}
          setVisibility={setshareVisibility}
          slug={manga.slug}
        />
      </div>
    )
}
