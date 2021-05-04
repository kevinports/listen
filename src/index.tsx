import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Main } from './components/Main';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/" component={Main} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);