import React, {useEffect, useState} from 'react'

export default function TabTitle({title, onClick, cur, setCur, name}) {

  const [tabClassList, setTabClassList] = useState("tabTitle")
  const [textClassList, setTextClassList] = useState("tabTitleText")

  useEffect(() => {
    if(cur == name) {
      setTabClassList("tabTitle activeTab")
      setTextClassList("tabTitleText activeText")
    }
    else {
      setTabClassList("tabTitle")
      setTextClassList("tabTitleText")
    }
  }, [cur])

  return (
    <div className={tabClassList} onClick={() => {
      onClick()
      setCur(name)
    }}>
      <p className={textClassList}>{title}</p>
    </div>
  )
}
