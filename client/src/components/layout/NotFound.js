import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

const NotFound = props => {
  return (
    <Fragment>
      <h1 className="x-large text-primary">
        <i className="fas fa-exclamation-triangle"></i> Page Not Found
      </h1>
      <p className="large">Sorry, ths page does not exist</p>
    </Fragment>
  )
}

export default NotFound
