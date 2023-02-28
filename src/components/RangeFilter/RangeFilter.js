import React from 'react'
import RangeInput from '../RangeInput/RangeInput'
import './style.css'

export default function RangeFilter({title, yearFilter, setYearFilter}) {

  const setMin = (e) => {
    setYearFilter({
      ...yearFilter,
      min: e.target.value,
      labelFrom: "От"
    })
  }

  const setMax = (e) => {
    setYearFilter({
      ...yearFilter,
      max: e.target.value,
      labelTo: "До"
    })
  }

  return (
    <div className="rangeFilter">
      <div className="keywordTitle">
        <p className="keywordShowButtonText">{title}</p>
      </div>
      <div className="filterInputsBlock">
        <RangeInput 
          value={yearFilter.min} 
          onChange={setMin}
          name="От"
        >
          {yearFilter.labelFrom}
        </RangeInput>

        <RangeInput 
          value={yearFilter.max} 
          onChange={setMax}
          name="До"
        >
          {yearFilter.labelTo}
        </RangeInput>
      </div>
    </div>
  )
}
