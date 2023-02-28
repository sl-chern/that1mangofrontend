import React, { useEffect, useState } from 'react'
import { BsBookmarksFill, BsBookmarks } from 'react-icons/bs'
import api from '../../services/api'
import { useDispatch } from 'react-redux'
import { changeNotifications } from '../Notifications/notificationsSlice'

export default function SelectListItem({item, inLists, id, setInLists, setIsChangedAdd, setIsChangedRemove, mangaItem, isChangedAdd, isChangedRemove}) {

  const [icon, setIcon] = useState(null)
  const [inList, setInList] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    if(!item.nothing) {
      const index = inLists.findIndex(element => element === item.id)
      if(index !== -1) {
        setInList(true)
        setIcon(<BsBookmarksFill className="icon" size="20px"/>)
      }
      else {
        setInList(false)
        setIcon(<BsBookmarks className="icon" size="20px"/>)
      }
    }
    else {
      setIcon(null)
      setInList(null)
    }
  }, [item, inLists])

  const onClickHandler = async () => {
    if(inList !== null) {
      if(!inList) {
        const urlAdd = `/social/create-list-title/`
    
        const data = {
          list: item.id,
          title: id
        }

        setInLists([...inLists, item.id])

        try {
          setIsChangedAdd([...isChangedAdd, {item: mangaItem, list: item.id}])
          await api.post(urlAdd, JSON.stringify(data))
          //dispatch(changeNotifications({type:'success', title:'Добавление тайтла в список', text:`Тайтл был успешно добавлен в список: '${item.name}'`}))
        }
        catch (err) {
          if(err.response.data.refresh)
            dispatch(changeNotifications({type:'error', title:'Ошибка добавления тайтла в список', text:'Авторизируйтесь для добавления тайтла в список'}))
          //else
            //dispatch(changeNotifications({type:'error', title:'Ошибка добавления тайтла в список', text: Object.entries(err.response.data).map(([key, value]) => value)}))
        }
      }
      else {
        const urlDelete = `/social/list-title/${item.id}/${id}/`

        setInLists([...inLists].filter(element => element !== item.id))
        
        try {
          setIsChangedRemove([...isChangedRemove, {item: mangaItem, list: item.id}])
          await api.delete(urlDelete)
          //dispatch(changeNotifications({type:'success', title:'Удаление тайтла из списка', text:`Тайтл был успешно удален из списка: '${item.name}'`}))
        }
        catch (err) {
          if(err.response.data.refresh)
            dispatch(changeNotifications({type:'error', title:'Ошибка удаления тайтла из списка', text:'Авторизируйтесь для удаления тайтла из списка'}))
          //else
            //dispatch(changeNotifications({type:'error', title:'Ошибка удаления тайтла из списка', text: Object.entries(err.response.data).map(([key, value]) => value)}))
        }
      }
    }
  }

  return (
    <div className="listItem"  onClick={() => onClickHandler(item)}>
      <div>
        {icon}
      </div>
      <p className="listName default-text">{item.name}</p>
    </div>
  )
}
