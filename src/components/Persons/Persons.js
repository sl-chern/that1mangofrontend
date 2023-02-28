import React from 'react'
import Person from './Person'
import './style.css'

export default function Persons({title, list, pluralTitle, param}) {

  if(list.length > 0)
    return (
      <div className="personsBlock">
        <div className="personsTitle">
          <p className="personsTitleText">{list.length > 1 ? pluralTitle : title}</p>
        </div>
        {list.map((item, index) => 
          <Person 
            name={item.person ? item.person.name : item.name} 
            img={item.person ? item.person.picture : item.picture} 
            key={`person${title}${index}`}
            slug={item.person ? item.person.id : item.slug}
            param={param}
          />
        )}
      </div>
    )
  else
    return null
    
}
