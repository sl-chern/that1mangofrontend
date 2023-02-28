import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Keyword({name, slug}) {

  const navigate = useNavigate()

  return (
    <a href={`/catalog?keyword=${slug}`}>
      <div className="keyword">
        <p className="keywordTitle">{name}</p>
      </div>
    </a>
  )
}
