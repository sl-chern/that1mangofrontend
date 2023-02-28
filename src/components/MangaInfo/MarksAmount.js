import React, { useRef, useEffect } from 'react'
import { AiFillStar } from 'react-icons/ai'

export default function MarksAmount({mark, amount, percent}) {

  useEffect(() => {
    let colors = {
      "1": "#CB3838",
      "2": "#CC4539",
      "3": "#CC5939",
      "4": "#CC7139",
      "5": "#CC8739",
      "6": "#CC8739",
      "7": "#CCC039",
      "8": "#B1CC39",
      "9": "#8CCC39",
      "10": "#52CC39",
    }

    bar.current.style.outline = `1px solid ${colors[mark]}`

    barValue.current.style.height = `${percent}%`
    barValue.current.style.backgroundColor = `${colors[mark]}`

  }, [mark, amount, percent])

  const barValue = useRef()
  const bar = useRef()

  return (
    <div className="marksColumn">
        <div className="amountStats">
          <div className="usersMarksAmount">
            <p className="amountStat">{amount}</p>
          </div>
          <div className="usersMarksAmount">
            <p className="amountStat">{parseFloat(percent)}%</p>
          </div>
        </div>
        <div className="bar" ref={bar}>
          <div className="barValue" ref={barValue}>

          </div>
        </div>
        <div className="statMarkBlock">
          <AiFillStar className="icon" size={"16px"}/>
          <p className="amountStat">{mark}</p>
        </div>
    </div>
  )
}
