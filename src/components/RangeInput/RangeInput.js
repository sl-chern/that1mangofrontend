import React, { useEffect, useState } from 'react'

export default function RangeInput({children, name, value, onChange, requiredField}) {

  const [adProp, setAdProp] = useState({})

  let className = "formInput group"

  if(children !== name)
    className += " invalid"

  useEffect(() => {
    if(requiredField)
      setAdProp({'required': 'required'})
    else
      setAdProp({})
  }, [requiredField])

  return (
    <div className="formGroup">
      <input 
        value={value}
        onChange={e => onChange(e)}
        className={className}
        placeholder=" "
        {...adProp}
      />
      <label className="formLabel">{children}</label>
    </div>
  )
}
