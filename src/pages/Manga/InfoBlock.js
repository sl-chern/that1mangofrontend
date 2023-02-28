import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function InfoBlock({type, text, param}) {
  const navigate = useNavigate()

  const handleClick = (val) => {
    switch(param) {
      case null:
        break
      case 'year':
        navigate(`/catalog?year_min=${val.name}&year_max=${val.name}`)
        break
      default:
        navigate(`/catalog?${param}=${Array.isArray(val) ? val[0].slug : val.slug}`)
        break
    }
  }

  if(!text)
    return (
      <div className="infoBlock">
        <p className="infoType">{type}</p>
        <p className="infoText">{" "}</p>
      </div>
    )

  if(!Array.isArray(text) || text.length === 1)
    return (
      <div 
        className="infoBlock" 
        onClick={() => handleClick(text)}
      >
        <p className="infoType">{type}</p>
        <p className="infoText">{Array.isArray(text) ? text[0].name : text.name}</p>
      </div>
    )
  else
    return (
      <div className="infoBlock">
        <p className="infoType">{type}</p>
        <div className="infoTextBlock">
          {text.map((item, index) => 
            <div className="infoTextArray group" key={`infokey${index}`} onClick={() => navigate(`/catalog?${param}=${item.slug}`)}>
              <p className="infoText">{item.name}</p>
              <div className="textHoverEffect"></div>
            </div>
          )}
        </div>
      </div>
    )
}
