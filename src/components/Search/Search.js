import React, { useState, useRef, useEffect } from 'react'
import SearchType from '../SearchType/SearchType'
import './style.css'
import api from '../../services/api'
import { useDispatch, useSelector } from 'react-redux'
import { selectTheme } from '../Header/themeSlice'
import { Oval } from 'react-loader-spinner'
import SearchResultItem from '../SearchResultItem/SearchResultItem'
import { useNavigate } from 'react-router-dom'
import Button from '../Button/Button'
import { changeNotifications } from '../Notifications/notificationsSlice'

export default function Search({typesArray, type, searchType, reqData}) {

  const [curType, setCurType] = useState(type ?? typesArray[0])
  const [searchText, setSearchText] = useState("")
  const [searchData, setSearchData] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [dirty, setDirty] = useState(false)
  const [loadingButton, setLoadingButton] = useState(false)

  const darkTheme = useSelector(selectTheme)

  const timer = useRef()
  const nextUrl = useRef()

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const onChangeHandler = e => {
    clearInterval(timer.current)
    setSearchText(e.target.value)

    if(e.target.value.length < 2) {
      setDirty(false)
      setSearchData([])
      return
    }

    timer.current = setInterval(() => {
      fetchData(e.target.value)
      clearInterval(timer.current)
    }, 1000)
  }

  useEffect(() => {
    nextUrl.current = null
    if(searchText.length > 1)
      fetchData(searchText)
  }, [curType])

  const fetchData = async (searchDat) => {

    setDirty(true)
    setLoadingData(true)

    let url

    switch(curType) {
      case "Тайтл":
        url = `/titles/title/search/${searchDat}/`
        break  
      case "Персона": 
        url = `/titles/person/search/${searchDat}/`
        break
      case "Издатель":
        url = `/titles/publisher/search/${searchDat}/`
        break
      case "Команда":
        url = `/titles/team/search/${searchDat}/`
        break
      case "Пользователь":
        url = `/users/user/search/${searchDat}/`
        break
    }

    const res = await api.get(url)

    nextUrl.current = res.data.next

    setSearchData(res.data.results)

    setLoadingData(false)

  }

  const fetchPagData = async () => {
    setLoadingButton(true)
    try {
      const res = await api.get(nextUrl.current)
      setSearchData([...searchData, ...res.data.results])
      nextUrl.current = res.data.next
    }
    catch(err) {

    }
    setLoadingButton(false)
  }

  const onClickHandler = async (path, type, data) => {
    if(type === 'redirect')
      navigate(path)

    if(type === 'request') {
      const inviteData = {
        ...data,
        team: reqData.team
      }
      try {
        await api.post(path, JSON.stringify(inviteData))
        dispatch(changeNotifications({type:'success', title:`Успех`, text:`Приглашение в команду было отпралено`}))
      }
      catch(err) {
        if(err.response.data.refresh)
          dispatch(changeNotifications({type:'error', title:`Ошибка добавления участника`, text:`Авторизируйтесь для добавления участника`}))
        else
          dispatch(changeNotifications({type:'error', title:`Ошибка добавления участника`, text: Object.entries(err.response.data).map(([key, value]) => value)}))
      }
    }
  }

  return (
    <div className="search-block"> 
      {
        typesArray ?
          <div className="search-block__search-types">
            {
              typesArray.map((item, index) => 
                <SearchType
                  type={item}
                  curType={curType}
                  setCurType={setCurType}
                  key={`searchType${index}`}
                />
              )
            }
          </div>
          : null

      }

      <div className="formGroup">
        <input 
          className="formInput group" 
          placeholder=" "
          value={searchText}
          onChange={e => onChangeHandler(e)}
        />
        <label className="formLabel">{curType === 'Тайтл' || curType === 'Команда' ? "Введите название" : "Введите имя"}</label>
      </div>

      {
        dirty ?
          loadingData ?

            <div className="spinnerBlock">
              <Oval color={darkTheme ? "white" : "black"} secondaryColor={darkTheme ? "white" : "black"} height="50px" width="50px"/>
            </div>

            :

            <div className="search-block__search-result">
              
              {
                searchData.length > 0 ?

                  searchData.map((item, index) => {

                    let propsData
                    
                    switch(curType) {
                      case "Тайтл":
                        propsData = {
                          name: item.name,
                          rating: item.total_rating,
                          type: item.title_type,
                          picture: item.poster,
                          onClick: () => onClickHandler(`/title/${item.slug}`, 'redirect')
                        }
                        break  
                      case "Персона": 
                        propsData = {
                          name: item.name,
                          picture: item.picture,
                          onClick: () => onClickHandler(`/person/${item.id}`, 'redirect')
                        }
                        break  
                      case "Издатель":
                        propsData = {
                          name: item.name,
                          picture: item.picture,
                          onClick: () => onClickHandler(`/publisher/${item.slug}`, 'redirect')
                        }
                        break  
                      case "Команда":
                        propsData = {
                          name: item.name,
                          picture: item.picture,
                          onClick: () => onClickHandler(`/team/${item.slug}`, 'redirect')
                        }
                        break
                      case "Пользователь":
                        propsData = {
                          name: item.username,
                          picture: item.profile_pic,
                          onClick: () => onClickHandler(searchType ? `/titles/team/invite/` : `/user/${item.username}`, searchType ?? 'redirect', {user: item.id})
                        }
                        break
                    }

                    return (
                      <SearchResultItem
                        key={`searchResultItem${index}`}
                        {...propsData}
                      />
                    )
                  })

                  :

                  <p className="search-block__search-result-text">Ничего не найдено</p>
              }

              {
                nextUrl.current ?
                  <Button loading={loadingButton} onClick={() => fetchPagData()}>Загрузить еще</Button>
                  : null
              }

            </div>

          : null
      }
      
    </div>
  )
}
