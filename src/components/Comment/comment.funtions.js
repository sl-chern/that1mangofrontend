const textByNumber = (number, type) => {
  let text

  number = +number.toFixed(0)

  switch(type) {
    case 'year':

      switch(number) {
        case 1: 
          text = `год назад`
          break
        case 2:
        case 3:
        case 4:
          text = `${number} года назад`
          break
        default :
          text = `${number} лет назад`
          break
      }

      break 
    
    case 'month':

      switch(number) {
        case 1: 
          text = `месяц назад`
          break
        case 2:
        case 3:
        case 4:
          text = `${number} месяца назад`
          break
        default :
          text = `${number} месяцев назад`
          break
      }

      break 
    case 'day':

      if(number === 1)
        text = `вчера`
      else if((number >= 2 && number <= 4) || (number >= 22 && number <= 24))
        text = `${number} дня назад`
      else
        text = `${number} дней назад`
      
      break 
    case 'hour':

      if(number === 1)
        text = `час назад`
      else if((number % 10 === 2 || number % 10 === 3 || number % 10 === 4) && (number > 20 || number < 10))
        text = `${number} часа назад`
      else if((number % 10 === 1 || number % 10 === 1 || number % 10 === 1) && (number > 20 || number < 10))
        text = `${number} час назад`
      else
        text = `${number} часов назад`

      break 
    case 'minute':

      if(number === 1)
        text = `минуту назад`
      else if((number % 10 === 2 || number % 10 === 3 || number % 10 === 4) && (number > 20 || number < 10))
        text = `${number} минуты назад`
      else if((number % 10 === 1 || number % 10 === 1 || number % 10 === 1) && (number > 20 || number < 10))
        text = `${number} минуту назад`
      else
        text = `${number} минут назад`

      break 
    
    default :
      break
  }

  return text
}

const getStringDate = (creationDate, setCreationDate) => {
  const crD = new Date(creationDate)
  const now = new Date(Date.now())

  let diff = (now.getTime() - crD.getTime()) / (1000 * 60)

  if(diff < 1)
    setCreationDate(`меньше минуты назад`)
  else if(diff < 60)
    setCreationDate(textByNumber(diff, 'minute'))
  else {
    diff /= 60

    if(diff < 24)
      setCreationDate(textByNumber(diff, 'hour'))
    
    else {
      diff /= 24
  
      if(diff < 30)
        setCreationDate(textByNumber(diff, 'day'))
      
      else {
        diff /= 30
    
        if(diff < 12)
          setCreationDate(textByNumber(diff, 'month'))
        
        else {
          diff /= 12
        
          setCreationDate(textByNumber(diff, 'year'))
        }
      }
    }
  }
}

export default getStringDate