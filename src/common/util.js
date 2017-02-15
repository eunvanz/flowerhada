import numeral from 'numeral'

export const clearInlineScripts = () => {
  while (document.body.childElementCount !== 6) {
    document.body.removeChild(document.body.lastChild)
  }
}

export const appendInlineScripts = scriptsSrcsArr => {
  for (const src of scriptsSrcsArr) {
    const script = document.createElement('script')
    script.src = src
    script.async = false
    document.body.appendChild(script)
  }
}

export const setInlineScripts = scriptSrcsArr => {
  clearInlineScripts()
  appendInlineScripts(scriptSrcsArr)
}

export const convertMillisecToTime = millisec => {
  let hour = Math.floor(millisec / 1000 * 60 * 60)
  const min = Math.floor((millisec - hour * 1000 * 60 * 60) / 1000 * 60)
  let amPm = 'AM'
  if (hour > 12) {
    hour = hour - 12
    amPm = 'PM'
  }
  return { hour, min, amPm }
}

export const convertTimeToMillisec = hour => {
  return hour * 1000 * 60 * 60
}

export const convertTimeToString = time => {
  return `${time.amPm} ${time.hour}:${time.min}`
}

export const convertStringToTime = string => {
  const stringArr = string.split(':')
  const hourString = stringArr[0]
  const minString = stringArr[1]
  let hour = Number(hourString)
  const min = Number(minString)
  let amPm = 'AM'
  if (hour >= 12) {
    amPm = 'PM'
    hour = hour - 12
  } else if (hour === 0) {
    hour = 12
  }
  return { amPm, hour, min }
}

export const convertRawLessonDaysToLessonDays = rawLessonDays => {
  const result = []
  for (const rawLessonDay of rawLessonDays) {
    rawLessonDay.startTime = convertStringToTime(rawLessonDay.startTime)
    rawLessonDay.endTime = convertStringToTime(rawLessonDay.endTime)
    result.push(rawLessonDay)
  }
  return result
}

export const sortLessonDaysByDayAsc = lessonDays => {
  const daysArr = ['월', '화', '수', '목', '금', '토', '일']
  let temp = {}
  for (let i = 0; i < lessonDays.length - 1; i++) {
    for (let j = i + 1; j < lessonDays.length; j++) {
      if (daysArr.indexOf(lessonDays[i].day) > daysArr.indexOf(lessonDays[j].day)) {
        temp = lessonDays[i]
        lessonDays[i] = lessonDays[j]
        lessonDays[j] = temp
      }
    }
  }
  return lessonDays
}

export const getDiscountPercentage = (price, discountedPrice) => {
  return Math.round((price - discountedPrice) * 100 / price)
}

export const convertDateToString = date => {
  const dateArr = date.split('-')
  return `${dateArr[1]}월 ${dateArr[2]}일`
}

export const extractDaysFromLessonDays = lessonDays => {
  const sortedLessonDays = sortLessonDaysByDayAsc(lessonDays)
  let result = ''
  for (let i = 0; i < sortedLessonDays.length; i++) {
    if (i !== sortedLessonDays.length - 1) result = result + `${sortedLessonDays[i].day}, `
    else result = result + `${sortedLessonDays[i].day}`
  }
  return result
}

export const convertRawStringToTime = rawString => {
  const time = convertStringToTime(rawString)
  let result = ''
  let millis = time.hour * 3600 + time.min * 60
  // if (time.amPm === 'AM') result = result + '오전 '
  // else result = result + '오후 '
  result = `${time.amPm} ${numeral(millis).format('00:00')}`
  result = result.slice(0, result.length - 3)
  return result
}

export const extractDetailScheduleFromLessonDays = lessonDays => {
  let result = []
  result = lessonDays.map(lessonDay => {
    return `${lessonDay.day}요일 ${convertRawStringToTime(lessonDay.startTime)} ~ ${convertRawStringToTime(lessonDay.endTime)}` // eslint-disable-line
  })
  return result
}

export const shortenContent = (content, byte) => {
  if (content.indexOf('<br>') > -1 && content.indexOf('<br>') < byte) {
    return `${content.substring(0, content.indexOf('<br>'))} ...`
  }
  return `${content.substr(0, byte)}${content.length > byte ? '...' : ''}`
}

export const maskName = name => {
  return `${name.substr(0, 1)}**`
}

export const convertSqlDateToString = date => {
  return `${date.year}-${appendZeroTo1digitNumber(date.monthValue)}-${appendZeroTo1digitNumber(date.dayOfMonth)} ${appendZeroTo1digitNumber(date.hour)}:${appendZeroTo1digitNumber(date.minute)}:${appendZeroTo1digitNumber(date.second)}` // eslint-disable-line
}

export const appendZeroTo1digitNumber = number => {
  if (number < 10) number = `0${number}`
  return number
}

export const setRecentItemToLocalStorage = item => {
  const localStorage = window.localStorage
  const recentItems = JSON.parse(localStorage.getItem('recentItems'))
  // recentItems가 없을 경우에는 새로 생성
  if (!recentItems) {
    const newArr = []
    newArr.push(item)
    localStorage.setItem('recentItems', JSON.stringify(newArr))
  } else {
    if (recentItems.length > 5) recentItems.shift()
    // recentItems가 있을 경우에는 기존 array에 추가하는데,
    // 기존 array에 id가 존재할 경우에는 기존걸 삭제하고 새로 받은걸 0번으로 세팅한다.
    let existIndex = -1
    for (let i = 0; i < recentItems.length; i++) {
      if (recentItems[i].id === item.id) {
        existIndex = i
        break
      }
    }
    if (existIndex === -1) {
      recentItems.push(item)
    } else {
      recentItems.splice(existIndex, 1)
      recentItems.push(item)
    }
    localStorage.setItem('recentItems', JSON.stringify(recentItems))
  }
}
