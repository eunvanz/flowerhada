import React, { PropTypes } from 'react'
import CustomModal from 'components/CustomModal'

class MapModal extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'MapModal'
    this.state = {
      showModal: false
    }
  }
  componentWillReceiveProps (nextProps) {
    this.setState({ showModal: nextProps.show })
  }
  componentDidUpdate () {
    if (document.getElementById('map')) {
      const container = document.getElementById('map')
      const mapCenter = new window.daum.maps.LatLng(this.props.latitude, this.props.longitude)
      const options = { center: mapCenter, level: 3 }
      const map = new window.daum.maps.Map(container, options)
      const marker = new window.daum.maps.Marker({
        position: mapCenter,
        map: map
      })
      const label = new window.daum.maps.InfoWindow({
        position: mapCenter,
        content: this.props.label
      })
      label.open(map, marker)
    }
  }
  render () {
    const bodyComponent = () => {
      return (
        <div id='map' style={{ height: '500px' }}></div>
      )
    }
    const footerComponent = () => {
      return (
        <div style={{ textAlign: 'right' }}>
          <button className='btn btn-dark btn-sm' onClick={this.props.close}>닫기</button>
        </div>
      )
    }
    return (
      <div>
        <CustomModal show={this.state.showModal}
          bodyComponent={bodyComponent()}
          footerComponent={footerComponent()}
          title='찾아오는 길'
          close={this.props.close}
          backdrop
          width='1024px'
        />
      </div>
    )
  }
}

MapModal.propTypes = {
  show: PropTypes.bool.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  close: PropTypes.func
}

export default MapModal
