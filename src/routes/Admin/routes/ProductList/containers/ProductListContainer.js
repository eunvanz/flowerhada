import { connect } from 'react-redux'
import { fetchProducts } from 'store/product'

import ProductListView from '../components/ProductListView'

const mapDispatchToProps = {
  fetchProducts
}

const mapStateToProps = (state) => ({
  productList : state.product.productList
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductListView)
