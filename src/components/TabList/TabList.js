import React, {useState} from 'react'
import './style.css'
import TabTitle from './TabTitle'

export default function TabList({list, curTab}) {

  const [cur, setCur] = useState(curTab)

  return (
    <div className="tabList">
      {list.map((item, index) =>
        <TabTitle 
          key={`tabtitle${index}`} 
          title={item.title} 
          onClick={item.onClick} 
          cur={cur}
          setCur={setCur}
          name={item.name}
        />
      )}
    </div>
  )
}
