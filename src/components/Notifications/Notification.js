import React, { useState, useEffect, memo } from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import { BiErrorAlt } from 'react-icons/bi'
import { BsFillCheckCircleFill } from 'react-icons/bs'

const Notification = memo(({text, type, title, index, deleteNot, time, length}) => {

  const [classList, setClassList] = useState("notification")
  const [titleClassList, setTitleClassList] = useState("notificationTitle")
  const [icon, setIcon] = useState(null)

  useEffect(() => {
    switch(type) {
      case 'error': 
        setClassList("notification errorNot")
        setTitleClassList("notificationTitle erTitle")
        setIcon(<BiErrorAlt color="#9D3829" size={"31px"}/>)
        break
      case 'success': 
        setClassList("notification successNot")
        setTitleClassList("notificationTitle scsTitle")
        setIcon(<BsFillCheckCircleFill color="#299d2b" size={"31px"}/>)
        break
    }

    let interval

    if(index === length - 1) {
      interval = setInterval(() => {
         setClassList(classList + " animationOp")
         clearInterval(interval)
      }, time-200)
    }

    const intervalId = setInterval(() => {
      deleteNot(index)
    }, time)
    
    return () => {
      clearInterval(intervalId)
      clearInterval(interval)
    }
  }, [text, type, title, index, deleteNot])

  return (
    <div className={classList}>
      <div className="notificationContentBlock">
        <div>{icon}</div>
        <div className="notificationTextBlock">
          <p className={titleClassList}>{title}</p>
          <p className="notificationText">{text}</p>
        </div>
      </div>
      <div className="closeNotificationButton" onClick={() => deleteNot(index)}>
        <IoCloseSharp color={type === 'error' ? "#9D3829" : "#299d2b"} size={"21px"}/>
      </div>
    </div>
  )
})

export default Notification