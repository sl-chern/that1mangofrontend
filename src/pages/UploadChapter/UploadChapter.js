import React, { useState, useEffect, useRef } from 'react'
import { IconContext } from 'react-icons/lib'
import { RiCloseLine } from 'react-icons/ri'
import useSelectTheme from '../../hooks/useSecteTheme'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { selectTheme } from '../../components/Header/themeSlice'
import './style.css'
import api from '../../services/api'
import RangeInput from '../../components/RangeInput/RangeInput'
import { changeNotifications } from '../../components/Notifications/notificationsSlice'
import Button from '../../components/Button/Button'

export default function UploadChapter({visibility, setVisibility, titleId, teams}) {
  const dispatch = useDispatch()

  const [mode, setMode] = useState()
  const [options, setOptions] = useState([])
  const [selectValue, setSelectValue] = useState()

  const [chapterName, setChapterName] = useState("")
  const [chapterNumber, setChapterNumber] = useState("")
  const [volumeNumber, setVolumeNumber] = useState("")
  const [archive, setArchive] = useState(null)

  const [drag, setDrag] = useState(false)

  const darkMode = useSelector(selectTheme)

  const styles = useSelectTheme(darkMode, '100%')

  const inputRef = useRef()

  const [loading, setLoading] = useState(false)

  const closeResetMenu = () => {
    setVisibility(false)
  }
  
  useEffect(() => {
    setMode(localStorage.getItem("mode"))

    let optionsArray = []

    teams.forEach(element => optionsArray.push({value: element.id, label: element.name}))

    setOptions(optionsArray)

    if(visibility === false) {
      setArchive(null)
      setChapterName("")
      setVolumeNumber("")
      setChapterNumber("")
      setSelectValue(null)
    }
  }, [visibility])

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

    if(!selectValue) {
      dispatch(changeNotifications({type:'error', title:'Ошибка', text: 'Выберите команду'}))
      return
    }

    if(!archive) {
      dispatch(changeNotifications({type:'error', title:'Ошибка', text: 'Загрузите архив'}))
      return
    }

    setLoading(true)

    const url = `/titles/chapter/upload/`

    let data = new FormData()

    data.append('title', titleId)
    data.append('team', selectValue.value)
    data.append('name', chapterName)
    data.append('volume_number', volumeNumber)
    data.append('chapter_number', chapterNumber)
    data.append('image_archive', archive)

    try {
      await api.post(url, data)

      setArchive(null)
      setChapterName("")
      setVolumeNumber("")
      setChapterNumber("")

      dispatch(changeNotifications({type:'success', title:'Успех', text:'Мы вас уведомим когда глава будет загружена'}))
    }
    catch(err) {
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:'Ошибка добавления главы', text:'Авторизируйтесь для добавления главы'}))
      else
        dispatch(changeNotifications({type:'error', title:'Ошибка добавления главы', text: Object.entries(err.response.data).map(([key, value]) => value)}))
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
            <h2 className="signInHeader">Добавить главу</h2>
          </div>

          <form className="chapter-upload__form" onSubmit={e => onSubmitHandler(e)}>
            <Select 
              value={selectValue}
              onChange={e => setSelectValue(e)}
              styles={styles}
              options={options}
              isOptionDisabled={option => option.disabled}
              isSearchable={false}
            />

            <RangeInput 
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
                  {drag ? "Отпустите файл" : "Перетащите сюда zip архив со страницами главы"}
                  <input ref={inputRef} hidden type='file' onChange={e => changeImg(e)}/>
                </label>
              </div>
              {
                archive ?
                  <p className="default-text mt-2">Загружено: {archive.name}</p>
                  : null
              }
            </div>

            <Button loading={loading}>Загрузить</Button>
          </form>
        </div>
      </div>
    )
  else
    return null
  
}
