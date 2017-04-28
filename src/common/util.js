import numeral from 'numeral'
import validator from 'validator'

export const clearInlineScripts = () => {
  const scriptElements = document.body.getElementsByTagName('SCRIPT')
  while (scriptElements.length > 11) {
    const length = scriptElements.length
    document.body.removeChild(scriptElements[length - 1])
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

export const convertSqlDateToStringDateOnly = date => {
  if (!date) return ''
  return `${date.year}-${appendZeroTo1digitNumber(date.monthValue)}-${appendZeroTo1digitNumber(date.dayOfMonth)}` // eslint-disable-line
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
      if (recentItems[i].id === item.id && recentItems[i].type === item.type) {
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

export const setCookie = (cName, cValue, cDay) => {
  const expire = new Date()
  expire.setDate(expire.getDate() + cDay)
  let cookies = cName + '=' + escape(cValue) + '; path=/ '
  if (typeof cDay !== 'undefined') cookies += ';expires=' + expire.toGMTString() + ';'
  document.cookie = cookies
}

export const getCookie = cName => {
  cName = cName + '='
  const cookieData = document.cookie
  let start = cookieData.indexOf(cName)
  let cValue = ''
  if (start !== -1) {
    start += cName.length
    let end = cookieData.indexOf(';', start)
    if (end === -1) end = cookieData.length
    cValue = cookieData.substring(start, end)
  }
  return unescape(cValue)
}

export const setRecentItemToCookie = item => {
  const recentItems = JSON.parse(getCookie('recentItems') === '' ? null : getCookie('recentItems'))
  // recentItems가 없을 경우에는 새로 생성
  if (!recentItems) {
    const newArr = []
    newArr.push(item)
    setCookie('recentItems', JSON.stringify(newArr), 7)
  } else {
    if (recentItems.length > 5) recentItems.shift()
    // recentItems가 있을 경우에는 기존 array에 추가하는데,
    // 기존 array에 id가 존재할 경우에는 기존걸 삭제하고 새로 받은걸 0번으로 세팅한다.
    let existIndex = -1
    for (let i = 0; i < recentItems.length; i++) {
      if (recentItems[i].id === item.id && recentItems[i].type === item.type) {
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
    setCookie('recentItems', JSON.stringify(recentItems), 7)
  }
}

export const isMobile = {
  Android: () => {
    return navigator.userAgent.match(/Android/i)
  },
  BlackBerry: () => {
    return navigator.userAgent.match(/BlackBerry/i)
  },
  iOS: () => {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i)
  },
  Opera: () => {
    return navigator.userAgent.match(/Opera Mini/i)
  },
  Windows: () => {
    return navigator.userAgent.match(/IEMobile/i)
  },
  any: () => {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows())
  }
}

export const setRecentItemToSessionStorage = item => {
  const sessionStorage = window.sessionStorage
  const recentItems = JSON.parse(sessionStorage.getItem('recentItems'))
  // recentItems가 없을 경우에는 새로 생성
  if (!recentItems) {
    const newArr = []
    newArr.push(item)
    sessionStorage.setItem('recentItems', JSON.stringify(newArr))
  } else {
    if (recentItems.length > 5) recentItems.shift()
    // recentItems가 있을 경우에는 기존 array에 추가하는데,
    // 기존 array에 id가 존재할 경우에는 기존걸 삭제하고 새로 받은걸 0번으로 세팅한다.
    let existIndex = -1
    for (let i = 0; i < recentItems.length; i++) {
      if (recentItems[i].id === item.id && recentItems[i].type === item.type) {
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
    sessionStorage.setItem('recentItems', JSON.stringify(recentItems))
  }
}

export const removeEmptyIndex = arr => {
  return arr.filter(elem => elem !== '')
}

export const convertNumberAmountToTextAmount = amount => {
  const amountString = amount.toString()
  const amountStringLength = amountString.length
  let first = ''
  let second = ''
  if (amountStringLength < 5) {
    first = '0'
    second = amountString.slice(0, amountString.indexOf('0'))
  } else {
    first = amountString.slice(0, -4)
    second = amountString.slice(-4)
    second = second.slice(0, second.indexOf('0'))
  }
  return `${first}${second.length > 0 ? '.' : ''}${second}`
}

export const dividePhoneNumber = phoneNumber => {
  return phoneNumber ? phoneNumber.split('-') : null
}

export const assemblePhoneNumber = phoneNumberArr => {
  return `${phoneNumberArr[0]}-${phoneNumberArr[1]}-${phoneNumberArr[2]}`
}

export const isIE = () => {
  const agent = navigator.userAgent.toLowerCase()
  return agent.indexOf('trident') !== -1 || agent.indexOf('msie') !== -1
}

export const isScreenSize = {
  xs: () => window.innerWidth < 768,
  sm: () => window.innerWidth < 992 && window.innerWidth >= 768,
  md: () => window.innerWidth < 1200 && window.innerWidth >= 992,
  lg: () => window.innerWidth >= 1200
}

export const handleOnChangePhone = (e, component, stateName) => {
  const { index } = e.target.dataset
  const phone = component.state[stateName]
  let { value } = e.target
  if (value !== '' && !validator.isNumeric(value)) return
  if (value.length > 4) value = value.slice(0, 4)
  phone[index] = value
  component.setState({ [stateName]: phone })
}
