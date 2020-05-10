import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Landing from '../routes/Landing'
import Adoption from '../routes/Adoption'

function Root() {
  return (
    <main aria-live='polite'>
      <Switch>
        <Route exact path='/' component={Landing} />
        <Route exact path='/adoption' component={Adoption} />
      </Switch>
    </main>
  )
}

export default Root
