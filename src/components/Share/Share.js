import React, { useState, useEffect } from 'react'
import './style.css'
import { IconContext } from 'react-icons'
import { RiCloseLine } from 'react-icons/ri'
import {
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  ViberShareButton,
  WhatsappShareButton,
  FacebookShareButton,
} from 'react-share'
import { FaTelegramPlane, FaRedditAlien, FaFacebookF, FaViber, FaTwitter, FaWhatsapp } from 'react-icons/fa'

export default function Share({visibility, setVisibility, slug}) {

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
            <h2 className="signInHeader">Поделиться</h2>
          </div>

          <div className="share__share-buttons">
            <div className="share__telegram-share">
              <TelegramShareButton url={`${process.env.REACT_APP_CLIENT_URL}/title/${slug}`}>
                <FaTelegramPlane color="white" size={"30px"}/>
              </TelegramShareButton>
            </div>
            <div className="share__reddit-share">
              <RedditShareButton url={`${process.env.REACT_APP_CLIENT_URL}/title/${slug}`}>
                <FaRedditAlien color="white" size={"30px"}/>
              </RedditShareButton>
            </div>
            <div className="share__twitter-share">
              <TwitterShareButton url={`${process.env.REACT_APP_CLIENT_URL}/title/${slug}`}>
                <FaTwitter color="white" size={"30px"}/>
              </TwitterShareButton>
            </div>
            <div className="share__viber-share">
              <ViberShareButton url={`${process.env.REACT_APP_CLIENT_URL}/title/${slug}`}>
                <FaViber color="white" size={"30px"}/>
              </ViberShareButton>
            </div>
            <div className="share__whatsapp-share">
              <WhatsappShareButton url={`${process.env.REACT_APP_CLIENT_URL}/title/${slug}`}>
                <FaWhatsapp color="white" size={"30px"}/>
              </WhatsappShareButton>
            </div>
            <div className="share__facebook-share">
              <FacebookShareButton url={`${process.env.REACT_APP_CLIENT_URL}/title/${slug}`}>
                <FaFacebookF color="white" size={"30px"}/>
              </FacebookShareButton>
            </div>
          </div>
        </div>
      </div>
    )
  else
    return null
}
