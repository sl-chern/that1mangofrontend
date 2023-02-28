import React, { useState, useRef, useEffect } from 'react'
import './style.css'
import { RiCloseLine } from 'react-icons/ri'
import { IconContext } from 'react-icons'
import Search from '../Search/Search'
import { useLocation } from 'react-router-dom'

export default function SearchWindow({visibility, setVisibility}) {

  const [mode, setMode] = useState()
  const [searchType, setSearchType] = useState("")

  const loacation = useLocation()

  const closeResetMenu = () => {
    setVisibility(false)
  }

  useEffect(() => {
    setMode(localStorage.getItem("mode"))
  }, [visibility])

  useEffect(() => {
    setVisibility(false)
  }, [loacation.pathname])
  
  if(visibility)
    return (
      <div className="searchSpace">
        <div className="loginBackground" onClick={() => closeResetMenu()}></div>

        <div className="searchContent">
          <div className="closeButtonBlock">
            <div className="closeButton" onClick={() => closeResetMenu()}>
              <IconContext.Provider value={mode === 'true' ?{ color: 'white', size: '20px' }:{ color: 'black', size: '20px' }}>
                <RiCloseLine/>
              </IconContext.Provider>
            </div>
          </div>

          <div className="signInHeaderBlock">
            <h2 className="signInHeader">Поиск</h2>
          </div>

          <Search typesArray={["Тайтл", "Персона", "Издатель", "Команда", "Пользователь"]}/>
          
        </div>
      </div>
    )
  else
    return null
}
