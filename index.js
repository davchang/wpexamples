import React from "react"
import ReactDOM from "react-dom"

import Helloworld from "./src/apps/helloWorld"
import './src/globals/scss/style.scss'

const App = () => (
  <Helloworld />
)

// const App = () => (
//   <PostFoundationSolutionSelector />
// )

ReactDOM.render(<App />, document.getElementById('main'));
