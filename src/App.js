import React, { useEffect } from 'react'
import './App.css';
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import RickRoll from './components/RickRoll/RickRoll'
import {Routes, Route} from 'react-router-dom'
import useDarkMode from './hooks/useDarkMode'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { change, changeId, changeIsStaff, changeUser, changeEmail, changePict, changeAge } from './components/Login/loginSlice'
import Activation from './pages/Activation/Activation'
import Reset from './pages/Reset/Reset'
import Manga from './pages/Manga/Manga'
import Notifications from './components/Notifications/Notifications'
import Catalog from './pages/Catalog/Catalog'
import Team from './pages/Team/Team'
import Person from './pages/Person/Person'
import User from './pages/User/User'
import Home from './pages/Home/Home'
import NotificationsPage from './pages/NotificationsPage/NotificationsPage'
import Chapter from './pages/Chapter/Chapter'
import DefaultPage from './components/DefaultPage/DefaultPage';

function App() {
  
  axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL
  axios.defaults.headers.post['Content-Type'] = 'application/json'

  const dispatch = useDispatch()

  const [mode, setMode] = useDarkMode()

  useEffect(() => {
    const access = localStorage.getItem("access")
    const refresh = localStorage.getItem("refresh")

    if(access !== null) {

      const urlVerify = '/users/token/verify/'
      const urlRefresh = '/users/token/refresh/'

      const dataVerify = {
        token: access
      }

      axios.post(urlVerify, dataVerify)
      .then(() => {
        let info = jwtDecode(access)
        dispatch(change(info.username))
        dispatch(changeId(info.user_id))
        dispatch(changeIsStaff(info.is_superuser))
      })
      .catch(() => {
        const dataRefresh = {
          refresh: refresh
        }

        axios.post(urlRefresh, dataRefresh)
        .then((res) => {
          localStorage.setItem("access", res.data.access)
          localStorage.setItem("refresh", res.data.refresh)

          let info = jwtDecode(res.data.access)

          dispatch(change(info.username))
          dispatch(changeId(info.user_id))
          dispatch(changeIsStaff(info.is_superuser))
        })
        .catch(() => {
          localStorage.removeItem("access")
          localStorage.removeItem("refresh")

          dispatch(change(""))
          dispatch(changeId(null))
          dispatch(changeIsStaff(false))
          dispatch(changeEmail(""))
          dispatch(changeUser(null))
          dispatch(changePict(null))
          dispatch(changeAge(0))
        })
      })
    }
    else {
      dispatch(changeId(null))
    }

    if(localStorage.getItem("mode") === null) {
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
  }, [])

  return (
    <Routes>
      <Route exact path='/' element={
        <DefaultPage>
          <Home />
        </DefaultPage>
      }/>

      <Route path='/register/verify' element={
        <DefaultPage>
          <Activation />
        </DefaultPage>
      }/>
      <Route path='/password-reset' element={
        <DefaultPage>
          <Reset />
        </DefaultPage>
      }/>

      <Route path='/title/:slug' element={
        <DefaultPage>
          <Manga />
        </DefaultPage>
      }/>

      <Route path='/title/:slug/:team/:volume/:number' element={<Chapter />}/>

      <Route path='/catalog' element={
        <DefaultPage>
          <Catalog />
        </DefaultPage>
      }/>

      <Route path='/team/:slug' element={
        <DefaultPage>
          <Team />
        </DefaultPage>
      }/>

      <Route path='/publisher/:slug' element={
        <DefaultPage>
          <Person type={"publisher"}/>
        </DefaultPage>
      }/>

      <Route path='/person/:id' element={
        <DefaultPage>
          <Person type={"person"}/>
        </DefaultPage>
      }/>

      <Route path='/user/:username' element={
        <DefaultPage>
          <User type={"person"}/>
          </DefaultPage>
      }/>

      <Route path='/notifications' element={
        <DefaultPage>
          <NotificationsPage/>
        </DefaultPage>
      }/>
    </Routes>
  );
}

export default App;
