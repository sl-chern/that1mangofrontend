import React, { useEffect, useRef, useState } from 'react'
import './style.css'
import api from '../../services/api'
import Title from '../../components/Title/Title'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import NewChapter from '../../components/NewChapter/NewChapter'
import { useSelector } from 'react-redux'
import { selectTheme } from '../../components/Header/themeSlice'
import { Oval } from 'react-loader-spinner'
import Button from '../../components/Button/Button'
import PopularTitle from '../../components/PopularTitle/PopularTitle'

export default function Home() {

  const darkMode = useSelector(selectTheme)

  const nextUrl = useRef()
  const nextUrlQuery = useRef(true)
  const nextUrlPopular = useRef()
  const pagBlock = useRef()

  const [newTitles, setNewTitles] = useState()
  const [newChapters, setNewChapters] = useState()
  const [popularTitles, setPopularTitles] = useState()

  const [loadingNewTitles, setLoadingNewTitles] = useState(true)
  const [loadingNewChapters, setLoadingNewChapters] = useState(true)
  const [loadingPagChapters, setLoadingPagChapters] = useState(false)
  const [loadingPopular, setLoadingPopular] = useState(true)
  const [loadingButton, setloadingButton] = useState(false)

  useEffect(() => {
    const fetchNewTitles = async () => {
      setLoadingNewTitles(true)

      const url = `/titles/new-titles/`

      try {
        const res = await api.get(url)
        setNewTitles(res.data)
        setLoadingNewTitles(false)
      }
      catch(err) {

      }
    }

    const fetchNewChapters = async () => {
      setLoadingNewChapters(true)
      const url = `/titles/new-chapters/`

      try {
        const res = await api.get(url)
        setNewChapters(res.data.results)
        nextUrl.current = res.data.next
        setLoadingNewChapters(false)
      }
      catch(err) {
        
      }
    }

    const fetchPopularTitles = async () => {
      setLoadingPopular(true)
      const url = `/titles/popular-now-titles/?limit=7`

      try {
        const res = await api.get(url)
        setPopularTitles(res.data.results)
        nextUrlPopular.current = res.data.next
        setLoadingPopular(false)
      }
      catch(err) {
        
      }
    }

    fetchPopularTitles()
    fetchNewTitles()
    fetchNewChapters()
  }, [])

  const fetchPagData = async () => {
    const res = await api.get(nextUrl.current)
    setNewChapters([...newChapters, ...res.data.results])
    nextUrl.current = res.data.next
    nextUrlQuery.current = true
  }

  const handleScroll = async () => {
    if(nextUrl.current && nextUrlQuery.current) {

      const scrollBottom = pagBlock.current.getBoundingClientRect().bottom <= window.innerHeight

      if (scrollBottom && !loadingPagChapters) {
        nextUrlQuery.current = false
        setLoadingPagChapters(true)
        await fetchPagData()
        setLoadingPagChapters(false)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fetchPagData, newChapters])

  const fetchPagPopularData = async () => {
    if(nextUrlPopular.current) {
      setloadingButton(true)
      const res = await api.get(nextUrlPopular.current)
      setPopularTitles([...popularTitles, ...res.data.results])
      nextUrlPopular.current = res.data.next
      setloadingButton(false)
    }
  }

  return (
    <section className="home">
      <section className="home__new-manga">
        <div className="home__new-titles-block">
          <div className="home__new-titles-header">
            <p className="home__new-titles-header-text">Горячие новинки</p>
          </div>

          <div className="home__new-titles-titles" >
            {
              loadingNewTitles ?
                <div className="spinnerBlock">
                  <Oval color={darkMode ? "white" : "black"} secondaryColor={darkMode ? "white" : "black"} height="50px" width="50px"/>
                </div>
                :
                <Swiper
                  slidesPerView={4}
                  speed={500}
                >
                  {
                    newTitles instanceof Array ?
                      newTitles.map((item, index) => 
                        <SwiperSlide>
                          <Title 
                            key={`newTitles${index}`}
                            poster={item.poster} 
                            name={item.name}
                            title_type={item.title_type.name || ""}
                            total_rating={item.total_rating || 0}
                            age_rating={item.age_rating.name || ""}
                            slug={item.slug}
                          />
                        </SwiperSlide>
                      )
                    :null
                  }
                </Swiper>
            }
          </div>
        </div>

        <div className="home__new-chapters-block">
          <div className="home__new-chapters-header">
            <p className="home__new-chapters-header-text">Свежайшие главы</p>
          </div>

          <div className="home__new-chapters-content" ref={pagBlock}>
            {
              loadingNewChapters ?
                <div className="spinnerBlock">
                  <Oval color={darkMode ? "white" : "black"} secondaryColor={darkMode ? "white" : "black"} height="50px" width="50px"/>
                </div>
                :
                newChapters instanceof Array ?
                  newChapters.map((item, index) => 
                    <NewChapter
                      key={`newChapter${index}`}
                      {...item}
                    />
                  )
                  : null
            }
            {
              loadingPagChapters ?
                <div className="spinnerBlock">
                  <Oval color={darkMode ? "white" : "black"} secondaryColor={darkMode ? "white" : "black"} height="50px" width="50px"/>
                </div>
                : null
            }
          </div>
        </div>
      </section>
      <aside className="home__popular-titles">
        <div className="home__new-chapters-header mb-2">
          <p className="home__new-chapters-header-text">Популярное за месяц</p>
        </div>
        {
          !loadingPopular ?
            popularTitles instanceof Array ?
              popularTitles.map((item, index) =>
                <PopularTitle
                  key={`popularTitle${index}`}
                  {...item}
                />
              )
              : null
            : 
            <div className="spinnerBlock mt-6">
              <Oval color={darkMode ? "white" : "black"} secondaryColor={darkMode ? "white" : "black"} height="50px" width="50px"/>
            </div>
        }

        {
          loadingPopular || !nextUrlPopular.current ?
            null
            : <Button loading={loadingButton} onClick={() => fetchPagPopularData()}>Загрузить еще</Button>
        }
      </aside>
    </section>
  )
}
