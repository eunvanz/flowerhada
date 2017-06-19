import React, { PropTypes } from 'react'
import Parallax from 'components/Parallax'
import numeral from 'numeral'
import $ from 'jquery'
import { Tooltip } from 'react-bootstrap'
import Button from 'components/Button'
import DatePicker from 'components/DatePicker'
import { postCart } from 'common/CartService'
import keygen from 'keygenerator'

class GroupFlowerView extends React.Component {
  constructor (props) {
    super(props)
    let date = new Date()
    date = new Date(date.valueOf() + (24 * 60 * 60 * 1000 * 2))
    this.state = {
      itemPrice: 25000,
      quantity: 1,
      receiveDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      receiveTime: '오전 10시 ~ 오전 12시',
      receiveArea: { name: '서울', price: 0 }
    }
    this._handleOnBlurQuantity = this._handleOnBlurQuantity.bind(this)
    this._handleOnChangeQuantity = this._handleOnChangeQuantity.bind(this)
    this._getTotalPrice = this._getTotalPrice.bind(this)
    this._renderPointInfo = this._renderPointInfo.bind(this)
    this._handleOnClickAddToCart = this._handleOnClickAddToCart.bind(this)
    this._handleOnClickBuy = this._handleOnClickBuy.bind(this)
  }
  _handleOnBlurQuantity (e) {
    let quantity = e.target.value
    if (quantity < 1) quantity = 1
    this.setState({ quantity })
  }
  _handleOnChangeQuantity (e) {
    let quantity = e.target.value
    // if (quantity < 1) quantity = 1
    this.setState({ quantity })
  }
  _getTotalPrice = () => {
    return this.state.itemPrice * this.state.quantity
  }
  _renderPointInfo () {
    const priceArea = $('#priceArea').position()
    if (priceArea) {
      const positionLeft = priceArea.left + 65
      const positionTop = priceArea.top - 32
      return (
        <Tooltip positionLeft={positionLeft} positionTop={positionTop} placement='top' id='point-info' className='in'
          style={{ zIndex: '99' }}>
          <span className='text-default'>+{numeral(this._getTotalPrice() * 0.01).format('0,0')}P</span> 적립
        </Tooltip>
      )
    }
  }
  _handleOnClickAddToCart () {
    const { user, fetchCartsByUserId } = this.props
    if (!user) {
      this.context.router.push('/login')
      return
    }
    const options = []
    options.push(this.state.option1)
    options.push(this.state.option2)
    options.push(this.state.option3)
    const cart = {
      userId: user.id,
      quantity: this.state.quantity,
      type: '장바구니',
      options: JSON.stringify(options),
      totalAmount: this._getTotalPrice(),
      itemPrice: this.state.itemPrice,
      receiveDate: this.state.receiveDate,
      receiveTime: this.state.receiveTime,
      receiveArea: JSON.stringify(this.state.receiveArea)
    }
    if (params.type === 'lesson') {
      cart.lessonId = item.id
    } else {
      cart.productId = item.id
    }
    postCart(cart)
    .then(() => {
      return fetchCartsByUserId(user.id)
    })
    .then(() => {
      window.scrollTo(0, 0)
      $('.cart-btn').click()
    })
  }
  _handleOnClickBuy () {
    const { item, receiveOrderItem, user, params } = this.props
    const { router } = this.context
    if (!user) {
      router.push('/login')
      return
    }
    const options = []
    options.push(this.state.option1)
    options.push(this.state.option2)
    options.push(this.state.option3)
    const orderItem = {
      userId: user.id,
      lessonId: params.type === 'lesson' ? item.id : null,
      productId: params.type === 'lesson' ? null : item.id,
      quantity: this.state.quantity,
      type: '장바구니',
      options: JSON.stringify(options),
      totalAmount: this._getTotalPrice(),
      itemPrice: this._getItemPrice(),
      receiveDate: this.state.receiveDate,
      receiveTime: this.state.receiveTime,
      receiveArea: JSON.stringify(this.state.receiveArea),
      lesson: params.type === 'lesson' ? item : null,
      product: params.type === 'lesson' ? null : item
    }
    receiveOrderItem(orderItem)
    router.push('/cart/direct')
  }
  render () {
    const renderTimeOptions = () => {
      // TODO 추후 당일 배송 혹은 익일 배송을 위한 로직 필요
      const returnComponent = []
      returnComponent.push(
        <option key={keygen._()} value='오전 10시 ~ 오전 12시'>오전 10시 ~ 오전 12시</option>
      )
      returnComponent.push(
        <option key={keygen._()} value='오후 2시 ~ 오후 4시'>오후 2시 ~ 오후 4시</option>
      )
      returnComponent.push(
        <option key={keygen._()} value='저녁 6시 ~ 저녁 8시'>저녁 6시 ~ 저녁 8시</option>
      )
      return returnComponent
    }
    const renderAreaOptions = () => {
      const returnComponent = []
      returnComponent.push(
        <option key={keygen._()} value='서울:0'>서울 (무료)</option>
      )
      returnComponent.push(
        <option key={keygen._()} value='성남|과천|하남|의왕:10000'>성남|과천|하남|의왕 (+10,000)</option>
      )
      returnComponent.push(
        <option key={keygen._()} value='용인(처인구 제외)|부천|안양|구리|광명|군포:20000'>용인(처인구 제외)|부천|안양|구리|광명|군포 (+20,000)</option>
      )
      returnComponent.push(
        <option key={keygen._()} value='고양|수원|안산|인천(중구,강화군 제외)|광주|의정부:25000'>고양|수원|안산|인천(중구,강화군 제외)|광주|의정부 (+25,000)</option>
      )
      return returnComponent
    }
    const renderParallaxInnerComponent = () => {
      return (
        <div className='container'>
          <div className='row'>
            <div className='main object-non-visible animated object-visible fadeInUpSmall'
              data-animation-effect='fadeInUpSmall' data-effect-delay='100'>
              <div className='form-block center-block p-30 light-gray-bg border-clear' style={{ backgroundColor: 'white' }}>
                <h2 className='title text-center'>뭉치면 싸지는 단체꽃다발</h2>
                <p className='text-center'>주문량에 따라 고퀄리티 꽃다발 최저가 제공</p>
                <div className='row'>
                  <div className='col-sm-12 text-center'>5 다발 이상 - 각 ￦20,000</div>
                </div>
                <div className='row'>
                  <div className='col-sm-12 text-center'>10 다발 이상 - 각 ￦18,000</div>
                </div>
                <div className='row'>
                  <div className='col-sm-12 text-center'>20 다발 이상 - 각 ￦15,000</div>
                </div>
                <div className='row'>
                  <div className='col-sm-12'>
                    <table className='table' style={{ marginTop: '10px', marginBottom: '10px' }}>
                      <tbody>
                        <tr>
                          <td className='text-right hidden-xs' style={{ width: '120px', paddingTop: '18px' }}><strong>희망 수령일</strong></td>
                          <td>
                            <div className='visible-xs' style={{ marginBottom: '6px' }}><strong>희망 수령일</strong></div>
                            <DatePicker
                              id='receiveDate'
                              onChange={this._handleOnChangeDate}
                              value={this.state.receiveDateISO}
                            />
                            <small><i className='fa fa-exclamation-circle' /> 주문과 함께 만들어지기 때문에 최소 이틀이 소요됩니다.</small>
                          </td>
                        </tr>
                        <tr>
                          <td className='text-right hidden-xs' style={{ width: '120px', paddingTop: '18px' }}><strong>희망 수령시간</strong></td>
                          <td>
                            <div className='visible-xs' style={{ marginBottom: '6px' }}><strong>희망 수령시간</strong></div>
                            <select className='form-control' id='receiveTime' style={{ width: '200px' }}
                              value={this.state.receiveTime} onChange={this._handleOnChangeInput}>
                              {renderTimeOptions()}
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <td className='text-right hidden-xs' style={{ width: '120px', paddingTop: '18px' }}><strong>희망 수령지역</strong></td>
                          <td>
                            <div className='visible-xs' style={{ marginBottom: '6px' }}><strong>희망 수령지역</strong></div>
                            <select className='form-control' id='receiveArea' style={{ width: '300px' }}
                              value={`${this.state.receiveArea.name}:${this.state.receiveArea.price}`}
                              onChange={this._handleOnChangeInput}>
                              {renderAreaOptions()}
                            </select>
                            <small><i className='fa fa-exclamation-circle' /> 현재 배송은 서울 및 수도권(일부지역 제외)만 가능합니다.</small>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className='form-group text-right'>
                      {`￦${numeral(this.state.itemPrice).format('0,0')} `}<i className='fa fa-times-circle' />{' '}
                      <input className='' type='number' style={{ width: '50px', paddingRight: '5px', paddingLeft: '5px' }}
                        id='quantity' value={this.state.quantity} onFocus={e => { e.target.value = '' }}
                        onBlur={this._handleOnBlurQuantity} onChange={this._handleOnChangeQuantity} /> 개
                      </div>
                  </div>
                </div>
                <div>
                  <div className='light-gray-bg p-20 bordered clearfix'>
                    <span className='product price' id='priceArea'>
                      {this._renderPointInfo()}
                      <i className='icon-tag pr-10' />￦{numeral(this._getTotalPrice()).format('0,0')}
                    </span>
                    <div className='product elements-list pull-right clearfix'>
                      <Button className='margin-clear' animated onClick={this._handleOnClickAddToCart}
                        textComponent={<span style={{ color: 'white' }}>장바구니에 담기 <i className='fa fa-shopping-cart' /></span>}
                        style={{ marginRight: '3px' }}
                      />
                      <Button className='margin-clear' animated color='dark' onClick={this._handleOnClickBuy}
                        textComponent={<span style={{ color: 'white' }}>바로구매 <i className='fa fa-credit-card-alt' /></span>}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div>
        <Parallax
          innerComponent={renderParallaxInnerComponent()}
          backgroundImage='http://www.freshorigins.com/wp-content/uploads/2013/05/good21-copy.jpg'
          blur={1}
        />
      </div>
    )
  }
}

GroupFlowerView.contextTypes = {
  router: PropTypes.object.isRequired
}

GroupFlowerView.propTypes = {
  user: PropTypes.object,
  fetchCartsByUserId: PropTypes.func.isRequired
}

export default GroupFlowerView
