import React, {useEffect, useState} from 'react'
import './style.css'
import MangaTeam from '../MangaTeam/MangaTeam'
import mockimg from '../../Assets/user_pict.png'
import { useDispatch, useSelector } from 'react-redux'
import { selectTheme } from '../Header/themeSlice'
import { Oval } from 'react-loader-spinner'
import api from '../../services/api'
import MangaChapter from '../MangaChapter/MangaChapter'
import { selectAge, selectId } from '../Login/loginSlice'
import EditChapter from '../EditChapter/EditChapter'
import DeleteList from '../DeleteList/DeleteList'
import { changeDeleted, changeLoading, changeUploading, selectDeleted, selectLoading, selectUploading} from './chaptersSlice'

export default function ChaptersInfo({curTab, name, licensed, id, teams, subscribed, titleSlug, ageRating}) {
  const dispatch = useDispatch()

  const [chapters, setChapters] = useState({"0": []})

  const [curTeam, setCurTeam] = useState(0)

  const loading = useSelector(selectLoading)
  const deleted = useSelector(selectDeleted)
  const uploading = useSelector(selectUploading)

  const darkTheme = useSelector(selectTheme)

  const [desc, setDesc] = useState(true)

  const [deleteVisibility, setDeleteVisibility] = useState(false)
  const [editVisibility, setEditVisibility] = useState(false)

  const [curChapter, setCurChapter] = useState()

  const [userTeams, setUserTeams] = useState([])

  const userId = useSelector(selectId)
  
  const [reload, setReload] = useState(false)

  const [prevUserId, setPrevUserId] = useState(null)

  const userAge = useSelector(selectAge)

  const [userTeamsLoading, setUserTeamsLoading] = useState(true)

  useEffect(() => {
    if(teams.length !== 0)
      dispatch(changeLoading(new Array(teams.length).fill(true)))
  }, [])
  

  useEffect(() => {
    if(teams.length !== 0 && deleted.length === 0)
      dispatch(changeDeleted(new Array(teams.length).fill(false)))

    if(teams.length !== 0 && loading.length === 0)
      dispatch(changeLoading(new Array(teams.length).fill(true)))

    if(userAge < 18 && ageRating === "M" && teams[curTeam] && userTeams.findIndex(element => element.name === teams[curTeam].name) === -1) {
      let loadArrayE = [...loading]

      if(loadArrayE.length === 0)
        loadArrayE = new Array(teams.length).fill(true)

      loadArrayE[curTeam] = false
      dispatch(changeLoading(loadArrayE))

      return
    }

    if((curTab === name && (!chapters[curTeam] || chapters[curTeam].length === 0) && teams.length !== 0) || reload) {
      let loadArrayQ = [...loading]

      if(loadArrayQ.length === 0)
        loadArrayQ = new Array(teams.length).fill(true)

      loadArrayQ[curTeam] = true
      dispatch(changeLoading(loadArrayQ))

      setReload(false)

      const url = `/titles/chapters/${id}/${teams[curTeam].id}/`

      const getData = async (url) => {
        try {
          const res = await api.get(url)
          
          setChapters({
            ...chapters,
            [curTeam]: res.data
          })

          let loadArrayT = [...loading]

          if(loadArrayT.length === 0)
            loadArrayT = new Array(teams.length).fill(true)

          loadArrayT[curTeam] = false
          dispatch(changeLoading(loadArrayT))
        }
        catch(err) {
          let loadArrayC = [...loading]

          if(loadArrayC.length === 0)
            loadArrayC = new Array(teams.length).fill(true)

          loadArrayC[curTeam] = false
          dispatch(changeLoading(loadArrayC))
        }
      }
      
      getData(url)
    }
    else {
      let loadArrayE = [...loading]

      if(loadArrayE.length === 0)
        loadArrayE = new Array(teams.length).fill(true)

      loadArrayE[curTeam] = false
      dispatch(changeLoading(loadArrayE))
    }
  }, [curTab, curTeam, userId, reload, userTeams])

  useEffect(() => {
    if(chapters[curTeam] && chapters[curTeam].length !== 0)
      dispatch(changeUploading(false))
    else 
      dispatch(changeUploading(true))
  }, [curTeam, uploading, chapters])

  useEffect(() => {
    if(teams.length === 0)
      return
    if(prevUserId !== null && prevUserId !== userId) {
      setChapters(Object.fromEntries([...Array(Object.keys(chapters).length).keys()].map(item => [item, []])))
      setReload(true)
      setPrevUserId(userId)
    }
  }, [userId])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `/titles/chapter/teams-with-chapter-access/`
        const res = await api.get(url)
        setUserTeamsLoading(false)
        setUserTeams(res.data.in_teams)
      }
      catch(err) {
        setUserTeamsLoading(false)
      }
    }

    setUserTeamsLoading(true)

    if(userId) {
      fetchData()
    }
    else {
      setUserTeams([])
      setUserTeamsLoading(false)
    }
  }, [userId])

  const compare = (a, b) => {
    return a.volume_number > b.volume_number ? 1 
      : a.volume_number === b.volume_number ? a.chapter_number > b.chapter_number ? 1 
        : a.chapter_number === b.chapter_number ? 0 
          : -1 
            : -1
  }

  const afterChapterDelete = () => {
    let newChaptersArray = chapters[curTeam].filter(element => element.id !== curChapter.id)

    let newChaptersObj = {
      ...chapters,
      [curTeam]: [...newChaptersArray]
    }

    setChapters(newChaptersObj)

    if(newChaptersObj[curTeam].length === 0) {
      let newDeletedArray = [...deleted]
      newDeletedArray[curTeam] = true
      dispatch(changeDeleted(newDeletedArray))
    }
  }

  if(userAge < 18 && ageRating === "M" && curTab === name && userTeams.length === 0)
    return (
      <div className="chapters">
        <div className="cahapters__text-container">
          <p className="chapters__text default-text">Главы недоступны из-за возрастных ограничений</p>
        </div>
      </div>
    )

  if(teams.length === 0 && curTab === name && !licensed)
    return (
      <div className="chapters">
        <div className="cahapters__text-container">
          <p className="chapters__text default-text">Главы к этому тайтлу не были добавлены</p>
        </div>
      </div>
    )

  if(curTab === name)
    if(!licensed)
      return (
        <div className="chapters">
          <div className="chapters__teams-block">
            {teams.map((item,index) => 
              <MangaTeam 
                key={`mangateam${index}`}
                id={item.id}
                manga_id={id}
                name={item.name}
                picture={item.picture || mockimg}
                curTeam={curTeam}
                setCurTeam={setCurTeam}
                index={index}
                subscribedTeams={subscribed}
              />
            )}
          </div>

          {
            !loading[curTeam] && !uploading && !deleted[curTeam] && ageRating !== "M" 
            || !loading[curTeam] && !uploading && !deleted[curTeam] && userAge < 18 && ageRating === "M" && userTeams.findIndex(element => element.name === teams[curTeam].name) !== -1
            || !loading[curTeam] && !uploading && !deleted[curTeam] && userAge >= 18 && ageRating === "M" ?
              <div className="chapters__sort-block">
                <button type='submit' onClick={() => setDesc(!desc)} className="chapters__sort-button">
                  <p className="chapters__sort-text default-text">{desc ? 
                    "От старых к новым" :
                    "От новых к старым"
                  }</p>
                </button>
              </div>
              : null
          }
          
          {loading[curTeam] || userTeamsLoading ?
            <div className="spinnerBlock mb-4">
              <Oval color={darkTheme ? "white" : "black"} secondaryColor={darkTheme ? "white" : "black"} height="50px" width="50px"/>
            </div> 
            :
            <div className="chapters__content-block">
              <div className="chapters__chapters-content">
                { 
                  userAge < 18 && ageRating === "M" && teams[curTeam] && userTeams.findIndex(element => element.name === teams[curTeam].name) === -1 ?
                    <div className="chapters">
                      <div className="cahapters__text-container">
                        <p className="chapters__text default-text">Главы недоступны из-за возрастных ограничений</p>
                      </div>
                    </div>
                    :
                    deleted[curTeam]?
                      <div className="chapters">
                        <div className="cahapters__text-container">
                          <p className="chapters__text default-text">Главы были удалены</p>
                        </div>
                      </div>
                      :
                      uploading ?
                        <div className="chapters">
                          <div className="cahapters__text-container">
                            <p className="chapters__text default-text">Нет загруженых глав</p>
                          </div>
                        </div>
                        :
                        chapters[curTeam] ?
                          chapters[curTeam].sort((a, b) => desc ? compare(b, a) : compare(a, b)).map((item, index) => 
                            <MangaChapter 
                              key={`mangachapter${index}`}
                              setCurChapter={setCurChapter}
                              setDeleteVisibility={setDeleteVisibility}
                              setEditVisibility={setEditVisibility}
                              isParticipant={userTeams.findIndex(element => element.name === teams[curTeam].name) !== -1}
                              titleSlug={titleSlug}
                              teamSlug={teams[curTeam].slug}
                              {...item}
                            />
                          )
                          : null
                }
              </div>
            </div>
          }

          <EditChapter 
            visibility={editVisibility}
            setVisibility={setEditVisibility}
            curChapter={curChapter}
            chapters={chapters}
            setChapters={setChapters}
            curTeam={curTeam}
          />

          <DeleteList
            visibility={deleteVisibility} 
            setVisibility={setDeleteVisibility} 
            callback={() => afterChapterDelete()}
            url={`/titles/chapter/delete/${curChapter ? curChapter.id : -1}/`} 
            text={'главу'}
            textTitle={'Глава'}
            textNot={'главы'}
          />
        </div>
      )
    else
      return (
        <div className="chapters">
          <div className="cahapters__text-container">
            <p className="chapters__text default-text">Данный тайтл является лицензированным, ознакомиться с ним вы можете на официальных ресурсах</p>
          </div>
        </div>
      )
  else
    return null
}
