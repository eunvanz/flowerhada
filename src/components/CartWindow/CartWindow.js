import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { convertNumberAmountToTextAmount } from 'common/util'
import keygen from 'keygenerator'

class CartWindow extends React.Component {
  render () {
    const { items } = this.props
    const renderList = () => {
      return items.map(item => {
        return (
          <tr key={keygen._()}>
            <td className='quantity'>{item.quantity}</td>
            <td className='product'>
              <Link to={`/item/${item.lessonId ? 'lesson' : 'product'}/${item.lessonId || item.productId}`}>
                {item.lesson ? item.lesson.title : item.product.title}
              </Link>
            </td>
            <td className='amount'>{convertNumberAmountToTextAmount(item.totalAmount)}만원</td>
          </tr>
        )
      })
    }
    return (
      <ul className='dropdown-menu dropdown-menu-right dropdown-animation cart'>
        <li>
          {items && items.length > 0 &&
            <div>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th className='quantity' style={{ width: '60px' }}>수량</th>
                    <th className='product'>상품</th>
                    <th className='amount' style={{ width: '100px' }}>합계</th>
                  </tr>
                </thead>
                <tbody>
                  {renderList()}
                  <tr>
                    <td className='total-quantity' colSpan='2'>
                      총 <span className='text-default'>{items.length}</span>개의 아이템
                    </td>
                    <td className='total-amount'>
                      <span className='text-default'>
                        {convertNumberAmountToTextAmount(items.reduce((acc, items) => {
                          return acc + items.totalAmount
                        }, 0))}
                      </span>만원
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className='panel-body text-right'>
                <Link to='/cart/saved' className='btn btn-group btn-gray btn-sm' onClick={() => console.log('clicked')}>
                  자세히보기
                </Link>
                <Link to='/cart/checkout' className='btn btn-group btn-gray btn-sm'>
                  주문하기
                </Link>
              </div>
            </div>
          }
          {(!items || items.length === 0) &&
            <div className='text-center' style={{ margin: '20px' }}>
              <i className='fa fa-exclamation-circle' /> 장바구니가 비어있습니다.
            </div>
          }
        </li>
      </ul>
    )
  }
}

CartWindow.propTypes = {
  items: PropTypes.array
}

export default CartWindow
