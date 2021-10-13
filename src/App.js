import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'
import NFTVerifier from './component/NFTVerifier';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' component={NFTVerifier} />
      </Switch>
    </Router>
  );
}

export default App;
