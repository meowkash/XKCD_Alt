import './App.css'
import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './screens/Home'
import Favorites from './screens/Favorites'
import Settings from './screens/Settings'

const App = () => {
  return (
    <Router>
      <Route exact path='/' component={Home} />
      <Route exact path='/favorites' component={Favorites} />
      <Route exact path='/settings' component={Settings} />
    </Router>
  )
}

export default App