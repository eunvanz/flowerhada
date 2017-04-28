import React from 'react'
import { Link } from 'react-router'
import { setInlineScripts, removeEmptyIndex } from 'common/util'
import Button from 'components/Button'
import TextField from 'components/TextField'
import Checkbox from 'components/Checkbox'
import { putProduct, postProduct, deleteProduct } from 'common/ProductService'
import { postLessonImage } from 'common/LessonService'
import $ from 'jquery'

class ProductListView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      detail: '',
      mainCategory: '',
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
      process: false
    }
    this._handleOnChangeCheckbox = this._handleOnChangeCheckbox.bind(this)
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnClickSubmit = this._handleOnClickSubmit.bind(this)
    this._handleOnClickDelete = this._handleOnClickDelete.bind(this)
    // this._handleOnChangeImage = this._handleOnChangeImage.bind(this)
  }
  componentDidMount () {
    if (this.state.mode === 'update') {
      this.props.fetchProduct(this.props.params.id)
      .then(() => {
        this.setState(Object.assign({}, this.props.product, { images: this.props.product.images.indexOf('[') > -1 ? JSON.parse(this.props.product.images) : ['', '', ''] }))
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
    this.setState({ [e.target.id]: e.target.value })
    // if (e.target.id === 'titleImg') {
    //   const images = this.state.images.slice(0)
    //   images[0] = e.target.value
    //   this.setState({ images })
    // }
  }
  _handleOnChangeCheckbox (e) {
    this.setState({ [e.target.id]: e.target.checked })
  }
  _handleOnClickSubmit (e) {
    this.setState({ process: true })
    e.preventDefault()
    const product = new URLSearchParams()
    product.append('title', $('#title').val())
    product.append('detail', $('#detail').val())
    product.append('mainCategory', $('#mainCategory').val())
    product.append('subCategory', $('#subCategory').val())
    product.append('groupName', $('#groupName').val())
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
    if (this.state.mode === 'register') action = postProduct

    const titleImgFile = document.getElementById('titleImg').files[0]
    const imageFiles = []
    for (let i = 0; i < 3; i++) {
      imageFiles.push(document.getElementById(`images${i + 1}`).files[0])
    }
    const postTitleImg = titleImgFile ? postLessonImage(titleImgFile) : Promise.resolve()
    const postImages = imageFiles.map(imageFile => {
      if (imageFile) {
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
  // _handleOnChangeImage (e) {
  //   const idx = e.target.id.substr(-1)
  //   const images = this.state.images.slice(0)
  //   images[idx] = e.target.value
  //   this.setState({ images })
  // }
  render () {
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
            <input type='text' className='form-control'
              id='mainCategory' onChange={this._handleOnChangeInput}
              value={this.state.mainCategory} />
          </div>
          <div className='form-group'>
            <label htmlFor='subCategory'>서브카테고리</label>
            <input type='text' className='form-control'
              id='subCategory' onChange={this._handleOnChangeInput}
              value={this.state.subCategory} />
          </div>
          <div className='form-group'>
            <label htmlFor='groupName'>그룹이름</label>
            <input type='text' className='form-control'
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
            imgInfo={this.props.product ? this.props.product.titleImg : null}
          />
          <TextField
            id='images1'
            label='이미지1'
            type='file'
            accept='image/*'
            imgInfo={this.props.product ? JSON.parse(this.props.product.images)[1] : null}
          />
          <TextField
            id='images2'
            label='이미지2'
            type='file'
            accept='image/*'
            imgInfo={this.props.product ? JSON.parse(this.props.product.images)[2] : null}
          />
          <TextField
            id='images3'
            label='이미지3'
            type='file'
            accept='image/*'
            imgInfo={this.props.product ? JSON.parse(this.props.product.images)[3] : null}
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
