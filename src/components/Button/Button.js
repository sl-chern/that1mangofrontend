import React, { useEffect, useState } from 'react'
import "./style.css"

export default function Button(props) {

  const [butStyle, setButStyle] = useState()
  const [textStyle, setTextStyle] = useState()

  useEffect(() => {
    if(!props.outline) {
      setTextStyle("text")
      setButStyle("button group")
    }
    else {
      setTextStyle("text-outline")
      setButStyle("button-outline group")
    }
  }, [props.outline])

  if(!props.loading)
    return (
      <button type="submit" className={butStyle} onClick={props.onClick}>
        <p className={textStyle}>
          {props.children}
        </p>
      </button>
    )
  else 
    return <div className="loaderBlock">
      <div className="lds-dual-ring"></div>
    </div>
}
