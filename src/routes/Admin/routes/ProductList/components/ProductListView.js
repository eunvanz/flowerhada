import React from 'react'
import { Link } from 'react-router'

class ProductListView extends React.Component {
  componentDidMount () {
    this.props.fetchProducts()
  }
  render () {
    const renderList = () => {
      return this.props.productList.map(product => {
        return (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td><Link to={`/admin/product/${product.id}`}>{product.title}</Link></td>
            <td>{product.detail}</td>
            <td>{product.mainCategory}</td>
            <td>{product.subCategory}</td>
            <td>{product.soldout ? '품절' : '판매중'}</td>
            <td>{product.activated ? '활성' : '비활성'}</td>
          </tr>
        )
      })
    }
    return (
      <div>
        <table className='table'>
          <thead>
            <tr>
              <th>#</th>
              <th>제목</th>
              <th>설명</th>
              <th>카테고리</th>
              <th>서브카테고리</th>
              <th>상태</th>
              <th>노출</th>
            </tr>
          </thead>
          <tbody>
            {this.props.productList && this.props.productList.length > 0 && renderList()}
          </tbody>
        </table>
        <Link to='/admin/product/register'>
          <button className='btn btn-default'>상품등록</button>
        </Link>
      </div>
    )
  }
}

ProductListView.propTypes = {
  productList: React.PropTypes.array.isRequired,
  fetchProducts: React.PropTypes.func.isRequired
}

export default ProductListView
