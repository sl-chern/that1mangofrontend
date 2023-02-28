import React, { useEffect, useState } from 'react'
import SelectListItem from './SelectListItem'
import { useSelector } from 'react-redux'
import { selectId } from '../Login/loginSlice'
import api from '../../services/api'
import { useLocation } from 'react-router-dom'
import { selectTheme } from '../Header/themeSlice'
import { Oval } from 'react-loader-spinner'

export default function UserLists({visibility, list, titleId, itemRef, setIsChangedAdd, setIsChangedRemove, mangaItem, isChangedAdd, isChangedRemove}) {

  const location = useLocation()

  const id = useSelector(selectId)

  const [inLists, setInLists] = useState([])
  const [loading, setLoading] = useState(true)

  const darkTheme = useSelector(selectTheme)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const url = `/social/lists/title-in-user-lists/${id}/${titleId}/`

      try {
        const res = await api.get(url)
        setInLists(res.data.in_user_lists)
        setLoading(false)
      }
      catch(err) {
        setLoading(false)
      }
    }

    if(id !== null && visibility && inLists.length === 0)
      fetchData()

  }, [location.pathname, visibility, id])

  if(visibility)
    return (
      <div className="userLists" ref={itemRef}>
        {list.length === 1 ?
          <div className="userLists__empty-block">
            <p className="userLists__empty-text default-text">У вас нет списков, вы можете создать их в личном кабинете</p>
          </div>
        : !loading ?
          list.map((item, index) => 
            <SelectListItem 
              key={`listItem${index}`} 
              item={item} inLists={inLists} 
              id={titleId} 
              setInLists={setInLists} 
              mangaItem={mangaItem}
              setIsChangedAdd={setIsChangedAdd}
              isChangedAdd={isChangedAdd}
              setIsChangedRemove={setIsChangedRemove}
              isChangedRemove={isChangedRemove}
            />)
          :
          <div className="spinnerBlock mt-6">
            <Oval color={darkTheme ? "white" : "black"} secondaryColor={darkTheme ? "white" : "black"} height="50px" width="50px"/>
          </div>
        }
      </div>
    )
  else
    return null
}



