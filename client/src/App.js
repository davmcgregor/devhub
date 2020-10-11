import React, { useEffect, Fragment } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { Navbar, Landing, Routes } from './components'

// Redux
import { Provider } from 'react-redux'
import store from './store'
import { LOGOUT } from './actions/types'
import { loadUser } from './actions/auth'
import setAuthToken from './utils/setAuthToken'

import './App.css'

const App = () => {
  useEffect(() => {
    // check for token in LS
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }
    store.dispatch(loadUser())

    // log user out from all tabs if they log out in one tab
    window.addEventListener('storage', () => {
      if (!localStorage.token) store.dispatch({ type: LOGOUT })
    })
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  )
}

export default App
