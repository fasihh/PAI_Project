import React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import EdaGraphs from "./Components/EdaGraphs";
import KnnGraphs from "./Components/KnnGraphs";
import Home from "./Components/Home";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route exact path='/eda'>
            <EdaGraphs />
          </Route>
          <Route exact path='/knn'>
            <KnnGraphs />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
