import React from "react";
import "./App.css";
import {
  parseFunction,
  parseName,
  parseArgument,
  parseBody,
} from "./parseFunction.js";
import { Chart } from "react-google-charts";

import { analyseFunction } from "./analyseFunction.js";

class App extends React.Component {
  state = {
    graphShown: false,
    graphData: [[]],
  };

  static defaultCode = `function fib(n) {
    if (n <= 1) {
      return n;
    }

    return fib(n - 1) + fib(n - 2);
  }`;

  render() {
    return (
      <div className="App">
        <p>Hello there!</p>

        <br />

        <div className="row">
          <textarea
            id="editor"
            className="bubble"
            defaultValue={App.defaultCode}
          ></textarea>
          <p id="log" className="bubble"></p>
        </div>

        <br />

        <button onClick={this.analyseCode}>Analyse</button>

        {this.renderGraph()}
      </div>
    );
  }

  renderGraph = () => {
    return this.state.graphShown ? (
      <Chart
        chartType="ScatterChart"
        data={this.state.graphData}
        width="100%"
        height="80vh"
      />
    ) : null;
  };

  analyseCode = () => {
    const code = document.getElementById("editor").value;
    const fn = parseFunction(code);
    const inputRuntimes = analyseFunction(fn, this.addToLog);
    this.plotGraph(inputRuntimes);
  };

  addToLog = (entry) => {
    document.getElementById("log").textContent += entry + "\n";
  };

  plotGraph = (inputRuntimes) => {
    const headings = ["Input size", "Runtime"];
    const graphData = [headings, ...inputRuntimes];
    this.setState({ graphShown: true, graphData: graphData });
  };
}

export default App;

/* TODO:

Optimisation: reduce DOM traversal by storing consts pointing to elems

*/

/* Some fun functions:

function sumTo(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
      sum += i;
    }

    return sum;
}

function square(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      sum++;
    }
  }

  return sum;
}

function cube(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      for (let k = 1; k <= n; k++) {
        sum++;
      }
    }
  }

  return sum;
}

function fib(n) {
  if (n <= 1) {
    return n;
  }

  return fib(n - 1) + fib(n - 2);
}

*/
