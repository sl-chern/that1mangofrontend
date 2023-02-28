import React from 'react'
import { IoIosArrowForward } from 'react-icons/io'

export default function KeywordButton({children, setVisibility}) {
  return (
    <div className="keywordShowButton" onClick={() => setVisibility(true)}>
      <p className="keywordShowButtonText">{children}</p>
      <div>
        <IoIosArrowForward className="icon" size={"25px"}/>
      </div>
    </div>
  )
}
