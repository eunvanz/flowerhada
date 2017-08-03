import { connect } from 'react-redux'

import GalleryView from '../components/GalleryView'

const mapDispatchToProps = {
}

const mapStateToProps = (state) => ({
  authUser: state.authUser
})

export default connect(mapStateToProps, mapDispatchToProps)(GalleryView)
