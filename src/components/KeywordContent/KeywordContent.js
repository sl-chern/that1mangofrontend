import React from 'react'
import Keyword from './Keyword'
import './style.css'

export default function KeywordContent({title, keywords}) {
  if(keywords.length !== 0)
    return (
      <div className="keywordBlock">
        <div className="keywordTitleBlock">
          <p className="keywordBlockTitle">{title}</p>
        </div>
        <div className="keywords">
          {keywords.map((item, index) => 
            <Keyword name={item.name} slug={item.slug} key={`keyword${title}${index}`}/>
          )}
        </div>
      </div>
    )
  else
    return null
}
