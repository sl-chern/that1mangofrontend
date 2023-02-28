import React, {useState, useEffect} from 'react'
import './style.css'
import { IoCaretBack } from 'react-icons/io5'
import Button from '../Button/Button'
import Checkbox from '../Checkbox/Checkbox'

export default function KeywordFilter({title, list, setFilter, visibility, setVisibility}) {

  const [classList, setClassList] = useState("keywordFilterBlock")

  useEffect(() => {
    if(visibility)
      setClassList("keywordFilterBlock hiddenInOverflow")
    else 
      setClassList("keywordFilterBlock")
  }, [visibility])

  const onCheck = (value, name) => {
    let arr = []
    list.forEach(element => {
      element.name === name ?
        arr.push({
          ...element,
          selected: value
        }) :
        arr.push({...element})
    })
    setFilter(arr)
  }

  const reset = () => {
    let arr = []
    list.forEach(element => {
      arr.push({
        ...element,
        selected: null
      })
    })
    setFilter(arr)
  }

  return (
    <div className={classList}>
      <div className="keywordTitle">
        <div className="backButton" onClick={() => setVisibility(false)}>
          <IoCaretBack className="icon" size="20px"/>
          <p className="personsTitleText">{title}</p>
        </div>
        <Button onClick={() => reset()}>Сбросить</Button>
      </div>

      <div className="keywordCheckboxesBlock">
        {list.map((item, index) => 
          <Checkbox 
            label={item.name} 
            value={item.selected} 
            key={`checkbox${title}${index}`} 
            onClick={onCheck}
            multiple={true}
          />
        )}
      </div>
    </div>
  )
}
