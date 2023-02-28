import React, { useRef, useEffect, useState } from 'react'
import KeywordContent from '../KeywordContent/KeywordContent'
import MarksAmount from './MarksAmount'
import './style.css'

export default function MangaInfo({curTab, name, description, keywords, marks}) {

  const [descriptionBlock, setDescriptionBlock] = useState(null)
  const [descBut, setDescBut] = useState("Подробнее")
  const [descClassList, setDescClassList] = useState("mangaDescriptionBlockOverflow")
  const [darkClassList, setDarkClassList] = useState("darkEffect")

  const handleDescClick = () => {
    if(descBut === "Подробнее") {
      setDescBut("Скрыть")
      setDescClassList("mangaDescriptionBlockOverflow fullDesc")
      setDarkClassList("darkEffect fDesc")
    }
    else {
      setDescBut("Подробнее")
      setDescClassList("mangaDescriptionBlockOverflow")
      setDarkClassList("darkEffect")
    }
  }

  useEffect(() => {
    if(description ? description.length < 500 : true)
      setDescriptionBlock(
        <div className="mangaDescriptionBlock">
          <p className="mangaDescription">{description}</p>
        </div>
      )
    else
      setDescriptionBlock(
        <div className="mangaDescriptionBlock">
          <div className={descClassList}>
            <p className="mangaDescription">{description}</p>
            <div className={darkClassList}></div>
          </div>
          <div className="descriptionButton group" onClick={() => handleDescClick()}>
            <p>{descBut}</p>
            <div className='hoverEffect'></div>
          </div>
        </div>
      )
  }, [description, descBut])

  if(curTab === name)
    return (
      <div className="mangaInfoContent">
        {descriptionBlock}

        <KeywordContent title="Жанры" keywords={keywords.filter(element => element.type === 'Genre' ? true : false)}/>
        <KeywordContent title="Теги" keywords={keywords.filter(element => element.type === 'Tag' ? true : false)}/>

        <div className="keywordTitleBlock mt-4 ml-2">
          <p className="keywordBlockTitle">Оценки пользователей</p>
        </div>

        <div className="usersMarksAmountBlock">
          {marks.map((item, index) => 
            <MarksAmount mark={item.mark} amount={item.amount} percent={item.percent} key={`marksAmount${index}`}/>
          )}
          
        </div>
      </div>
    )
  else
    return null
}
