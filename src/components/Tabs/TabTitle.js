import React, { useEffect, useState } from 'react'

export default function TabTitle({index, curList, setCurList, name, setLists, lists, count}) {

  const [classList, setClassList] = useState('tab-title')

  useEffect(() => {
    if(curList === index) 
      setClassList('tab-title tab-title_active')
    else
      setClassList('tab-title')
  }, [curList])

  const onClickHandler = (index) => {
    if(!lists[index])
      setLists({
        ...lists,
        [index]: []
      })
    setCurList(index)
  }

  return (
    <div className={classList} onClick={() => onClickHandler(index)}>
      <div className="tab-title__text-container">
        <p className="tab-title__text">{name}</p>
        <div className="tab-title__gradient"></div>
      </div>
      <div className="tab-title__count-block">
        <p className="tab-title__count">{count}</p>
      </div>
    </div>
  )
}
