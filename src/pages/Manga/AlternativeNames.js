import React from 'react'

export default function AlternativeNames({names}) {
  if(names)
    return (
      <div className="infoNamesBlock">
        <p className="infoType">Альтернативные названия</p>
        <div className="namesBlock">
          {names.map((item, index) => 
            <p key={`infokey${index}`} className="nameText">{item}</p>
          )}
        </div>
      </div>
    )
  else
    return null
}
