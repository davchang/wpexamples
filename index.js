import React from "react";
import ReactDOM from "react-dom"

import Helloworld from "./src/apps/helloWorld"

const App = () => (
  <Helloworld />
)

// const App = () => (
//   <PostFoundationSolutionSelector />
// )

ReactDOM.render(<App />, document.getElementById('main'));
