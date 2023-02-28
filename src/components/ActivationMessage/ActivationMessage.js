import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { selectMes } from './messageSlice'
import { IconContext } from 'react-icons'
import { RiCloseLine } from 'react-icons/ri'
import { BsEnvelope } from 'react-icons/bs'
import './style.css'

export default function ActivationMessage(props) {

  const message = useSelector(selectMes)

  const [mode, setMode] = useState()

  useEffect(() => {
    setMode(localStorage.getItem("mode"))
  }, [props.visibility])

  if(props.visibility)
    return (
      <div className="loginSpace">
        <div className="loginBackground" onClick={() => props.setVisibility(false)}></div>

        <div className="loginContent">
          <div className="closeButtonBlock">
            <div className="closeButton" onClick={() => props.setVisibility(false)}>
              <IconContext.Provider value={mode === 'true' ?{ color: 'white', size: '20px' }:{ color: 'black', size: '20px' }}>
                <RiCloseLine/>
              </IconContext.Provider>
            </div>
          </div>

          <div className="messageContent">
            <div className="messageIcon">
              <IconContext.Provider value={mode === 'true' ?{ color: 'white', size: '55px' }:{ color: 'black', size: '55px' }}>
                <BsEnvelope/>
              </IconContext.Provider>
            </div>
            <div className="messageTextBlock">
              <p className="messageText">{message}</p>
            </div>
          </div>
        </div>

      </div>
    )
  else
    return null
}
