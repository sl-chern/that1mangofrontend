import React, {useState, useEffect} from 'react'
import useDarkMode from '../../hooks/useDarkMode'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { IconContext } from 'react-icons'
import {FiBook} from 'react-icons/fi'
import {GiDiceFire} from 'react-icons/gi'
import {HiOutlineSearch} from 'react-icons/hi'
import {RiQuestionMark} from 'react-icons/ri'
import {FaSun, FaBlind} from 'react-icons/fa'
import {BsMoonStarsFill} from 'react-icons/bs'

import NavItem from './NavItem'
import Login from '../Login/Login'
import SignUp from '../SignUp/SignUp'
import ActivationMessage from '../ActivationMessage/ActivationMessage'
import Authorazation from '../Authorization/Authorazation'
import ResetWindow from '../ResetWindow/ResetWindow'

import logoL from '../../Assets/logoL.png'
import logoD from '../../Assets/logoD.png'
import './style.css'
import SearchWindow from '../SearchWindow/SearchWindow'
import { useDispatch, useSelector } from 'react-redux'
import { changeTitleLoading, selectTitleLoading } from '../Title/titleSlice'

export default function Header() {
  const dispatch = useDispatch()

  const [mode, setMode] = useDarkMode()

  const navigate = useNavigate()

  const titleLoading = useSelector(selectTitleLoading)

  const [toggleStyle, setToggleStyle] = useState()
  const [loginVisibility, setLoginVisibility] = useState(false)
  const [signUpVisibility, setSignUpVisibility] = useState(false)
  const [actMesVisibility, setActMesVisibility] = useState(false)
  const [resetVisibility, setResetVisibility] = useState(false)
  const [searchVisibility, setSearchVisibility] = useState(false)

  const [randomLoading, setRandomLoading] = useState(false)

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

  const random = async () => {
    if(randomLoading || titleLoading)
      return

    setRandomLoading(true)

    const url = '/titles/random/'

    try {
      const res = await axios.get(url)
      navigate(`/title/${res.data.slug}`)
      setRandomLoading(false)
    }
    catch(err) {
      setRandomLoading(false)
    }
  }

  //<NavItem icon={<RiQuestionMark/>} text={"F.A.Q."}></NavItem>

  return (
    <header>
      <div className="header-content">
        <a href='/'>
          <div className="w-[300px] hover:cursor-pointer">
            <img src={mode ? logoD : logoL} alt="MANGO"/>
          </div>
        </a>

        <IconContext.Provider value={mode ?{ color: 'white', size: '24px' }:{ color: 'black', size: '24px' }}>
          <nav className="flex flex-row">
            <NavItem icon={<FiBook/>} text={"Каталог"} onClick={navigate} path={"/catalog"}></NavItem>
            <NavItem icon={<GiDiceFire/>} text={"Случайное"} onClick={random}></NavItem>
            <NavItem icon={<HiOutlineSearch/>} text={"Поиск"} onClick={() => setSearchVisibility(true)}></NavItem>
          </nav>
        </IconContext.Provider>
        

        <div className="flex flex-row items-center">
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
      
      <Login visibility={loginVisibility} setVisibility={setLoginVisibility} setSignUpVisibility={setSignUpVisibility} setResetVisibility={setResetVisibility}/>
      <SignUp visibility={signUpVisibility} setVisibility={setSignUpVisibility} setActMesVisibility={setActMesVisibility}/>
      <ActivationMessage visibility={actMesVisibility} setVisibility={setActMesVisibility}/>
      <ResetWindow visibility={resetVisibility} setVisibility={setResetVisibility} setActMesVisibility={setActMesVisibility}/>
      
      <SearchWindow visibility={searchVisibility} setVisibility={setSearchVisibility}/>
    </header>
  )
}
