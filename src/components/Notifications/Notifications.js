import React, {useEffect, useState, useRef} from 'react'
import './style.css'
import { selectNotifications } from './notificationsSlice'
import { useSelector, useDispatch } from 'react-redux'
import Notification from './Notification'
import { deleteNotifications } from './notificationsSlice'

export default function Notifications() {

  const not = useSelector(selectNotifications)

  const dispatch = useDispatch()

  const [notifications, setNotifications] = useState([])

  const timer = useRef({
    time: 0,
    interval:null
  })

  useEffect(() => {
    if(not.length > notifications.length) {
      let first = {
        ...not[0],
        time: 4500
      }
      let arr = []
      notifications.forEach(e => {
        arr.push({...e})
      })
      if(timer.current.interval !== null) {
        timer.current.time *= 50
        arr.forEach(e => {
          e.time -= timer.current.time
        })
        clearInterval(timer.current.interval)
        timer.current.time = 0
        timer.current.interval = setInterval(() => timer.current.time++, 50)
      }
      else {
        timer.current.interval = setInterval(() => timer.current.time++, 50)
      }
      setNotifications([first, ...arr])
    }
  }, [not])

  const deleteNot = (index) => {
    let arr = [...notifications]

    arr.splice(index, 1)

    timer.current.time *= 50

    let arr2 = []

    arr.forEach(e => {
      arr2.push({
        ...e,
        time: e.time - timer.current.time
      })
    })
    clearInterval(timer.current.interval)
    timer.current.time = 0
    timer.current.interval = setInterval(() => timer.current.time++, 50)

    setNotifications(arr2)
    dispatch(deleteNotifications(arr2))
  }

  return (
    <div className="notificationsBlock">
      {notifications.map((item, index) => 
        <Notification 
          title={item.title} 
          text={item.text} 
          type={item.type} 
          key={`notification${index}`} 
          index={index} 
          deleteNot={deleteNot}
          time={item.time}
          length={notifications.length}
        />
      )}
    </div>
  )
}
