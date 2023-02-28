const useValidator = (setData) => {

  const getMinMaxDays = (month, year) => {
    if(month === 2 && Number.isInteger(year / 4))
      return [1, 29]
    if(month === 2)
      return [1, 28]
    switch(month) {
      case 1:
      case 3: 
      case 5:
      case 7:
      case 8:
      case 10: 
      case 12:
        return [1, 31]
      default:
        return [1, 30]
    }
  }

  return setData = (e, setData, refErr, constraints) => {
    const data = typeof e !== 'object' || typeof e === 'undefined' ? e : e.target.value

    let err = false
    let errText = ""

    let ret = false

    Object.entries(constraints).some(entry => {
      const [key, value] = entry;
      switch(key) {
        case "min":
          if(data.length < +value) {
            err  = true
            errText = `Должен быть больше ${+value} символа(ов)`
          }
          break
        case "max":
          if(data.length > +value) {
            err  = true
            errText = `Должен быть меньше ${+value} символов`
          }
          break
        case "isLogin":
          const reLogin = /^(([A-Za-z-_0-9]{0,30}))$/u
          if(!reLogin.test(data)) {
            err  = true
            errText = `Разрешенные символы: A-z, 0-9, _, - `
          }
          break
        case "isEmail":
          const reEmail = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i
          if(!reEmail.test(data)) {
            err  = true
            errText = `Некорректный адрес почты`
          }
          break
        case "isTeamName":
            const reTeamName = /^(([A-Za-zА-Яа-я-_0-9 ]{0,30}))$/u
            if(!reTeamName.test(data)) {
              err  = true
              errText = `Некорректное название команды`
            }
            break
        case "compare":
          if(data !== value) {
            err  = true
            errText = `Пароли не совпадают`
            refErr.current = {err: true, text: errText}
          }
          break
        case "slug":
          const reSlug = /^(([a-z0-9-]{0,30}))$/u
          if(!reSlug.test(data)) {
            err  = true
            errText = `Разрешенные символы: a-z, 0-9, - `
          }
          break
        case "minNumb":
          if(isNaN(data)) {
            ret = true
            break
          }
          if(+data < +value ) {
            err  = true
            errText = `Мин:${value}`
          }
          break
        case "maxNumb":
          if(isNaN(data)) {
            ret = true
            break
          }
          if(+data > +value ) {
            err  = true
            errText = `Макс:${value}`
          }
          break
        case "isDay":
          if(isNaN(data)) {
            ret = true
            break
          }
          let [minDay, maxDay] = getMinMaxDays(value.month ? value.month : 1, value.year ? value.year : 1)
          if(+data < minDay ) {
            err  = true
            errText = `Мин:${minDay}`
            refErr.current = {err: true, text: errText}
          }
          if(+data > maxDay) {
            err  = true
            errText = `Макс:${maxDay}`
            refErr.current = {err: true, text: errText}
          }
          break
        default:
          break
      }
      return err
    })
    if(err) 
      refErr.current = {err: true, text: errText}
    else
      refErr.current = {err: false, text: data}

    if(ret)
      return

    setData(data)
  }
}

export default useValidator