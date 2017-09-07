import React, { PropTypes } from 'react'
import Image from 'react-image'
import Loading from 'components/Loading'

class Img extends React.Component {
  render () {
    const { src, ...rest } = this.props
    return (
      <Image
        src={[src]}
        loader={<Loading text='이미지를 불러오는 중...' />}
        {...rest}
      />
    )
  }
}

Img.propTypes = {
  src: PropTypes.string.isRequired
}

export default Img
