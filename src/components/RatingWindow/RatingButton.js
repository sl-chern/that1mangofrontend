import React, {useEffect, useState} from 'react'
import { AiFillStar } from 'react-icons/ai'
import api from '../../services/api'
import { useDispatch, useSelector } from 'react-redux'
import { changeNotifications } from '../Notifications/notificationsSlice'
import { change, changeEmail, changeId, changeUser, changeIsStaff, selectId } from '../Login/loginSlice'

export default function RatingButton({mark, curMark, setMark, id, setMarksAmount, setRating, setMarks, titleRating, setAllMarks, setTitleRating}) {

  const usid = useSelector(selectId)

  const dispatch = useDispatch()

  let colors = {
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

  const logout = () => {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")

    dispatch(change(""))
    dispatch(changeId(null))
    dispatch(changeIsStaff(false))
    dispatch(changeEmail(""))
    dispatch(changeUser(null))
  }

  useEffect(() => {
    if(+Object.keys(mark)[0] === curMark) {
      setStyleList("rateButton activeRateBut")
    }
    else {
      setStyleList("rateButton")
    }
  }, [mark, curMark])

  const [styleList, setStyleList] = useState("rateButton")

  const handleClick = async () => {

    if(usid === null || usid === -1) {
      dispatch(changeNotifications({type:'error', title:'Ошибка оценивания', text: "Авторизируйтесь для проставления оценок"}))
      return
    }

    if(+Object.keys(mark)[0] === curMark) {
      const urlDelete = '/titles/title/delete-rate/'
      const data = {
        title: id
      }

      try {
        dispatch(changeNotifications({type:'success', title:'Оценивание', text: "Ваш голос был удален"}))
        setMark(null)

        const newRatingIndex = titleRating.findIndex(element => element.rating.mark === curMark)

        let newRatingArr = [
          ...titleRating,
        ]

        newRatingArr[newRatingIndex].amount--

        setAllMarks(setMarksAmount, setRating, setMarks, setTitleRating, newRatingArr)

        await api.delete(urlDelete, {
          data: JSON.stringify(data)
        })
      }
      catch(err) {
        if(err.response.status !== 401) {
          dispatch(changeNotifications({type:'error', title:'Ошибка оценивания', text: "Ваш голос не был удален"}))
        }
        else {
          dispatch(changeNotifications({type:'error', title:'Ошибка оценивания', text: "Авторизируйтесь для проставления оценок"}))
          logout()
        }
      }
    }
    else {
      const urlRate = '/titles/title/rate/'
      const data = {
        title: id,
        rating: Object.keys(mark)[0]
      }

      try {
        const newRatingIndexOld = titleRating.findIndex(element => element.rating.mark === curMark)
        let newRatingIndexNew = titleRating.findIndex(element => element.rating.mark === +Object.keys(mark)[0])
        
        setMark(+Object.keys(mark)[0])

        let newRatingArr = [
          ...titleRating,
        ]

        console.log(newRatingArr, newRatingIndexNew, +Object.keys(mark)[0], curMark)
        
        if(newRatingIndexNew === -1) {
          newRatingArr.push({
            amount: 0,
            rating: {
              mark: +Object.keys(mark)[0]
            }
          })
        } 

        newRatingIndexNew = newRatingArr.findIndex(element => element.rating.mark === +Object.keys(mark)[0])

        console.log(newRatingArr, newRatingIndexNew, +Object.keys(mark)[0], curMark)

        if(curMark)
          newRatingArr[newRatingIndexOld].amount--
        newRatingArr[newRatingIndexNew].amount++

        setAllMarks(setMarksAmount, setRating, setMarks, setTitleRating, newRatingArr)

        await api.post(urlRate, JSON.stringify(data))

        dispatch(changeNotifications({type:'success', title:'Оценивание', text: "Ваш голос был засчитан"}))
      }
      catch(err) {
        console.log(err)
        if(!err.response.data.refresh) {
          dispatch(changeNotifications({type:'error', title:'Ошибка оценивания', text: "Ваш голос не был засчитан"}))
        }
        else {
          dispatch(changeNotifications({type:'error', title:'Ошибка оценивания', text: "Авторизируйтесь для проставления оценок"}))
          logout()
        }
      }
    }
  }

  return (
    <div className={styleList} onClick={() => handleClick()}>
      <div className="ratingButtonRating">
        <AiFillStar color={colors[Object.keys(mark)[0]]} size={"16px"}/>
        <p>{Object.keys(mark)[0]}</p>
      </div>
      <div className="markTextBlock">
        <p className="markText">{mark[Object.keys(mark)[0]]}</p>
      </div>
    </div>
  )
}
