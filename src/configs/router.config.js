import React from 'react'
import {BrowserRouter  as Router, Route, Switch ,Redirect} from 'react-router-dom'

import * as base from '../pages/'

// 注意，嵌套路由的Route不能加 exact,否则无法检测到子集
export default () => (
  <Router >
    <Switch>
      <Redirect exact to="/login" from="/" /> 
      <Route exact path="/login" component={base.login} />
      <Route exact path="/home" component={base.home} />
      <Route path="*" component={base.notfound} />
    </Switch>
  </Router>
)