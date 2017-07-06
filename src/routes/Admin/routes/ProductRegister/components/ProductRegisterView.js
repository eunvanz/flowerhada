import React from 'react'
import { Link } from 'react-router'
import { setInlineScripts, resizeImage } from 'common/util'
import Button from 'components/Button'
import TextField from 'components/TextField'
import Checkbox from 'components/Checkbox'
import { putProduct, postProduct, deleteProduct } from 'common/ProductService'
import { putOption, postOption, deleteOption } from 'common/OptionService'
import { postLessonImage } from 'common/LessonService'
import $ from 'jquery'
import keygen from 'keygenerator'

class ProductListView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      detail: '',
      mainCategory: '꽃다발',
      subCategory: '',
      content: '내용을 입력해주세요.',
      // titleImg: '',
      // images: ['', '', '', '', ''],
      price: '',
      discountedPrice: '',
      groupName: '',
      relationName: '',
      soldout: false,
      activated: true,
      deliveryType: '퀵',
      mode: this.props.params.id === 'register' ? 'register' : 'update',
      process: false,
      numberOfOptions: 0,
      options: []
    }
    this._handleOnChangeCheckbox = this._handleOnChangeCheckbox.bind(this)
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnClickSubmit = this._handleOnClickSubmit.bind(this)
    this._handleOnClickDelete = this._handleOnClickDelete.bind(this)
    this._isValidForm = this._isValidForm.bind(this)
    this._handleOnClickAddOption = this._handleOnClickAddOption.bind(this)
    this._handleOnClickDeleteOption = this._handleOnClickDeleteOption.bind(this)
    this._handleOnChangeOptionInput = this._handleOnChangeOptionInput.bind(this)
    // this._handleOnChangeImage = this._handleOnChangeImage.bind(this)
  }
  componentDidMount () {
    if (this.state.mode === 'update') {
      this.props.fetchProduct(this.props.params.id)
      .then(() => {
        this.setState(Object.assign({}, this.props.product, { images: this.props.product.images.indexOf('[') > -1 ? JSON.parse(this.props.product.images) : ['', '', ''] }))
        this.setState({ numberOfOptions: this.props.product.options.length })
        $('#content').val(this.state.content)
        const scripts = ['//cdn.tinymce.com/4/tinymce.min.js',
          '/template/js/inline-lesson-register-view.js']
        setInlineScripts(scripts)
      })
    } else {
      const scripts = ['//cdn.tinymce.com/4/tinymce.min.js',
        '/template/js/inline-lesson-register-view.js']
      setInlineScripts(scripts)
    }
  }
  componentWillUnmount () {
    this.props.clearProduct()
  }
  _handleOnChangeInput (e) {
    e.preventDefault()
    const { id, value } = e.target
    if (id === 'price') {
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
  _isValidForm () {
    let message = ''
    const { title, detail, price, discountedPrice } = this.state
    const titleImage = document.getElementById('titleImg').files[0] || this.props.product
    const images1 = document.getElementById('images1').files[0] || this.props.product
    const images2 = document.getElementById('images2').files[0] || this.props.product
    const images3 = document.getElementById('images3').files[0] || this.props.product
    if (title === '') message = '레슨제목을 입력해주세요.'
    else if (detail === '') message = '레슨설명을 입력해주세요.'
    else if (!titleImage) message = '대표이미지를 선택해주세요.'
    else if (!images1 || !images2 || !images3) message = '이미지를 모두 선택해주세요.'
    else if (price === '') message = '가격을 입력해주세요.'
    else if (discountedPrice === '') message = '할인가를 입력해주세요.'
    if (message !== '') {
      alert(message)
      return false
    }
    return true
  }
  _handleOnClickSubmit (e) {
    if (!this._isValidForm()) return
    this.setState({ process: true })
    e.preventDefault()
    const product = new URLSearchParams()
    product.append('title', $('#title').val())
    product.append('detail', $('#detail').val())
    product.append('mainCategory', $('#mainCategory').val())
    product.append('subCategory', $('#subCategory').val())
    product.append('groupName', $('#groupName').val() === '' ? this.state.title : this.state.groupName)
    product.append('relationName', $('#relationName').val())
    product.append('price', $('#price').val())
    product.append('discountedPrice', $('#discountedPrice').val())
    product.append('soldout', $('#soldout').prop('checked'))
    product.append('content', window.tinymce.get('content').getContent())
    product.append('activated', $('#activated').prop('checked'))
    // product.append('titleImg', $('#titleImg').val())
    // product.append('images', JSON.stringify(removeEmptyIndex(this.state.images)))
    product.append('deliveryType', this.state.deliveryType)
    let action = putProduct
    if (this.state.mode === 'register') {
      action = postProduct
    }
    let titleImgFile = document.getElementById('titleImg').files[0]
    if (titleImgFile) titleImgFile = resizeImage(titleImgFile, 800)
    const imageFiles = []
    for (let i = 0; i < 3; i++) {
      imageFiles.push(document.getElementById(`images${i + 1}`).files[0])
    }
    const postTitleImg = titleImgFile ? postLessonImage(titleImgFile) : Promise.resolve()
    const postImages = imageFiles.map(imageFile => {
      if (imageFile) {
        imageFile = resizeImage(imageFile)
        return postLessonImage(imageFile)
      } else {
        return imageFile
      }
    })
    const images = ['', '', '', '']
    postTitleImg
    .then(res => {
      if (res) {
        const imgUrl = res.data.data.link
        product.append('titleImg', imgUrl)
        images[0] = imgUrl
      } else {
        product.append('titleImg', this.props.product.titleImg)
        images[0] = this.props.product.titleImg
      }
      return Promise.resolve()
    })
    .then(() => {
      return postImages.reduce((prev, postImage, idx) => {
        return prev.then(() => {
          if (!postImage) {
            images[idx + 1] = this.props.product ? JSON.parse(this.props.product.images)[idx + 1] : ''
            return Promise.resolve()
          } else {
            return postImage.then(res => {
              const imgUrl = res.data.data.link
              images[idx + 1] = imgUrl
              return Promise.resolve()
            })
          }
        })
      }, Promise.resolve())
    })
    .then(() => {
      product.append('images', JSON.stringify(images))
      return action(product, this.props.params.id)
    })
    .then(res => {
      if (this.state.options.length > 0) {
        const productId = res.data.id
        const promArr = this.state.options.map(option => {
          option.productId = productId
          if (!isNaN(parseInt(option.id))) return () => putOption(option)
          else {
            option.id = 0
            return () => postOption(option)
          }
        })
        return promArr.reduce((prev, prom) => prev.then(prom), Promise.resolve())
      } else {
        return Promise.resolve()
      }
    })
    .then(() => {
      this.setState({ process: false })
      this.context.router.push('/admin/product')
    })
  }
  _handleOnClickDelete () {
    deleteProduct(this.props.params.id)
    // .then(() => {
    //   return deleteProductDayByProductId(this.props.params.id)
    // })
    .then(() => {
      this.context.router.push('/admin/product')
    })
  }
  _handleOnClickAddOption () {
    this.setState({ numberOfOptions: this.state.numberOfOptions + 1 })
    const options = this.state.options
    options.push({
      id: keygen._(),
      productId: this.props.product ? this.props.product.id : null,
      category: '',
      name: '',
      addPrice: 0
    })
    this.setState({ options })
  }
  _handleOnClickDeleteOption (id) {
    if (typeof id === 'number') {
      deleteOption(id)
    }
    const options = this.state.options.filter(option => option.id !== id)
    this.setState({ options, numberOfOptions: this.state.numberOfOptions - 1 })
  }
  _handleOnChangeOptionInput (e) {
    const { type, id } = e.target.dataset
    let { options } = this.state
    options = options.map(option => {
      if (option.id == id) {
        option[type] = e.target.value
      }
      return option
    })
    this.setState({ options })
  }
  // _handleOnChangeImage (e) {
  //   const idx = e.target.id.substr(-1)
  //   const images = this.state.images.slice(0)
  //   images[idx] = e.target.value
  //   this.setState({ images })
  // }
  render () {
    const renderSubCategory = () => {
      if (this.state.mainCategory === '꽃다발') {
        return [
          <option key='1' value='이벤트꽃다발'>이벤트꽃다발</option>,
          <option key='2' value='단체꽃다발'>단체꽃다발</option>
        ]
      } else if (this.state.mainCategory === '웨딩') {
        return [
          <option key='1' value='부케'>부케</option>,
          <option key='2' value='소품'>소품</option>,
          <option key='3' value='공간장식'>공간장식</option>
        ]
      }
    }
    const renderOptionForm = () => {
      const returnComponent = []
      for (let i = 0; i < this.state.numberOfOptions; i++) {
        returnComponent.push(
          <div key={i}>
            <TextField
              id={`option-category-${i + 1}`}
              label={`카테고리 #${i + 1}`}
              dataId={this.state.options[i].id}
              dataType='category'
              onChange={this._handleOnChangeOptionInput}
              value={this.state.options[i].category}
            />
            <TextField
              id={`option-name-${i + 1}`}
              label={`옵션명 #${i + 1}`}
              dataId={this.state.options[i].id}
              dataType='name'
              onChange={this._handleOnChangeOptionInput}
              value={this.state.options[i].name}
            />
            <TextField
              id={`option-price-${i + 1}`}
              label={`추가가격 #${i + 1}`}
              dataId={this.state.options[i].id}
              dataType='addPrice'
              onChange={this._handleOnChangeOptionInput}
              value={this.state.options[i].addPrice}
              type='number'
            />
            <Button
              textComponent={<span>{`옵션 #${i + 1} 삭제`}</span>} size='sm'
              onClick={() => this._handleOnClickDeleteOption(this.state.options[i].id)} />
          </div>
        )
      }
      return returnComponent
    }
    return (
      <div>
        <form role='form'>
          <div className='form-group'>
            <TextField
              id='title'
              label='상품명'
              onChange={this._handleOnChangeInput}
              value={this.state.title}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='detail'>상품설명</label>
            <input type='text' className='form-control'
              id='detail' onChange={this._handleOnChangeInput}
              value={this.state.detail} />
          </div>
          <div className='form-group'>
            <label htmlFor='mainCategory'>메인카테고리</label>
            <select id='mainCategory' className='form-control' style={{ marginRight: '3px' }}
              onChange={this._handleOnChangeInput} value={this.state.mainCategory}>
              <option value='꽃다발'>꽃다발</option>
              <option value='웨딩'>웨딩</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='subCategory'>서브카테고리</label>
            <select id='subCategory' className='form-control' style={{ marginRight: '3px' }}
              onChange={this._handleOnChangeInput} value={this.state.subCategory}>
              {renderSubCategory()}
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='groupName'>그룹이름</label>
            <input type='text' className='form-control' placeholder='입력하지 않을 경우 상품명과 같음'
              id='groupName' onChange={this._handleOnChangeInput}
              value={this.state.groupName} />
          </div>
          <div className='form-group'>
            <label htmlFor='groupName'>관련상품군이름</label>
            <input type='text' className='form-control'
              id='relationName' onChange={this._handleOnChangeInput}
              value={this.state.relationName} />
          </div>
          <p />
          <TextField
            id='titleImg'
            label='대표이미지'
            type='file'
            accept='image/*'
            imgInfo={this.props.product && this.props.product.titleImg ? this.props.product.titleImg : null}
          />
          <TextField
            id='images1'
            label='이미지1'
            type='file'
            accept='image/*'
            imgInfo={this.props.product && this.props.product.images ? JSON.parse(this.props.product.images)[1] : null}
          />
          <TextField
            id='images2'
            label='이미지2'
            type='file'
            accept='image/*'
            imgInfo={this.props.product && this.props.product.images ? JSON.parse(this.props.product.images)[2] : null}
          />
          <TextField
            id='images3'
            label='이미지3'
            type='file'
            accept='image/*'
            imgInfo={this.props.product && this.props.product.images ? JSON.parse(this.props.product.images)[3] : null}
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
            label='할인가'
            onChange={this._handleOnChangeInput}
            value={this.state.discountedPrice}
            type='number'
          />
          <div className='form-group'>
            <label>옵션</label> <Button textComponent={<span>옵션추가</span>} size='sm' onClick={this._handleOnClickAddOption} />
            <div>
              {renderOptionForm()}
            </div>
          </div>
          <Checkbox
            id='soldout'
            onChange={this._handleOnChangeCheckbox}
            checked={this.state.soldout ? 'checked' : ''}
            label='판매종료'
          />
          <Checkbox
            id='activated'
            onChange={this._handleOnChangeCheckbox}
            checked={this.state.activated ? 'checked' : ''}
            label='노출'
          />
          <div className='form-group'>
            <label htmlFor='groupName'>배송타입</label>
            <select id='deliveryType' className='form-control'
              onChange={this._handleOnChangeInput} value={this.state.deliveryType}
            >
              <option value='퀵'>퀵</option>
              <option value='택배'>택배</option>
            </select>
          </div>
          <label htmlFor='content'>내용</label>
          <textarea id='content' defaultValue={this.state.content} />
          {/* <button type='button' className='btn btn-default' style={{ marginRight: '3px' }}
            onClick={this._handleOnClickSubmit}>{this.state.mode !== 'register' ? '수정' : '등록'}</button> */}
          <Button onClick={this._handleOnClickSubmit} process={this.state.process} style={{ marginRight: '3px' }}
            textComponent={<span>{this.state.mode !== 'register' ? '수정' : '등록'}</span>} />
          {this.state.mode === 'update' &&
            <button type='button' className='btn btn-grey' style={{ marginRight: '3px' }}
              onClick={this._handleOnClickDelete}>삭제</button>}
          <Link to='/admin/product'>
            <button type='button' className='btn btn-default'>목록</button>
          </Link>
        </form>
      </div>
    )
  }
}

ProductListView.propTypes = {
  params: React.PropTypes.object.isRequired,
  fetchProduct: React.PropTypes.func.isRequired,
  product: React.PropTypes.object,
  clearProduct: React.PropTypes.func.isRequired
}

ProductListView.contextTypes = {
  router: React.PropTypes.object
}

export default ProductListView
