import React, { useState, useEffect } from 'react'
import './style.css'
import Search from '../Search/Search'
import { IconContext } from 'react-icons'
import { RiCloseLine } from 'react-icons/ri'

export default function AddParticipant({visibility, setVisibility, reqData}) {

  const [mode, setMode] = useState()

  const closeResetMenu = () => {
    setVisibility(false)
  }
  
  useEffect(() => {
    setMode(localStorage.getItem("mode"))
  }, [visibility])

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
            <h2 className="signInHeader">Добавить участника</h2>
          </div>

          <Search 
            type='Пользователь'
            searchType={`request`}
            reqData={reqData}
          />
        </div>
      </div>
    )
  else
    return null
}
