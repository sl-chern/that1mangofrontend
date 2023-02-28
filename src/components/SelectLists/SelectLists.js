import React, { useEffect, useState, useRef } from 'react'
import './style.css'
import { TbTriangleInverted } from 'react-icons/tb'
import UserLists from './UserLists'
import { useLocation } from 'react-router-dom'

export default function SelectLists({userLists, id, changeLists, item}) {

  const [visibility, setVisibility] = useState(false)

  const location = useLocation()

  const [isChangedAdd, setIsChangedAdd] = useState([])
  const [isChangedRemove, setIsChangedRemove] = useState([])

  const isChangedAddRef = useRef([]), isChangedRemoveRef = useRef([])

  useEffect(() => {
    return () => {
      setVisibility(false)
      if((isChangedAddRef.current.length !== 0 || isChangedRemoveRef.current.length !== 0) && changeLists !== null)
        changeLists(isChangedAddRef.current, isChangedRemoveRef.current)
    }
  }, [])

  useEffect(() => {
    isChangedAddRef.current = isChangedAdd
    isChangedRemoveRef.current = isChangedRemove
  }, [isChangedAdd, isChangedRemove])

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return() => document.removeEventListener('click', handleClick)
  }, [location.pathname, isChangedAdd, isChangedRemove])

  const handleClick = (e) => {
    if(!select.current.contains(e.target))
      if(!items.current.contains(e.target)) {
        setVisibility(false)
        if((isChangedAdd.length !== 0 || isChangedRemove.length !== 0) && changeLists !== null)
          changeLists(isChangedAdd, isChangedRemove)
      }
  }

  useEffect(() => {
    if(visibility) {
      const bot = items.current.getBoundingClientRect().top - window.innerHeight + 220
      if(bot > 0)
        items.current.style.marginTop = `-${bot}px`
    }
    else {
      setIsChangedAdd([])
      setIsChangedRemove([])
    }
  }, [visibility])

  const select = useRef(null)
  const items = useRef(null)

  return (
    <div className="selectListContainer">
      <div className="listSelect" onClick={() => setVisibility(true)} ref={select}>
        <div className="selectTextContainer">
          <p>{userLists[0].name}</p>
          <div className="selectDarkEffect hidden"></div>
        </div>
        <div className="selectIcon">
          <TbTriangleInverted className="icon" size={"20px"}/>
        </div>
      </div>
      <UserLists 
        visibility={visibility} 
        titleId={id} 
        list={userLists}
        itemRef={items}
        setIsChangedAdd={setIsChangedAdd}
        isChangedAdd={isChangedAdd}
        setIsChangedRemove={setIsChangedRemove}
        isChangedRemove={isChangedRemove}
        mangaItem={item}
      />
    </div>
  )
}
