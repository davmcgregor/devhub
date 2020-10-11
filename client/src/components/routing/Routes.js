import React from 'react'
import { Route, Switch } from 'react-router-dom'

import {
  Register,
  Login,
  Alert,
  Dashboard,
  ProfileForm,
  AddExperience,
  AddEducation,
  PrivateRoute
} from '../index'

const Routes = props => {
  return (
    <section className="container">
      <Alert />
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/create-profile" component={ProfileForm} />
        <PrivateRoute exact path="/edit-profile" component={ProfileForm} />
        <PrivateRoute exact path="/add-experience" component={AddExperience} />
        <PrivateRoute exact path="/add-education" component={AddEducation} />
      </Switch>
    </section>
  )
}

export default Routes
