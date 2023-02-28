import React, { useState, useEffect, useRef } from 'react'
import './style.css'
import TabTitle from './TabTitle'
import Button from '../Button/Button'
import api from '../../services/api'
import AddList from '../../components/AddList/AddList'
import UpdateList from '../UpdateList/UpdateList'
import DeleteList from '../DeleteList/DeleteList'
import ListItem from '../ListItem/ListItem'
import { useDispatch, useSelector } from 'react-redux'
import { selectTheme } from '../Header/themeSlice'
import { Oval } from 'react-loader-spinner'
import Select from 'react-select'
import useSelectTheme from '../../hooks/useSecteTheme'
import { FaSortAmountDown, FaSortAmountUpAlt } from 'react-icons/fa'
import { changeNotifications } from '../Notifications/notificationsSlice'

const options = [
  { value: 'date_added', label: 'По дате добавления' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'name', label: 'По имени' },
  { value: 'user_rating', label: 'По оценке пользователя' },
]

export default function Tabs({list, setList, isOwner}) {

  const dispatch = useDispatch()

  const tabList = useRef()
  const titlesList = useRef()
  const nextUrl = useRef()
  const nextUrlQuery = useRef(true)

  const darkTheme = useSelector(selectTheme)

  const [curList, setCurList] = useState(0)

  const [lists, setLists] = useState({})

  const [addListVisibility, setAddListVisibility] = useState(false)
  const [updateListVisibility, setUpdateListVisibility] = useState(false)
  const [deleteListVisibility, setDeleteListVisibility] = useState(false)

  const [sortValue, setSortValue] = useState(options[0])
  const [desc, setDesc] = useState(true)

  const customStyles = useSelectTheme(darkTheme, '250px', 'end')

  const [loadingList, setLoadingList] = useState(true)
  const [loadingPag, setLoadingPag] = useState(false)

  const [countInList, setCountInList] = useState([])

  const [listLoaded, setlistLoaded] = useState([])

  useEffect(() => {
    if(listLoaded.length === 0)
      setlistLoaded(new Array(list.length).fill(false))

    nextUrl.current = null

    if((!lists[curList] || lists[curList].length === 0) && !listLoaded[curList]) {
      fetchData()
      let newArray = [...listLoaded]
      newArray[curList] = true
      setlistLoaded(newArray)
    }
  }, [curList])

  const fetchData = async () => {
    if(list[curList]) {
      const url = `/social/list-titles/${list[curList].id}/?order=${sortValue.value ? `${desc ? '-' : ''}${sortValue.value}` : ``}`

      try {
        setLoadingList(true)
        const res = await api.get(url)
        setLists({
          ...lists,
          [curList]: res.data.results
        })
        setLoadingList(false)
        nextUrl.current = res.data.next
      }
      catch(err) {
        setLoadingList(false)
      }
    }
    setLoadingList(false)
  }

  useEffect(() => {
    let countArr = []

    list.forEach(element => {
      countArr.push(element.titles_count)
    })

    setCountInList(countArr)
  }, [list])

  useEffect(() => {
    if(!loadingList)
      fetchData()
  }, [sortValue, desc])

  const createDefault = async () => {
    const url = `/social/lists/create-default/`

    try {
      await api.post(url)
      dispatch(changeNotifications({type:'success', title:'Создание списков', text:'Списки были успешно созданы'}))
      setList()
    }
    catch (err) {
      if(err.response.data.refresh)
        dispatch(changeNotifications({type:'error', title:'Ошибка создания списков', text:'Авторизируйтесь для создания списков'}))
      else
        dispatch(changeNotifications({type:'error', title:'Ошибка создания списков', text: err.response.data.details || err.response.data.name}))
    }
  }

  const handleScroll = async () => {
    
    if(nextUrl.current && nextUrlQuery.current) {
      const scrollBottom = titlesList.current.getBoundingClientRect().bottom <= window.innerHeight

      if (scrollBottom) {
        nextUrlQuery.current = false

        window.removeEventListener('scroll',  handleScroll)
        
        try {
          setLoadingPag(true)
          const res = await api.get(nextUrl.current)
          setLists({
            ...lists,
            [curList]: [...lists[curList], ...res.data.results]
          })
          setLoadingPag(false)
          nextUrl.current = res.data.next
        }
        catch(err) {
          setLoadingPag(false)
        }

        window.addEventListener('scroll',  handleScroll)

        nextUrlQuery.current = true
      }
    }
  }

  const changeLists = (add, remove) => {
    let addArray = [...add], removeArray = [...remove]

    let comparedIndexes = [], matched = []

    addArray.forEach(addEl => removeArray.some((removeEl, index) => {
      if(comparedIndexes.findIndex(element => element === index) === -1) {
        if(addEl.list === removeEl.list && addEl.item.id === removeEl.item.id) {
          comparedIndexes.push(index)
          matched.push(removeEl)
          return true
        }
      } 
    }))

    matched.forEach(element => {
      [...addArray].some((item, index) => {
        if(item.list === element.list && item.item.id === element.item.id) {
          addArray.splice(index, 1)
          return true
        }
      })
    })

    matched.forEach(element => {
      [...removeArray].some((item, index) => {
        if(item.list === element.list && item.item.id === element.item.id) {
          removeArray.splice(index, 1)
          return true
        }
      })
    })

    let addObj = {...lists}, newCountArr = [...countInList]

    addArray.forEach(element => {
      let key = list.findIndex(el => el.id === element.list)
      newCountArr[+key]++
      addObj = {
        ...addObj,
        [key]: addObj[key] ? [element.item, ...addObj[key]] : null
      }
    })

    let removeObj = {...addObj}

    removeArray.forEach(element => {
      let key = list.findIndex(el => el.id === element.list)
      newCountArr[+key]--
      removeObj = {
        ...removeObj,
        [key]: removeObj[key] ? [...removeObj[key].filter(el => element.item.id !== el.id)] : null
      }
    })

    setLists({
      ...removeObj
    })

    setCountInList(newCountArr)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [curList, fetchData])

  return (
    <div className="user__lists" ref={tabList}>
      <div className="user__lists-container">
        <div className="user__lists-title-block">
          <p className="user__lists-title">Списки</p>
          {
            isOwner ?
              <p className="user__lists-title">{`${list.length}/20`}</p>
              : null
          }
        </div>
        <div className="user__tab-titles">
          {list.length > 0 ? 
            list.map((item, index) => 
              <TabTitle 
                key={`tabtitle${index}`}
                index={index}
                curList={curList}
                setCurList={setCurList}
                setLists={setLists}
                lists={lists}
                {...item}
                count={countInList[index]}
              />
            ) :
            isOwner ?
              <div className="user__create-default-block">
                <Button outline={true} onClick={() => createDefault()}>Создать стандартные списки</Button>
              </div>
            : null
          }
        </div>
      </div>

      <div className="user__lists-titles-block">
        
          <div className="user___lists-buttons">
            {
              isOwner ?
                <div className="user___lists-buttons-block">
                  {
                    list.length !== 0 ?
                      <Button onClick={() => setUpdateListVisibility(true)}>Редактировать текущий список</Button>
                      : null
                  }
                  <Button outline={true} onClick={() => setAddListVisibility(true)}>Добавить список</Button>
                </div>
                : <div className="user___lists-buttons-block"></div>
            }
            {
              list.length !== 0 ?
                <div className="user___lists-buttons-block">
                  <Select 
                    value = {sortValue}
                    onChange={e => setSortValue(e)}
                    styles={customStyles}
                    options={options}
                    isOptionDisabled={option => option.disabled}
                    isSearchable={false}
                  />  
                  <div className="switchSortButton" onClick={() => setDesc(!desc)}>
                    {desc ? 
                      <FaSortAmountDown size="30px" className="icon"/> : 
                      <FaSortAmountUpAlt size="30px" className="icon"/>
                    }
                  </div>
                </div>
                : null
            }
          </div>
        
        
        <div className="user__lists-titles" ref={titlesList}>
          {list.length === 0 ? null 
            : loadingList ?
              <div className="spinnerBlock mt-40">
                <Oval color={darkTheme ? "white" : "black"} secondaryColor={darkTheme ? "white" : "black"} height="50px" width="50px"/>
              </div> 
            : !lists[curList] ? null 
              : lists[curList].length > 0 ?
                lists[curList].map((item, index) => 
                  <ListItem 
                    {...item}
                    userLists={list}
                    key={`listItem${index}`}
                    isOwner={isOwner}
                    changeLists={changeLists}
                    item={item}
                  />
                )
              :  
                <div className="chapters">
                  <div className="cahapters__text-container">
                    <p className="chapters__text default-text">Список пуст</p>
                  </div>
                </div>
          }
          {
            loadingPag ?
              <div className="spinnerBlock mt-4">
                <Oval color={darkTheme ? "white" : "black"} secondaryColor={darkTheme ? "white" : "black"} height="50px" width="50px"/>
              </div> 
              : null
          }
        </div>
      </div>
          
      <AddList 
        visibility={addListVisibility} 
        setVisibility={setAddListVisibility} 
        list={list} 
        setList={setList}
        count={list.length}
      />

      <UpdateList 
        visibility={updateListVisibility} 
        setVisibility={setUpdateListVisibility} 
        list={list} 
        setList={setList} 
        curList={curList}
        setDeleteVisibility={setDeleteListVisibility}
      />

      <DeleteList
        visibility={deleteListVisibility} 
        setVisibility={setDeleteListVisibility} 
        callback={setList}
        setPrevVisibility={setUpdateListVisibility}
        url={`/social/lists/list/${list[curList] ? list[curList].id : -1}/`} 
        text={'список'}
        textTitle={'Список'}
        textNot={'списка'}
      />
    </div>
  )
}
