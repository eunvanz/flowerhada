import React from 'react'
import { Link } from 'react-router'
import { setInlineScripts, convertTimeToString,
  convertRawLessonDaysToLessonDays, sortLessonDaysByDayAsc, convertStringToTime, resizeImage } from 'common/util'
import TextField from 'components/TextField'
import Checkbox from 'components/Checkbox'
import DatePicker from 'components/DatePicker'
import TimePicker from 'components/TimePicker'
import { putLesson, postLesson, deleteLesson, postLessonImage } from 'common/LessonService'
import { postLessonDay, putLessonDay, deleteLessonDay } from 'common/LessonDayService'
import $ from 'jquery'
import Button from 'components/Button'
import { getAllTutors } from 'common/TutorService'

class LessonListView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      detail: '',
      mainCategory: '분류선택',
      subCategory: '',
      oneday: '',
      content: '내용을 입력해주세요.',
      location: '',
      postCode: '',
      address: '',
      restAddress: '',
      latitude: '',
      longitude: '',
      maxParty: '',
      currParty: '0',
      titleImg: '',
      price: '',
      discountedPrice: '',
      lessonDate: '',
      startTime: { hour: 3, min: 0, amPm: 'PM' },
      endTime: { hour: 6, min: 0, amPm: 'PM' },
      expired: false,
      lessonDays: [{ day: '월', startTime: { hour: 3, min: 0, amPm: 'PM' }, endTime: { hour: 6, min: 0, amPm: 'PM' } }],
      lessonTimes: 1,
      weekType: '매주',
      weekLong: '',
      activated: true,
      groupName: '',
      mode: this.props.params.id === 'register' ? 'register' : 'update',
      process: false,
      tutorList: [],
      tutorId: 1,
      level: 1
    }
    this._handleOnChangeCheckbox = this._handleOnChangeCheckbox.bind(this)
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnCLickFold = this._handleOnCLickFold.bind(this)
    this._handleOnClickPostCode = this._handleOnClickPostCode.bind(this)
    this._handleOnChangeDate = this._handleOnChangeDate.bind(this)
    this._handleOnChangeHour = this._handleOnChangeHour.bind(this)
    this._handleOnChangeMin = this._handleOnChangeMin.bind(this)
    this._handleOnClickAmPm = this._handleOnClickAmPm.bind(this)
    this._handleOnChangeLessonTime = this._handleOnChangeLessonTime.bind(this)
    this._handleOnClickLessonTimeAmPm = this._handleOnClickLessonTimeAmPm.bind(this)
    this._handleOnChangeInputLessonTimes = this._handleOnChangeInputLessonTimes.bind(this)
    this._handleOnChangeLessonDay = this._handleOnChangeLessonDay.bind(this)
    this._handleOnClickSubmit = this._handleOnClickSubmit.bind(this)
    this._handleOnClickDelete = this._handleOnClickDelete.bind(this)
    this._isValidForm = this._isValidForm.bind(this)
  }
  componentDidMount () {
    if (this.state.mode === 'update') {
      this.props.fetchLesson(this.props.params.id)
      .then(() => {
        this.setState(Object.assign({}, this.props.lesson,
          { lessonDays: sortLessonDaysByDayAsc(convertRawLessonDaysToLessonDays(this.props.lesson.lessonDays)) },
          { startTime: this.props.lesson.startTime ? convertStringToTime(this.props.lesson.startTime) : null },
          { endTime: this.props.lesson.endTime ? convertStringToTime(this.props.lesson.endTime) : null }
        ))
        this.setState({
          lessonTimes: this.state.lessonDays.length
        })
        $('#content').val(this.state.content)
        const scripts = ['//cdn.tinymce.com/4/tinymce.js',
          '/template/js/inline-lesson-register-view.js']
        setInlineScripts(scripts)
      })
    } else {
      const scripts = ['//cdn.tinymce.com/4/tinymce.js',
        '/template/js/inline-lesson-register-view.js']
      setInlineScripts(scripts)
    }
    getAllTutors().then(res => {
      const tutorList = res.data
      this.setState({ tutorList })
    })
  }
  componentWillUnmount () {
    this.props.clearLesson()
  }
  _handleOnChangeInput (e) {
    e.preventDefault()
    const { id, value } = e.target
    if (id === 'mainCategory') {
      if (value === '원데이레슨') {
        this.setState({ oneday: true })
      } else {
        this.setState({ oneday: false })
      }
    } else if (id === 'price') {
      if (this.state.discountedPrice === '' || this.state.discountedPrice === value.slice(0, -1) ||
        this.state.discountedPrice.slice(0, -1) === value) {
        this.setState({ discountedPrice: value })
      }
    }
    this.setState({ [id]: value })
  }
  _handleOnChangeCheckbox (e) {
    this.setState({ [e.target.id]: e.target.checked })
  }
  _handleOnChangeDate (value, formattedValue) {
    this.setState({ lessonDate: formattedValue })
  }
  _handleOnCLickFold () {
    const postWrapper = document.getElementById('postWrapper')
    postWrapper.style.display = 'none'
  }
  _handleOnChangeHour (e) {
    const type = e.target.dataset.type
    this.setState({ [type]: { ...this.state[type], hour: Number(e.target.value) } })
  }
  _handleOnChangeMin (e) {
    const type = e.target.dataset.type
    this.setState({ [type]: { ...this.state[type], min: Number(e.target.value) } })
  }
  _handleOnClickAmPm (e) {
    e.preventDefault()
    const type = e.target.dataset.type
    this.setState({ [type]: { ...this.state[type], amPm: this.state[type].amPm === 'AM' ? 'PM' : 'AM' } })
  }
  _handleOnChangeLessonDay (e) {
    const index = e.target.dataset.index
    const lessonDays = this.state.lessonDays
    const oldLessonDay = lessonDays[index]
    const lessonDay = Object.assign({}, oldLessonDay, { day: e.target.value })
    lessonDays[index] = lessonDay
    this.setState({ lessonDays })
  }
  _handleOnChangeLessonTime (e) {
    const index = e.target.dataset.index
    const lessonDays = this.state.lessonDays
    const oldLessonDay = lessonDays[index]
    const type = e.target.dataset.type
    const lessonDay = Object.assign({}, oldLessonDay,
      { [type]: Object.assign({}, oldLessonDay[type], { [e.target.dataset.flag]: Number(e.target.value) }) })
    lessonDays[index] = lessonDay
    this.setState({ lessonDays })
  }
  _handleOnClickLessonTimeAmPm (e) {
    e.preventDefault()
    const index = e.target.dataset.index
    const lessonDays = this.state.lessonDays
    const oldLessonDay = lessonDays[index]
    const type = e.target.dataset.type
    const lessonDay =
      Object.assign({}, oldLessonDay,
        { [type]: Object.assign({}, oldLessonDay[type], { amPm: oldLessonDay[type].amPm === 'AM' ? 'PM' : 'AM' }) })
    lessonDays[index] = lessonDay
    this.setState({ lessonDays })
  }
  _handleOnChangeInputLessonTimes (e) {
    const lessonLength = this.state.lessonDays.length
    const numberToPush = e.target.value - lessonLength
    const lessonDays = this.state.lessonDays
    if (numberToPush > 0) {
      const lessonDefaultObject =
        { day: '월', startTime: { hour: 3, min: 0, amPm: 'PM' }, endTime: { hour: 6, min: 0, amPm: 'PM' } }
      for (let i = 0; i < numberToPush; i++) {
        lessonDays.push(lessonDefaultObject)
      }
      this.setState({ lessonDays })
    } else {
      for (let i = 0; i < numberToPush * -1; i++) {
        const popedLessonDay = lessonDays.pop()
        if (popedLessonDay.id) {
          deleteLessonDay(popedLessonDay.id)
        }
      }
      this.setState({ lessonDays })
    }
    this.setState({ [e.target.id]: e.target.value })
  }
  _isValidForm () {
    let message = ''
    const { title, detail, mainCategory, location, postCode, address,
      latitude, longitude, maxParty, currParty, price, discountedPrice, lessonDate } = this.state
    let titleImage = document.getElementById('titleImg').files[0] || this.props.lesson
    if (titleImage && titleImage.width !== 800) titleImage = resizeImage(titleImage, 800)
    if (title === '') message = '레슨제목을 입력해주세요.'
    else if (detail === '') message = '레슨설명을 입력해주세요.'
    else if (mainCategory === '분류선택') message = '분류를 선택해주세요.'
    else if (location === '') message = '지역을 선택해주세요.'
    else if (postCode === '') message = '우편번호를 입력해주세요.'
    else if (address === '') message = '주소를 입력해주세요.'
    else if (latitude === '' || longitude === '') message = '우편번호를 다시 한 번 선택해주세요.'
    else if (maxParty === '') message = '최대인원을 입력해주세요.'
    else if (currParty === '') message = '현재인원을 입력해주세요.'
    else if (!titleImage) message = '대표이미지를 선택해주세요.'
    else if (price === '') message = '가격을 입력해주세요.'
    else if (discountedPrice === '') message = '할인가를 입력해주세요.'
    else if (lessonDate === '') message = '레슨시작일(레슨날짜)을 입력해주세요.'
    if (message !== '') {
      alert(message)
      return false
    }
    return true
  }
  _handleOnClickSubmit (e) {
    e.preventDefault()
    if (!this._isValidForm()) return
    this.setState({ process: true })
    const lesson = new URLSearchParams()
    lesson.append('title', $('#title').val())
    lesson.append('detail', $('#detail').val())
    lesson.append('mainCategory', $('#mainCategory').val())
    lesson.append('subCategory', $('#subCategory').val())
    lesson.append('groupName', $('#groupName').val() === '' ? this.state.title : this.state.groupName)
    lesson.append('oneday', this.state.oneday)
    lesson.append('location', $('#location').val())
    lesson.append('postCode', $('#postCode').val())
    lesson.append('address', $('#address').val())
    lesson.append('restAddress', $('#restAddress').val())
    lesson.append('longitude', $('#longitude').val())
    lesson.append('latitude', $('#latitude').val())
    lesson.append('maxParty', $('#maxParty').val())
    lesson.append('currParty', $('#currParty').val())
    lesson.append('price', $('#price').val())
    lesson.append('discountedPrice', $('#discountedPrice').val())
    lesson.append('lessonDate', this.state.lessonDate)
    lesson.append('tutorId', this.state.tutorId)
    lesson.append('level', this.state.level)
    if (this.state.oneday) {
      lesson.append('startTime', convertTimeToString(this.state.startTime))
      lesson.append('endTime', convertTimeToString(this.state.endTime))
    } else {
      lesson.append('weekType', $('#weekType').val())
      lesson.append('weekLong', $('#weekLong').val())
    }
    lesson.append('expired', $('#expired').prop('checked'))
    lesson.append('activated', $('#activated').prop('checked'))
    const content = window.tinymce.get('content').getContent()
    lesson.append('content', content)
    let action = putLesson
    if (this.state.mode === 'register') action = postLesson
    const file = document.getElementById('titleImg').files[0]
    let postImage
    if (this.state.mode === 'register') {
      postImage = () => postLessonImage(file)
    } else {
      postImage = file ? () => postLessonImage(file) : () => Promise.resolve()
    }
    postImage()
    .then(res => {
      if (res) {
        const imgUrl = res.data.data.link
        lesson.append('titleImg', imgUrl)
      } else {
        lesson.append('titleImg', this.props.lesson.titleImg)
      }
      return action(lesson, this.props.params.id)
    })
    .then((res) => {
      if (!this.state.oneday && this.state.lessonDays.length > 0) {
        const lessonDays = []
        for (const elem of this.state.lessonDays) {
          const lessonDay = new URLSearchParams()
          lessonDay.append('day', elem.day)
          lessonDay.append('startTime', convertTimeToString(elem.startTime))
          lessonDay.append('endTime', convertTimeToString(elem.endTime))
          lessonDay.append('lessonId', res.data.id)
          if (elem.id) lessonDay.append('id', elem.id)
          lessonDays.push(lessonDay)
        }
        const proms = lessonDays.map(lessonDay => {
          let action = putLessonDay
          if (!lessonDay.get('id')) action = postLessonDay
          return action(lessonDay, lessonDay.get('id'))
        })
        return Promise.all(proms)
      }
      return Promise.resolve()
    })
    .then(() => {
      this.context.router.push('/admin/lesson')
    })
  }
  _handleOnClickDelete () {
    deleteLesson(this.props.params.id)
    // .then(() => {
    //   return deleteLessonDayByLessonId(this.props.params.id)
    // })
    .then(() => {
      this.context.router.push('/admin/lesson')
    })
  }
  _handleOnClickPostCode () {
    const postWrapper = document.getElementById('postWrapper')
    const latitude = document.getElementById('latitude')
    const longitude = document.getElementById('longitude')
    const postCode = document.getElementById('postCode')
    const address = document.getElementById('address')
    const currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop)
    const view = this
    new window.daum.Postcode({
      oncomplete: function (data) {
        // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

        // 각 주소의 노출 규칙에 따라 주소를 조합한다.
        // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
        let fullAddr = data.address // 최종 주소 변수
        let extraAddr = '' // 조합형 주소 변수

        // 기본 주소가 도로명 타입일때 조합한다.
        if (data.addressType === 'R') {
          // 법정동명이 있을 경우 추가한다.
          if (data.bname !== '') {
            extraAddr += data.bname
          }
          // 건물명이 있을 경우 추가한다.
          if (data.buildingName !== '') {
            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName)
          }
          // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
          fullAddr += (extraAddr !== '' ? ' (' + extraAddr + ')' : '')
        }

        // 우편번호와 주소 정보를 해당 필드에 넣는다.
        postCode.value = data.zonecode // 5자리 새우편번호 사용
        address.value = fullAddr
        // 주소로 위도와 경도를 가져온다.
        var geocoder = new window.daum.maps.services.Geocoder()

        geocoder.addr2coord(data.address, function (status, result) {
          if (status === window.daum.maps.services.Status.OK) {
            var lat = result.addr[0].lat
            var lng = result.addr[0].lng
            latitude.value = lat
            longitude.value = lng
            view.setState({
              postCode: postCode.value,
              address: address.value,
              latitude: latitude.value,
              longitude: longitude.value
            })
          }
        })

        // iframe을 넣은 element를 안보이게 한다.
        // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
        postWrapper.style.display = 'none'

        // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
        document.body.scrollTop = currentScroll
      },
      // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
      onresize: function (size) {
        postWrapper.style.height = size.height + 'px'
      },
      width: '100%',
      height: '100%'
    }).embed(postWrapper)

    // iframe을 넣은 element를 보이게 한다.
    postWrapper.style.display = 'block'
  }
  render () {
    const _renderLessonDays = () => {
      if (this.state.oneday) return null
      const returnComponent = []
      returnComponent.push(
        <div className='form-inline' key='default'>
          <div className='form-group'>
            <select id='weekType' className='form-control' style={{ marginRight: '3px' }}
              onChange={this._handleOnChangeInput} value={this.state.weekType}>
              <option value='매주'>매주</option>
              <option value='격주'>격주</option>
            </select>
            <select id='lessonTimes' className='form-control' style={{ marginRight: '3px' }}
              onChange={this._handleOnChangeInputLessonTimes} value={this.state.lessonTimes}>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
            회
            <input type='number' id='weekLong' className='form-control'
              style={{ marginRight: '3px', paddingRight: '6px', width: '60px' }}
              onChange={this._handleOnChangeInput} value={this.state.weekLong} />
            주 수업
          </div>
          <p />
        </div>
      )
      for (let i = 0; i < this.state.lessonTimes; i++) {
        returnComponent.push(
          <div key={i}>
            <label>수업일 #{i + 1}</label>
            <div className='form-inline' id={i}>
              <div className='form-group'>
                <select id='day' className='form-control' style={{ marginRight: '3px' }}
                  onChange={this._handleOnChangeLessonDay} value={this.state.lessonDays[i].day}
                  data-type='day' data-index={i}>
                  <option value='월'>월</option>
                  <option value='화'>화</option>
                  <option value='수'>수</option>
                  <option value='목'>목</option>
                  <option value='금'>금</option>
                  <option value='토'>토</option>
                  <option value='일'>일</option>
                </select>요일<p />
                <label htmlFor='startTime'>수업일 #{i + 1} 시작시간</label>
                <TimePicker
                  id='startTime'
                  type='startTime'
                  index={i}
                  hour={this.state.lessonDays[i].startTime.hour}
                  min={this.state.lessonDays[i].startTime.min}
                  amPm={this.state.lessonDays[i].startTime.amPm}
                  onChangeHour={this._handleOnChangeLessonTime}
                  onChangeMin={this._handleOnChangeLessonTime}
                  onClickAmPm={this._handleOnClickLessonTimeAmPm}
                  style={{ marginRight: '3px' }}
                />
                <label htmlFor='endTime'>수업일 #{i + 1} 종료시간</label>
                <TimePicker
                  id='endTime'
                  type='endTime'
                  index={i}
                  hour={this.state.lessonDays[i].endTime.hour}
                  min={this.state.lessonDays[i].endTime.min}
                  amPm={this.state.lessonDays[i].endTime.amPm}
                  onChangeHour={this._handleOnChangeLessonTime}
                  onChangeMin={this._handleOnChangeLessonTime}
                  onClickAmPm={this._handleOnClickLessonTimeAmPm}
                  style={{ marginRight: '3px' }}
                />
              </div>
            </div>
          </div>
        )
      }
      return returnComponent
    }
    const renderTutorList = () => {
      const { tutorList } = this.state
      if (tutorList.length === 0) return null
      return tutorList.map(tutor => {
        return <option key={tutor.id} value={tutor.id}>{tutor.name}</option>
      })
    }
    return (
      <div>
        <form role='form'>
          <div className='form-group'>
            <TextField
              id='title'
              label='레슨제목'
              onChange={this._handleOnChangeInput}
              value={this.state.title}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='detail'>레슨설명</label>
            <input type='text' className='form-control'
              id='detail' onChange={this._handleOnChangeInput}
              value={this.state.detail} />
          </div>
          <div className='form-group'>
            <label htmlFor='mainCategory'>메인카테고리</label>
            <select className='form-control' id='mainCategory'
              onChange={this._handleOnChangeInput} value={this.state.mainCategory}>
              <option value='분류선택' disabled>분류선택</option>
              <option value='취미반'>취미반</option>
              <option value='창업반'>창업반</option>
              <option value='원데이레슨'>원데이레슨</option>
              <option value='웨딩반'>웨딩반</option>
            </select>
          </div>
          {/* <div className='form-group'>
            <label htmlFor='subCategory'>서브카테고리</label>
            <input type='text' className='form-control'
              id='subCategory' onChange={this._handleOnChangeInput}
              value={this.state.subCategory} />
          </div> */}
          <div className='form-group'>
            <label htmlFor='groupName'>그룹이름</label>
            <input type='text' className='form-control'
              id='groupName' onChange={this._handleOnChangeInput} placeholder='입력하지 않을 경우 레슨제목과 같음'
              value={this.state.groupName} />
          </div>
          <div className='form-group'>
            <label htmlFor='location'>지역</label>
            <input type='text' className='form-control'
              id='location' onChange={this._handleOnChangeInput}
              value={this.state.location} />
          </div>
          <div className='form-inline' role='form'>
            <div className='form-group'>
              <span>주소</span><br />
              <input type='text' className='form-control'
                id='postCode' placeholder='우편번호' style={{ marginRight: '3px' }}
                readOnly value={this.state.postCode} />
              <button type='button' className='btn btn-default' id='searchPostCodeBtn'
                onClick={this._handleOnClickPostCode}>우편번호찾기</button><br />
              <div id='postWrapper'
                style={{ display: 'none', border: '1px solid', maxWidth: window.innerWidth, height: '300px', margin: '5px 0', position: 'relative' }}
              >
                <img src='//i1.daumcdn.net/localimg/localimages/07/postcode/320/close.png' id='btnFoldWrap'
                  style={{ cursor: 'pointer', position: 'absolute', right: '0px', top: '-1px', zIndex: '1' }}
                  onClick={this._handleOnCLickFold}
                  alt='접기버튼' />
              </div>
              <input type='text' className='form-control'
                id='address' placeholder='상세주소' style={{ width: '100%' }} readOnly value={this.state.address} />
              <input type='text' className='form-control' onChange={this._handleOnChangeInput}
                id='restAddress' placeholder='나머지주소' value={this.state.restAddress} style={{ width: '100%' }} />
              <input type='text' className='form-control' readOnly
                id='latitude' value={this.state.latitude} placeholder='경도' />
              <input type='text' className='form-control' readOnly
                id='longitude' value={this.state.longitude} placeholder='위도' />
            </div>
          </div>
          <p />
          <TextField
            id='maxParty'
            label='최대인원'
            onChange={this._handleOnChangeInput}
            value={this.state.maxParty}
            type='number'
          />
          <TextField
            id='currParty'
            label='현재인원'
            onChange={this._handleOnChangeInput}
            value={this.state.currParty}
            type='number'
          />
          <TextField
            id='titleImg'
            label='대표이미지'
            type='file'
            accept='image/*'
            imgInfo={this.props.lesson ? this.props.lesson.titleImg : null}
          />
          <TextField
            id='price'
            label='가격'
            onChange={this._handleOnChangeInput}
            value={this.state.price}
            type='number'
          />
          <TextField
            id='discountedPrice'
            label='할인가 (할인해서 판매할 경우만 수정, 할인 안할 경우 가격과 같음)'
            onChange={this._handleOnChangeInput}
            value={this.state.discountedPrice}
            type='number'
          />
          <div className='form-group'>
            <label htmlFor='tutorId'>강사</label>
            <select id='tutorId' className='form-control' value={this.state.tutorId}
              onChange={this._handleOnChangeInput}>
              {renderTutorList()}
            </select>
          </div>
          {/* <Checkbox
            id='oneday'
            onChange={this._handleOnChangeCheckbox}
            checked={this.state.oneday ? 'checked' : ''}
            label='원데이레슨'
          /> */}
          <label htmlFor='lessonDate'>{this.state.oneday ? '레슨날짜' : '레슨시작일'}</label>
          <DatePicker
            id='lessonDate'
            onChange={this._handleOnChangeDate}
            value={this.state.lessonDate}
          />
          <p />
          {this.state.oneday &&
            (
              <div>
                <label htmlFor='startTime'>시작시간</label>
                <TimePicker
                  id='startTime'
                  hour={this.state.startTime.hour}
                  min={this.state.startTime.min}
                  amPm={this.state.startTime.amPm}
                  type='startTime'
                  onChangeHour={this._handleOnChangeHour}
                  onChangeMin={this._handleOnChangeMin}
                  onClickAmPm={this._handleOnClickAmPm}
                />
                <p />
                <label htmlFor='endTime'>종료시간</label>
                <TimePicker
                  id='endTime'
                  hour={this.state.endTime.hour}
                  min={this.state.endTime.min}
                  amPm={this.state.endTime.amPm}
                  type='endTime'
                  onChangeHour={this._handleOnChangeHour}
                  onChangeMin={this._handleOnChangeMin}
                  onClickAmPm={this._handleOnClickAmPm}
                />
              </div>
            )
          }
          {
            _renderLessonDays()
          }
          <div className='form-group'>
            <label htmlFor='level'>난이도</label>
            <select id='level' className='form-control' value={this.state.level}
              onChange={this._handleOnChangeInput}>
              <option value='1'>초급</option>
              <option value='2'>중급</option>
              <option value='3'>고급</option>
              <option value='4'>초급 + 중급</option>
              <option value='5'>중급 + 고급</option>
              <option value='6'>초급 + 중급 + 고급</option>
            </select>
          </div>
          <label htmlFor='content'>내용</label>
          <textarea id='content' defaultValue={this.state.content} />
          <Checkbox
            id='expired'
            onChange={this._handleOnChangeCheckbox}
            checked={this.state.expired ? 'checked' : ''}
            label='기간만료'
          />
          <Checkbox
            id='activated'
            onChange={this._handleOnChangeCheckbox}
            checked={this.state.activated ? 'checked' : ''}
            label='노출활성화'
          />
          {/* <button type='button' className='btn btn-default' style={{ marginRight: '3px' }}
            onClick={this._handleOnClickSubmit}>{this.state.mode !== 'register' ? '수정' : '등록'}</button> */}
          <Button onClick={this._handleOnClickSubmit} process={this.state.process} style={{ marginRight: '3px' }}
            textComponent={<span>{this.state.mode !== 'register' ? '수정' : '등록'}</span>} />
          {this.state.mode === 'update' &&
            <button type='button' className='btn btn-grey' style={{ marginRight: '3px' }}
              onClick={this._handleOnClickDelete}>삭제</button>}
          <Link to='/admin/lesson'>
            <button type='button' className='btn btn-default'>목록</button>
          </Link>
        </form>
      </div>
    )
  }
}

LessonListView.propTypes = {
  params: React.PropTypes.object.isRequired,
  fetchLesson: React.PropTypes.func.isRequired,
  lesson: React.PropTypes.object,
  clearLesson: React.PropTypes.func.isRequired
}

LessonListView.contextTypes = {
  router: React.PropTypes.object
}

export default LessonListView
