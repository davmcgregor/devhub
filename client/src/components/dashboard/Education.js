import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import moment from 'moment'
import { connect } from 'react-redux'
import { deleteEducation } from '../../actions/profile'

const Education = ({ education, deleteEducation }) => {
  
  const educations = education.map(edu => (
    <tr key={edu.id}>
      <td>{edu.school}</td>
      <td className="hide-sm">{edu.degree}</td>
      <td>
        <Moment format="YYYY/MM/DD">{moment.utc(edu.edu_from)}</Moment> -{' '}
        {edu.edu_to === "" ? (
          ' Current'
        ) : (
          <Moment format="YYYY/MM/DD">{moment.utc(edu.edu_to)}</Moment>
        )}
      </td>
      <td>
        <button
          onClick={() => deleteEducation(edu.id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </td>
    </tr>
  ))

  return (
    <Fragment>
      <h2 className="my-2">Education Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{education.length > 0 ? educations : null}</tbody>
      </table>
    </Fragment>
  )
}

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired
}

export default connect(null, { deleteEducation })(Education)
