import React, { useState, useEffect, useRef } from 'react'
import { IconContext } from 'react-icons/lib'
import { RiCloseLine } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import api from '../../services/api'
import RangeInput from '../../components/RangeInput/RangeInput'
import { changeNotifications } from '../../components/Notifications/notificationsSlice'
import Button from '../../components/Button/Button'

export default function EditChapter({visibility, setVisibility, curChapter, chapters, setChapters, curTeam}) {
  const dispatch = useDispatch()

  const [mode, setMode] = useState()

  const [chapterName, setChapterName] = useState("")
  const [chapterNumber, setChapterNumber] = useState("")
  const [volumeNumber, setVolumeNumber] = useState("")
  const [archive, setArchive] = useState(null)

  const [drag, setDrag] = useState(false)

  const inputRef = useRef()

  const [loading, setLoading] = useState(false)

  const closeResetMenu = () => {
    setVisibility(false)
  }
  
  useEffect(() => {
    setMode(localStorage.getItem("mode"))
  }, [visibility])

  useEffect(() => {
    if(curChapter) {
      setChapterName(curChapter.name)
      setVolumeNumber(curChapter.volume_number)
      setChapterNumber(curChapter.chapter_number)
    }
  }, [curChapter])

  const changeImg = e => {
    e.preventDefault()
    let file = inputRef.current.files[0]
    setImageArchve(file)
  }

  const handleStartDrag = e => {
    e.preventDefault()
    setDrag(true)
  }

  const handleLeaveDrag = e => {
    e.preventDefault()
    setDrag(false)
  }

  const handleDrop = e => {
    e.preventDefault()
    let file = e.dataTransfer.files[0]
    setImageArchve(file)
  }

  const setImageArchve = (file) => {
    setDrag(false)
    if(file.type !== 'application/x-zip-compressed') {
      dispatch(changeNotifications({type:'error', title:'Неподдерживаемый тип файла', text: 'Разрешены только архивы формата zip'}))
      return
    }
    setArchive(file)
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    setLoading(true)

    const url = `/titles/chapter/update/${curChapter.id}/`

    let data = new FormData()

    data.append('name', chapterName)
    data.append('volume_number', volumeNumber)
    data.append('chapter_number', chapterNumber)
    if(archive)
      data.append('image_archive', archive)

    try {
      await api.put(url, data)

      setArchive(null)

      let curChapterIndex = chapters[curTeam].findIndex(element => element.id === curChapter.id)

      let newChaptersArray = [...chapters[curTeam]]

      newChaptersArray[curChapterIndex].name = chapterName
      newChaptersArray[curChapterIndex].volume_number = +volumeNumber
      newChaptersArray[curChapterIndex].chapter_number = +chapterNumber

      let newChaptersObj = {
        ...chapters,
        [curTeam]: [...newChaptersArray]
      }

      setChapters(newChaptersObj)

      dispatch(changeNotifications({type:'success', title:'Успех', text:'Глава была успешно изменена'}))
    }
    catch(err) {
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:'Ошибка изменения главы', text:'Авторизируйтесь для изменения главы'}))
      else
        dispatch(changeNotifications({type:'error', title:'Ошибка изменения главы', text: err.response.data.details || err.response.data.name}))
    }

    setLoading(false)

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
            <h2 className="signInHeader">Редактировать главу</h2>
          </div>

          <form className="chapter-upload__form" onSubmit={e => onSubmitHandler(e)}>
            <RangeInput 
              requiredField={true}
              name='Название' 
              value={chapterName}
              onChange={e => setChapterName(e.target.value)}
            >Название</RangeInput >

            <div className="chapter-upload__chapter-number">
              <div className="chapter-upload__chapter-number-block">
                <RangeInput 
                  requiredField={true}
                  name='Номер тома' 
                  value={volumeNumber}
                  onChange={e => setVolumeNumber(!isNaN(e.target.value) &&  e.target.value[e.target.value.length - 1] !== '.' ? e.target.value : volumeNumber)}
                >Номер тома</RangeInput >
              </div>

              <div className="chapter-upload__chapter-number-block">
                <RangeInput 
                  requiredField={true}
                  name='Номер главы' 
                  value={chapterNumber}
                  onChange={e => setChapterNumber(!isNaN(e.target.value) ? e.target.value : chapterNumber)}
                >Номер главы</RangeInput >
              </div>
            </div>

            <div className="chapter-upload__chapter-settings">
              <div className="chapter-upload__drag-and-drop-block">
                <label 
                  className="user-settings__drag-and-drop-label default-text"
                  onDragStart={e => handleStartDrag(e)}
                  onDragOver={e => handleStartDrag(e)}
                  onDragLeave={e => handleLeaveDrag(e)}
                  onDrop={e => handleDrop(e)}
                >
                  {drag ? "Отпустите файл" : "Перетащите сюда новый zip архив со страницами главы"}
                  <input ref={inputRef} hidden type='file' onChange={e => changeImg(e)}/>
                </label>
              </div>
              {
                archive ?
                  <p className="default-text mt-2">Загружено: {archive.name}</p>
                  : null
              }
            </div>

            <Button loading={loading}>Изменить</Button>
          </form>
        </div>
      </div>
    )
  else
    return null
  
}
