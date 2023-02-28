import React from 'react'
import './style.css'
import Checkbox from '../Checkbox/Checkbox'

export default function Filter({title, list, setFilter, multiple}) {

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

  return (
    <div className="filterBlock">
      <div className="keywordTitle">
        <p className="keywordShowButtonText">{title}</p>
      </div>
      <div className="checkboxesBlock">
        {list.map((item, index) => 
          <Checkbox 
            label={item.name} 
            value={item.selected} 
            key={`checkbox${title}${index}`} 
            onClick={onCheck}
            multiple={multiple}
          />
        )}
      </div>
    </div>
  )
}
