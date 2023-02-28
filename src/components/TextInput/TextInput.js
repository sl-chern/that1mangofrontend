import React, {useRef} from 'react'
import './style.css'

export default function TextInput(props) {
  let className = "formInput group"

  const ref = useRef()

  if(props.children !== props.name)
    className += " invalid"

  return (
    <div className="formGroup">
      <input 
        name={props.name} 
        onBlur={e => props.onBlur(e)} 
        type={props.type} 
        required
        autoComplete="off" 
        className={className}
        placeholder=" " 
        value={props.value}
        onChange={e => props.setData(e, props.setValue, props.error, props.constraints)}
        ref={ref}
      />
      <label className="formLabel">{props.children}</label>
    </div>
  )
}
