import { connect } from 'react-redux'
import { fetchProduct, clearProduct } from '../modules/productRegister'

import ProductRegisterView from '../components/ProductRegisterView'

const mapDispatchToProps = {
  fetchProduct,
  clearProduct
}

const mapStateToProps = (state) => ({
  product : state.productRegister
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductRegisterView)
