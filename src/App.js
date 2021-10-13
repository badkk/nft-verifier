import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'
import Home from './component/Home';
import NFTVerifier from './component/NFTVerifier';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/:cid' component={NFTVerifier} />
      </Switch>
    </Router>
  );
}

export default App;
