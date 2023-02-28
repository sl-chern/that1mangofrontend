import React, { useEffect, useRef, useState } from 'react'
import './style.css'
import api from '../../services/api'
import Select from 'react-select'
import useSelectTheme from '../../hooks/useSecteTheme'
import { useSelector } from 'react-redux'
import { selectTheme } from '../Header/themeSlice'
import { FaSortAmountDown, FaSortAmountUpAlt } from 'react-icons/fa'
import Comment from '../Comment/Comment'
import { Oval } from 'react-loader-spinner'
import CreateComment from '../CreateComment/CreateComment'
import { selectId } from '../Login/loginSlice'

const options = [
  { value: 'date_added', label: 'По дате добавления' },
  { value: 'rating', label: 'По рейтингу' },
]

export default function CommentsInfo({curTab, name, id}) {
  const userId = useSelector(selectId)
  
  const [sortValue, setSortValue] = useState(options[0])
  const [desc, setDesc] = useState(true)

  const [comments, setComments] = useState([])

  const darkMode = useSelector(selectTheme)

  const customStyles = useSelectTheme(darkMode, '250px')

  const nextUrl = useRef()
  const nextUrlQuery = useRef(true)

  const pagRef = useRef()

  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    
    const url = `/social/comments/${id}/?order=${sortValue.value ? `${desc ? '-' : ''}${sortValue.value}` : ``}`
    const res = await api.get(url)

    setComments(res.data.results)

    nextUrl.current = res.data.next
    
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [sortValue, desc, userId])

  const fetchPagData = async () => {
    setLoadingMore(true)
    const res = await api.get(nextUrl.current)
    setComments([...comments, ...res.data.results])
    nextUrl.current = res.data.next
    setLoadingMore(false)
    nextUrlQuery.current = true
  }

  const handleScroll = async () => {

    if(nextUrl.current && nextUrlQuery.current) {
      const scrollBottom = pagRef.current.getBoundingClientRect().bottom <= window.innerHeight

      if (scrollBottom) {
        nextUrlQuery.current = false
        await fetchPagData()
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [id, fetchPagData, comments])

  const pushComment = (comment) => {
    setComments([comment, ...comments])
  }
  
  if(curTab === name)
    return (
      <div className="comments-block">
        <div className="comments-block__user-comment">
          <CreateComment 
            label={'Оставить комментарий'}
            title={id}
            callback={pushComment}
          />
        </div>

        <div className="comments-block__comments-content">
          <div className="comments-block__header">
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

          <div className="comments-block__comments" ref={pagRef}>
            {loading ? 
              <div className="spinnerBlock">
                <Oval color={darkMode ? "white" : "black"} secondaryColor={darkMode ? "white" : "black"} height="50px" width="50px"/>
              </div>
              : comments.map((item, index) => 
                <Comment
                  {...item}
                  comments={comments}
                  setComments={setComments}
                  key={`comment${index}`}
                  titleId={id}
                />
              )
            }

            {
              loadingMore ?
              <div className="spinnerBlock">
                <Oval color={darkMode ? "white" : "black"} secondaryColor={darkMode ? "white" : "black"} height="50px" width="50px"/>
              </div>
              : null
            }

          </div>
        </div>
      </div>
    )
  else
    return null
}
