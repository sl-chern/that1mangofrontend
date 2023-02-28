import React, { useEffect, useState } from 'react'
import './style.css'

export default function SearchType({curType, setCurType, type}) {

  const [classList, setClassList] = useState("search-type-block")

  useEffect(() => {
    if(type === curType)
      setClassList("search-type-block search-type-block_selected")
    else
      setClassList("search-type-block")
  }, [curType, type])

  return (
    <div className={classList} onClick={() => setCurType(type)}>
      <p className="search-type-text">{type}</p>
    </div>
  )
}
