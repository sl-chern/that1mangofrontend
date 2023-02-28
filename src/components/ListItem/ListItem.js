import React, {useState, useEffect, useRef} from 'react'
import { AiFillStar } from 'react-icons/ai'
import SelectLists from '../SelectLists/SelectLists'
import './style.css'
import { VscCircleLargeFilled } from 'react-icons/vsc'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAge } from '../Login/loginSlice'

export default function ListItem({userLists, name, poster, slug, title_type, total_rating, user_rating, title_status, added, isOwner, id, item, changeLists, age_rating}) {

  const navigate = useNavigate()

  const userAge = useSelector(selectAge)

  const colors = {
    "1": "#CB3838",
    "2": "#CC4539",
    "3": "#CC5939",
    "4": "#CC7139",
    "5": "#CC8739",
    "6": "#CC8739",
    "7": "#CCC039",
    "8": "#B1CC39",
    "9": "#8CCC39",
    "10": "#52CC39",
  }

  const [statusColor, setStatusColor] = useState("")
  const [markColor, setMarkColor] = useState("")

  useEffect(() => {
    setMarkColor(colors[user_rating])
    switch(title_status.slug) {
      case 'Announcement':
        setStatusColor('#36AFC2')
        break
      case 'Ongoing':
        setStatusColor('#7336C2')
        break
      case 'Finished':
        setStatusColor('#36C23D')
        break
      case 'Suspended':
        setStatusColor('#C28136')
        break
      case 'Stopped':
        setStatusColor('#C23636')
        break
    }
  }, [slug])

  useEffect(() => {
    if(isOwner)
      ref.current.style.paddingRight = "24%"
    else
      ref.current.style.paddingRight = "2%"
  }, [isOwner])

  const ref = useRef()

  return (
    <div className="user-list-item-container">
      <a href={`/title/${slug}`} className="w-full">
        <div className="user-list-item" ref={ref}>
          <div className="user-list-item__main-info">
            <div className="user-list-item__status group">
              <VscCircleLargeFilled color={statusColor} size="20px"/>
              <div className="tip z-20">{title_status.name}</div>
              <div className="tipArrow z-10"></div>
            </div>
            <div className="user-list-item__poster-block">
              <img style={age_rating === "M" && userAge < 18 ? {"filter": "blur(4px)"} : {}} src={poster} alt={name} className="user-list-item__poster"/>
            </div>
            <div className="user-list-item__name-block">
              <p className="user-list-item__name default-text">{name}</p>
              <div className="user-list-item__name-dark-effect"></div>
            </div>
          </div>
          
          <p className="user-list-item__type">{title_type.name}</p>
          <p className="user-list-item__date">{`${new Date(added).toLocaleString('ru-RU').slice(0, 10)}`}</p>
          
            {user_rating === null || user_rating === 0 ?
              <div className="user-list-item__mark-block"></div>:
              <div className="user-list-item__mark-block">
                <div>
                  <AiFillStar color={markColor} size="30px"/>
                </div>
                <p className="user-list-item__mark">{parseFloat(user_rating)}</p>
              </div>
            }
          
          <div className="user-list-item__mark-block">
            <div>
              <AiFillStar className="icon" size="30px"/>
            </div>
            <p className="user-list-item__mark">{parseFloat(total_rating).toFixed(2)}</p>
          </div>
        </div>
      </a>
      {isOwner ?
        <div className="user-list-item__select-container">
          <SelectLists
            userLists={[{name: 'Списки', nothing: true}, ...userLists]}
            id={id} 
            item={item}
            changeLists={changeLists}
          />
        </div>
        : null
      }
    </div>
  )
}
