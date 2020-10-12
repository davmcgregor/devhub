import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  REMOVE_EXPERIENCE,
  ACCOUNT_DELETED,
  GET_REPOS
} from '../actions/types'

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}
}

export default function (state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      }
    case REMOVE_EXPERIENCE:
      ...state  
      return state.profile.profile.filter(experience => experience.id !== payload)
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false
      }
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      }
    case ACCOUNT_DELETED:
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false
      }
    case GET_REPOS:
      return {
        ...state,
        repos: payload,
        loading: false
      }
    default:
      return state
  }
}
