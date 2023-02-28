const setAllMarks = (setMarksAmount, setRating, setMarks, setTitleRating, title_rating) => {
  let sum = {
    amount: 0,
    mark: 0,
  }

  let marks = {
    "1": {amount: 0, percent: 0},
    "2": {amount: 0, percent: 0},
    "3": {amount: 0, percent: 0},
    "4": {amount: 0, percent: 0},
    "5": {amount: 0, percent: 0},
    "6": {amount: 0, percent: 0},
    "7": {amount: 0, percent: 0},
    "8": {amount: 0, percent: 0},
    "9": {amount: 0, percent: 0},
    "10": {amount: 0, percent: 0},
  }

  title_rating.reduce((a, b) => {
    a.amount += b.amount
    a.mark += b.rating.mark * b.amount
    return a
  }, sum)

  title_rating.forEach(element => {
    marks[element.rating.mark].amount += element.amount
  })
  
  let marksArray = []

  for (const [key, value] of Object.entries(marks)) {
    marks[key].percent = sum.amount === 0 ? 0 : ((value.amount / sum.amount) * 100).toFixed(2)
    marksArray.push({mark:key, amount:value.amount, percent:marks[key].percent})
  }

  let avgMark = (sum.mark/sum.amount).toFixed(2)

  marksArray.sort((a, b) => {
    if(+a.mark < +b.mark) return 1
    if(+a.mark > +b.mark) return -1
    return 0
  })

  setMarksAmount(sum.amount)
  setRating(sum.amount === 0 ? 0 : avgMark)
  setMarks(marksArray)
  setTitleRating(title_rating)
}

export default setAllMarks