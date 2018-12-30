function acceptCode() {

  var input = document.getElementById("codeInput").value;

  // grabs prefix until first ( character, e.g. "function   myFunc   "
  // then grabs second word, i.e. the function name
  var funcName = input.substring(0, input.indexOf("(")).split(/\s+/)[1];

  var args = input.substring(input.indexOf("(") + 1, input.indexOf(")")).split(/[, ]+/);
  var numArgs = args.length;

  // for now - one integer argument
  var output = "Varying argument " + args[0] + ":\n";

  var inputType = "integer";
  var start = 200;
  var interval = 150;
  var numPoints = 10;
  var funcDef = input;
  var [valsUsed, runtimes] = varyRuntimes(start, interval, numPoints, funcDef, funcName, inputType);

  for (i = 0; i < numPoints; i++) {
    output += "For " + args[0] + " = " + valsUsed[i] + ", runtime = " + runtimes[i] + " ms\n";
  }
  document.getElementById("output").innerHTML = "<pre>" + output + "</pre>";

  var pairedData = parallelArraysToDataPairs(valsUsed, runtimes);
  var complexityData = analyseComplexity(pairedData);
  var graphableData = complexityDataToGraph(pairedData, complexityData);
  drawGraph(graphableData);

  var complexityMsg;
  if (complexityData.exponential) {
    complexityMsg = "exponential";
  } else if (complexityData.degree == 0) {
    complexityMsg = "constant";
  } else if (complexityData.degree == 1) {
    complexityMsg = "linear";
  } else if (complexityData.degree == 2) {
    complexityMsg = "quadratic";
  } else if (complexityData.degree == 3) {
    complexityMsg = "cubic";
  } else {
    complexityMsg = "polynomial of order " + complexity.degree;
  }

  document.getElementById("complexity").innerHTML = "Algorithm runtime complexity determined to be " + "<b>" + complexityMsg + "</b>";
}

// returns 2-element array of parallel arrays: array of n values used and array of runtimes in milliseconds
// TODO: do many runs, calculate error, etc
function varyRuntimes(start, interval, numPoints, funcDef, funcName, inputType) {
  var valsUsed = [];
  var runtimes = [];

  // register the function in our scope
  // TODO: fix weird scoping issue with this being done by caller
  eval(funcDef);

  for (run = 0; run < numPoints; run++) {
    var inputSize = start + run * interval;
    var arg = generateArg(inputSize, inputType);
    valsUsed.push(arg);
    var call = buildCallOneArg(funcName, arg);
    var program = call;

    var startTime = performance.now();
    var output = eval(program);
    var endTime = performance.now();


    var runtime = Math.round(endTime - startTime);
    runtimes.push(runtime);
  }

  return [valsUsed, runtimes];
}

// returns e.g. myFunc(1024);
function buildCallOneArg(funcName, arg) {
  return funcName + "(" + arg + ");";
}

// returns [[x1, y1], ..., [xn, yn]]
function parallelArraysToDataPairs(xs, ys) {
  var pairs = [];
  for (var i = 0; i < xs.length; i++) {
    pairs.push([xs[i], ys[i]]);
  }

  return pairs;
}

// TODO: handle input contents contraints, e.g. negative nums in int array? etc
function generateArg(inputSize, inputType) {
  if (inputType === "integer") {
    return inputSize;
  } else if (inputType === "string") {
    var charArr = [];
    var base = 'a'.charCodeAt(0)
    var range = 'z'.charCodeAt(0) - base;
    for (var i = 0; i < inputSize; i++) {
      var charNum = Math.floor(Math.random() * (range + 1)) + base;
      charArr.push(String.fromCharCode(charNum));
    }
    return charArr.join("");
  } else if (inputType === "integer-array") {
    var valueUBound = 100;
    var intArr = [];
    for (var i = 0; i < inputSize; i++) {
      intArr.push(Math.floor(Math.random() * valueUBound));
    }
    return intArr;
  }
}