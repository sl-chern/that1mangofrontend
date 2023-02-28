const insertFilters = (array, setData, paramsArray, paramsArrayEx = []) => {
  let newArray = []
  array.forEach(element => {
    let value = null
    if(paramsArray.indexOf(element.slug) !== -1)
      value = true
    if(paramsArrayEx.indexOf(element.slug) !== -1)
      value = false
    newArray.push({
      ...element,
      selected: value
    })
  })
  setData(newArray)
}

const reset = (array, setData) => {
  let newArray = []
  array.forEach(element => {
    newArray.push({
      ...element,
      selected: null
    })
  })
  setData(newArray)
}

const getParamArray = (param, array) => {
  let params = {}
  let newKey = []
  let newKeyEx = []
  array.forEach(element => {
    if(element.selected !== null) {
      element.selected ?
        newKey.push(element.slug) :
        newKeyEx.push(element.slug)
    }
  })
  if(newKey.length !== 0)
    params = {
      ...params,
      [param]: [...newKey]
    }
  if(newKeyEx.length !== 0) {
    params = {
      ...params,
      [`${param}_ex`]: [...newKeyEx]
    }
  }
  return params
}

const getFilterSearchParams = (obj, paramsName) => {
  let paramObj = {}
  if(obj.min !== "")
    paramObj = {
      ...paramObj,
      [`${paramsName}_min`]: [+obj.min]
    }
  if(obj.max !== "")
    paramObj = {
      ...paramObj,
      [`${paramsName}_max`]: [+obj.max]
    }
  return paramObj
}

const insertRangeFilters = (min, max, filter, setFilter) => {
  let obj = {
    ...filter,
    min: min ? min[0]: "",
    max: max ? max[0]: "",
  }
  setFilter(obj)
}

export {insertFilters, reset, getParamArray, getFilterSearchParams, insertRangeFilters}