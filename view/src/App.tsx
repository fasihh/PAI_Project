import React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Graphs from "./Components/Graphs";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path='/'>
            <Graphs />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
