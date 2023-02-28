import React, { useState, useEffect} from 'react'

export default function SettingsType({children, index, curType, setCurType}) {

  const [hoverClassList, setHoverClassList] = useState("hoverEffect")

  useEffect(() => {
    if(index === curType)
      setHoverClassList("hoverEffect hoverEffect_active")
    else 
      setHoverClassList("hoverEffect")

  }, [curType, index])

  return (
    <div className="settings-type group" onClick={() => setCurType(index)}>
      <div>
        <p className="settings-type__text default-text">{children}</p>
      </div>
      <div className={hoverClassList}></div>
    </div>
  )
}
