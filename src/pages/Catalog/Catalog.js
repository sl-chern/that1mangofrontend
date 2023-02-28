import React, { useEffect, useState, useRef } from 'react'
import './style.css'
import Select from 'react-select'
import { useSelector } from 'react-redux'
import { selectTheme } from '../../components/Header/themeSlice'
import { FaSortAmountDown, FaSortAmountUpAlt } from 'react-icons/fa'
import Button from '../../components/Button/Button'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import KeywordFilter from '../../components/KeywordFilter/KeywordFilter'
import KeywordButton from './KeywordButton'
import Filter from '../../components/Filter/Filter'
import RangeFilter from '../../components/RangeFilter/RangeFilter'
import Title from '../../components/Title/Title'
import { useDispatch } from 'react-redux'
import { changeNotifications } from '../../components/Notifications/notificationsSlice'
import { insertFilters, reset, getParamArray, getFilterSearchParams, insertRangeFilters } from './catalog.functions'
import useSelectTheme from '../../hooks/useSecteTheme'
import { Oval } from 'react-loader-spinner'

const options = [
  { value: 'rating', label: 'По рейтингу' },
  { value: 'name', label: 'По имени' },
  { value: 'date_added', label: 'По дате добавления' },
  { value: 'chapters', label: 'По количеству глав' },
]

export default function Catalog() {

  const dispatch = useDispatch()

  const nextUrl = useRef()
  const titlesBlock = useRef()

  const dark = useSelector(selectTheme)

  const [searchParams, setSearchParams] = useSearchParams()

  const [darkMode, setDarkMode] = useState(dark)
  const [desc, setDesc] = useState(true)
  const [sortValue, setSortValue] = useState(options[0])

  const [titles, setTitles] = useState([])

  const [ageFilter, setAgeFilter] = useState([])
  const [genreFilter, setGenreFilter] = useState([])
  const [tagFilter, setTagFilter] = useState([])
  const [releaseFormatFilter, setReleaseFormatFilter] = useState([])
  const [statusFilter, setStatusFilter] = useState([])
  const [typeFilter, setTypeFilter] = useState([])
  const [anotherFilter, setAnotherFilter] = useState([{name: "Лицензировано", slug: "licensed", selected: null}])
  
  const [genreVisibility, setGenreVisibility] = useState(false)
  const [tagVisibility, setTagVisibility] = useState(false)

  const [searchName, setSearchName] = useState("")

  const [yearFilter, setYearFilter] = useState({
    min: "",
    max: "",
    labelFrom: "От",
    labelTo: "До"
  })

  const [ratingFilter, setRatingFilter] = useState({
    min: "",
    max: "",
    labelFrom: "От",
    labelTo: "До"
  })

  const [chaptersFilter, setChaptersFilter] = useState({
    min: "",
    max: "",
    labelFrom: "От",
    labelTo: "До"
  })

  const [loadingContent, setLoadingContent] = useState(true)
  const [loadingFilters, setLoadingFilters] = useState(true)
  const [loadingPag, setLoadingPag] = useState(false)

  const [kostil, setKostil] = useState(false)

  useEffect(() => {

    const url = '/titles/filters/'

    setLoadingFilters(true)

    axios.get(url)
    .then(res => {
      const { data } = res
      
      let paramsObj = {}

      searchParams.forEach((value, key) => {
        paramsObj = {
          ...paramsObj,
          [key]: [...paramsObj[key] || [], value]
        }
      })

      insertFilters(data.age, setAgeFilter, paramsObj.age || [])
      insertFilters(data.keyword.filter(e => e.type === 'Genre'), setGenreFilter, paramsObj.keyword || [], paramsObj.keyword_ex || [])
      insertFilters(data.keyword.filter(e => e.type === 'Tag'), setTagFilter, paramsObj.keyword || [], paramsObj.keyword_ex || [])
      insertFilters(data.release_format, setReleaseFormatFilter, paramsObj.release_format || [], paramsObj.release_format_ex || [])
      insertFilters(data.status, setStatusFilter, paramsObj.status || [])
      insertFilters(data.type, setTypeFilter, paramsObj.type || [])

      if(paramsObj.licensed)
        setAnotherFilter([{name: "Лицензировано", slug: "licensed", selected: true}])
      
      insertRangeFilters(paramsObj.total_rating_min, paramsObj.total_rating_max, ratingFilter, setRatingFilter)
      insertRangeFilters(paramsObj.chapters_min, paramsObj.chapters_max, chaptersFilter, setChaptersFilter)
      insertRangeFilters(paramsObj.year_min, paramsObj.year_max, yearFilter, setYearFilter)

      setSearchName(paramsObj.name ? paramsObj.name : "")

      if(paramsObj.order) {
        if(paramsObj.order[0][0] === '-') {
          setDesc(true)
          setSortValue(options.find(el => el.value === paramsObj.order[0].slice(1)))
        }
        else {
          setDesc(false)
          setSortValue(options.find(el => el.value === paramsObj.order[0]))
        }
      }
    })
    .then(() => {
      setLoadingFilters(false)
      setKostil(true)
    })
  }, [])

  const customStyles = useSelectTheme(darkMode)

  useEffect(() => {
    setDarkMode(dark)
  }, [dark])

  const fullReset = () => {
    reset(ageFilter, setAgeFilter)
    reset(tagFilter, setTagFilter)
    reset(genreFilter, setGenreFilter)
    reset(releaseFormatFilter, setReleaseFormatFilter)
    reset(statusFilter, setStatusFilter)
    reset(typeFilter, setTypeFilter)
    reset(anotherFilter, setAnotherFilter)

    setYearFilter({
      min: "",
      max: "",
      labelFrom: "От",
      labelTo: "До"
    })
    setRatingFilter({
      min: "",
      max: "",
      labelFrom: "От",
      labelTo: "До"
    })
    setChaptersFilter({
      min: "",
      max: "",
      labelFrom: "От",
      labelTo: "До"
    })
  }

  const validateRangeFilter = (obj, setData) => {
    const re = /^[+-]?\d+(\.\d+)?$/
    let fromEr = false, toEr = false
    let errorObj = {...obj}
    if(!re.test(obj.min) && obj.min !== "") {
      errorObj = {
        ...errorObj,
        labelFrom: "Введите число"
      }
      fromEr = true
    }
    if(!re.test(obj.max) && obj.max !== "") {
      errorObj = {
        ...errorObj,
        labelTo: "Введите число"
      }
      toEr = true
    }
    if(!fromEr && !toEr) {
      if(obj.min > obj.max && obj.min !== "" && obj.max !== "") {
        dispatch(changeNotifications({type: "error", title: `Ошибка фильтра`, text: "Значение 'До' должно быть больше чем значение 'От'"}))
        return [true, true]
      }
    }
    else
      setData(errorObj)
    return [fromEr, toEr]
  }

  const show = () => {
    const [fromRateEr, toRateEr] = validateRangeFilter(ratingFilter, setRatingFilter)
    const [fromYearEr, toYearEr] = validateRangeFilter(yearFilter, setYearFilter)
    const [fromChaptersEr, toChaptersEr] = validateRangeFilter(chaptersFilter, setChaptersFilter)
    if(fromChaptersEr || toChaptersEr || fromRateEr || toRateEr || fromYearEr || toYearEr)
      return
  
    const keywords = [...tagFilter, ...genreFilter]
    let params = {
      ...getParamArray('keyword', keywords),
      ...getParamArray('age', ageFilter),
      ...getParamArray('type', typeFilter),
      ...getParamArray('status', statusFilter),
      ...getParamArray('release_format', releaseFormatFilter)
    }

    if(anotherFilter[0].selected) {
      params = {
        ...params,
        licensed: [true]
      }
    }

    params = {
      ...params,
      ...getFilterSearchParams(yearFilter, 'year'),
      ...getFilterSearchParams(ratingFilter, 'total_rating'),
      ...getFilterSearchParams(chaptersFilter, 'chapters'),
    }

    if(searchName !== "")
      params = {
        ...params,
        name: searchName
      }

    if(sortValue.value) {
      params = {
        ...params,
        order: desc ? `-${sortValue.value}` : sortValue.value
      }
    }

    setSearchParams(params, {replace: true})
  }

  useEffect(() => {
    const params = window.location.href.split('?')[1] || ""

    const url = `/titles/?${params}`

    setLoadingContent(true)

    axios.get(url)
    .then(res => {
      setTitles(res.data.results)
      nextUrl.current = res.data.next
      setLoadingContent(false)
    })
    .catch(() => {
      setLoadingContent(false)
    })
  }, [searchParams])

  useEffect(() => {
    if(kostil)
      show()
  }, [sortValue, desc])

  const handleScroll = () => {
    
    if(nextUrl.current) {
      const scrollBottom = titlesBlock.current.getBoundingClientRect().bottom <= window.innerHeight

      if (scrollBottom) {
        setLoadingPag(true)
        window.removeEventListener('scroll',  handleScroll)

        axios.get(nextUrl.current)
        .then(res => {
          setLoadingPag(false)
          setTitles([...titles, ...res.data.results])
          nextUrl.current = res.data.next
          window.addEventListener('scroll',  handleScroll)
        })
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [titles])

  if(loadingFilters)
    return(
      <div className="spinnerBlock">
        <Oval color={darkMode ? "white" : "black"} secondaryColor={darkMode ? "white" : "black"} height="50px" width="50px"/>
      </div>
    )
  else
    return (
      <section className="catalogSection">
        <section className="mangaSection">
          <div className="mangaSearchHead">
            <div className="searchInputBlock">

              <form onSubmit={e => {
                e.preventDefault()
                show()
              }}>

                <div className="formGroup">
                  <input 
                    className="formInput group" 
                    placeholder=" "
                    value={searchName}
                    onChange={e => setSearchName(e.target.value)}
                  />
                  <label className="formLabel">Введите название</label>
                </div>

                <Button>Поиск</Button>

              </form>
              
            </div>

            <div className="sortBlock">
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
          </div>
          
          <div className="mangaListBlock" ref={titlesBlock}>
            {
              loadingContent ? 
              <div className="spinnerBlock mt-20">
                <Oval color={darkMode ? "white" : "black"} secondaryColor={darkMode ? "white" : "black"} height="50px" width="50px"/>
              </div> :
              <div className="mangaList">
                {
                  titles.length > 0 ?
                    titles.map((item, index) => 
                      <Title 
                        key={`title${index}`}
                        poster={item.poster} 
                        name={item.name}
                        title_type={item.title_type.name || ""}
                        total_rating={item.total_rating}
                        age_rating={item.age_rating.name || ""}
                        slug={item.slug}
                      />
                    )

                    :

                    <div className="chapters">
                      <div className="cahapters__text-container">
                        <p className="chapters__text default-text">По данным критериям ничего не найдено</p>
                      </div>
                    </div>
                }

                {
                  loadingPag ?
                    <div className="spinnerBlock mt-20">
                      <Oval color={darkMode ? "white" : "black"} secondaryColor={darkMode ? "white" : "black"} height="50px" width="50px"/>
                    </div>
                    : null
                }
              </div>
            }
            
          </div>
        </section>

        <aside className="filtresBlock">
          <div className="filtresContent">
            <KeywordButton setVisibility={setGenreVisibility}>Жанры</KeywordButton>
            <KeywordButton setVisibility={setTagVisibility}>Теги</KeywordButton>

            <RangeFilter
              title={"Год выпуска"}
              yearFilter={yearFilter}
              setYearFilter={setYearFilter}
            />

            <RangeFilter
              title={"Оценка"}
              yearFilter={ratingFilter}
              setYearFilter={setRatingFilter}
            />

            <RangeFilter
              title={"Количество глав"}
              yearFilter={chaptersFilter}
              setYearFilter={setChaptersFilter}
            />

            <Filter 
              title={"Возрастной рейтинг"}
              list={ageFilter}
              setFilter={setAgeFilter}
            />

            <Filter 
              title={"Тип"}
              list={typeFilter}
              setFilter={setTypeFilter}
            />

            <Filter 
              title={"Статус"}
              list={statusFilter}
              setFilter={setStatusFilter}
            />

            <Filter 
              title={"Формат выпуска"}
              list={releaseFormatFilter}
              setFilter={setReleaseFormatFilter}
              multiple={true}
            />

            <Filter 
              title={"Другое"}
              list={anotherFilter}
              setFilter={setAnotherFilter}
            />
          </div>

          <div className="filtersButtonsBlock">
              <Button onClick={() => show()}>Показать</Button>
              <Button outline={true} onClick={() => fullReset()}>Сбросить</Button>
          </div>

          <KeywordFilter 
            title="Жанры" 
            list={genreFilter} 
            setFilter={setGenreFilter} 
            visibility={genreVisibility}
            setVisibility={setGenreVisibility}
          />

          <KeywordFilter 
            title="Теги" 
            list={tagFilter} 
            setFilter={setTagFilter} 
            visibility={tagVisibility}
            setVisibility={setTagVisibility}
          /> 
        </aside>
      </section>
    )
}
