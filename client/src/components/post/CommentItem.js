import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Moment from 'react-moment'
import { deleteComment } from '../../actions/post'

const CommentItem = ({
  postId,
  comment: { id, text, name, avatar, user_id, created_at },
  auth,
  deleteComment
}) => {
  return (
    <div class="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user_id}`}>
          <img class="round-img" src={avatar} alt="" />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p class="my-1">{text}</p>
        <p class="post-date">
          Posted on <Moment format="YYYY-MM-DD HH:mm">{created_at}</Moment>
        </p>
        {!auth.loading && user_id === auth.user.id && (
          <button
            onClick={e => deleteComment(postId, id)}
            type="button"
            className="btn btn-danger"
          >
            <div className="i fas fa-times"></div>
          </button>
        )}
      </div>
    </div>
  )
}

CommentItem.propTypes = {
  postId: PropTypes.number.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { deleteComment })(CommentItem)
