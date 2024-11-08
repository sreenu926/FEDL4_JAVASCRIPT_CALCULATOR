(function () {
  // 1. Initial setup: Regular expressions are defined to match operators, numbers ending with operators, and negative signs.
  
  "use strict"; // Enforce Strict Coding Practices

  const isOperator = /[x/+-]/,
    endsWithOperator = /[x+-/]$/,
    endsWithNegativeSign = /\d[x/+-]{1}-$/,
    clearStyle = { background: "#ac3939" },  // Styles are defined for different button types (clear, operator, equals).
    operatorStyle = { background: "#666666" },
    equalsStyle = {
      background: "#004466",
      position: "absolute",
      height: 130,
      bottom: 5,
    };

      // 2. Calculator Class: This class represents the calculator itself and inherits from React.Component.
          // The constructor initializes the component's state with various properties:
          // currentVal: The current number displayed on the screen (default: "0").
          // prevVal: The previous number used in a calculation (default: "0").
          // formula: The formula being built (e.g., "2 + 3").
          // currentSign: Tracks the current sign (positive or negative).
          // lastClicked: Stores the value of the last button clicked.

  class Calculator extends React.Component {
    constructor(e) {
      super(e),
        (this.state = {
          currentVal: "0",
          prevVal: "0",
          formula: "",
          currentSign: "pos",
          lastClicked: "",
        }),
        (this.maxDigitWarning = this.maxDigitWarning.bind(this)),
        (this.handleOperators = this.handleOperators.bind(this)),
        (this.handleEvaluate = this.handleEvaluate.bind(this)),
        (this.initialize = this.initialize.bind(this)),
        (this.handleDecimal = this.handleDecimal.bind(this)),
        (this.handleNumbers = this.handleNumbers.bind(this));
    }

        // Several functions are defined within the class to handle different user interactions:
        // maxDigitWarning: Displays a message if the number of digits exceeds a limit.
    
    maxDigitWarning() {
      this.setState({
        currentVal: "Digit Limit Met",
        prevVal: this.state.currentVal,
      }),
        setTimeout(
          () => this.setState({ currentVal: this.state.prevVal }),
          1e3
        );
    }

    // handleEvaluate: Evaluates the current formula using eval and updates the state.
             
    handleEvaluate() {
      if (!this.state.currentVal.includes("Limit")) {
        let expression = this.state.formula;
        for (; endsWithOperator.test(expression); )
          expression = expression.slice(0, -1);
        expression = expression
          .replace(/x/g, "*")
          .replace(/-/g, "-")
          .replace("--", "-");
        let answer = Math.round(1e12 * eval(expression)) / 1e12;
        this.setState({
          currentVal: answer.toString(),
          formula:
            expression
              .replace(/\*/g, "⋅")
              .replace(/-/g, "-")
              .replace(/(x|\/|\+)-/, "$1-")
              .replace(/^-/, "-") +
            "=" +
            answer,
          prevVal: answer,
          evaluated: !0,
        });
      }
    }

     // handleOperators: Handles clicks on operator buttons (+, -, *, /).
              // handleNumbers: Handles clicks on number buttons (0-9).
              // handleDecimal: Handles clicks on the decimal button.
              // initialize: Resets the calculator to its initial state.
    
    handleOperators(e) {
      if (!this.state.currentVal.includes("Limit")) {
        const t = e.target.value,
          { formula: a, prevVal: r, evaluated: s } = this.state;
        this.setState({ currentVal: t, evaluated: !1 }),
          s
            ? this.setState({ formula: r + t })
            : endsWithOperator.test(a)
            ? endsWithNegativeSign.test(a)
              ? "-" !== t && this.setState({ formula: r + t })
              : this.setState({
                  formula: (endsWithNegativeSign.test(a + t) ? a : r) + t,
                })
            : this.setState({ prevVal: a, formula: a + t });
      }
    }
    handleNumbers(e) {
      if (!this.state.currentVal.includes("Limit")) {
        const { currentVal: t, formula: a, evaluated: r } = this.state,
          s = e.target.value;
        this.setState({ evaluated: !1 }),
          t.length > 21
            ? this.maxDigitWarning()
            : r
            ? this.setState({ currentVal: s, formula: "0" !== s ? s : "" })
            : this.setState({
                currentVal: "0" === t || isOperator.test(t) ? s : t + s,
                formula:
                  "0" === t && "0" === s
                    ? "" === a
                      ? s
                      : a
                    : /([^.0-9]0|^0)$/.test(a)
                    ? a.slice(0, -1) + s
                    : a + s,
              });
      }
    }
    handleDecimal() {
      !0 === this.state.evaluated
        ? this.setState({ currentVal: "0.", formula: "0.", evaluated: !1 })
        : this.state.currentVal.includes(".") ||
          this.state.currentVal.includes("Limit") ||
          (this.setState({ evaluated: !1 }),
          this.state.currentVal.length > 21
            ? this.maxDigitWarning()
            : endsWithOperator.test(this.state.formula) ||
              ("0" === this.state.currentVal && "" === this.state.formula)
            ? this.setState({
                currentVal: "0.",
                formula: this.state.formula + "0.",
              })
            : this.setState({
                currentVal: this.state.formula.match(/(-?\d+\.?\d*)$/)[0] + ".",
                formula: this.state.formula + ".",
              }));
    }
    initialize() {
      this.setState({
        currentVal: "0",
        prevVal: "0",
        formula: "",
        currentSign: "pos",
        lastClicked: "",
        evaluated: !1,
      });
    }

      // The render function defines the visual structure of the calculator using JSX:
            // It creates a main div with the class name "calculator".
            // It renders three sub-components: Formula, Output, and Buttons.
      
    render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { className: "calculator" },
          React.createElement(Formula, {
            formula: this.state.formula.replace(/x/g, "⋅"),
          }),
          React.createElement(Output, { currentValue: this.state.currentVal }),
          React.createElement(Buttons, {
            decimal: this.handleDecimal,
            evaluate: this.handleEvaluate,
            initialize: this.initialize,
            numbers: this.handleNumbers,
            operators: this.handleOperators,
          })
        ),
        React.createElement(
          "div",
          { className: "author" },
          "JAVASCRIPT CALCULATOR",
          React.createElement("br", null),
          React.createElement(
            "a",
            {
              href: "https://github.com/sreenu926?tab=repositories",
              target: "_blank",
              rel: "noreferrer",
            },
            "Nagasreenivasarao P"
          )
        )
      );
    }
  }

      // 3. Buttons Class: This class represents the collection of buttons on the calculator.
          // The render function creates individual buttons for each number, operator, and clear function.
              // Each button has a unique ID, value, and style applied based on its type.
              // Button clicks trigger the corresponding handler functions passed as props (e.g., onClick={this.props.operators}).

  class Buttons extends React.Component {
    render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          {
            className: "jumbo",
            id: "clear",
            onClick: this.props.initialize,
            style: clearStyle,
            value: "AC",
          },
          "AC"
        ),
        React.createElement(
          "button",
          {
            id: "divide",
            onClick: this.props.operators,
            style: operatorStyle,
            value: "/",
          },
          "/"
        ),
        React.createElement(
          "button",
          {
            id: "multiply",
            onClick: this.props.operators,
            style: operatorStyle,
            value: "x",
          },
          "x"
        ),
        React.createElement(
          "button",
          { id: "seven", onClick: this.props.numbers, value: "7" },
          "7"
        ),
        React.createElement(
          "button",
          { id: "eight", onClick: this.props.numbers, value: "8" },
          "8"
        ),
        React.createElement(
          "button",
          { id: "nine", onClick: this.props.numbers, value: "9" },
          "9"
        ),
        React.createElement(
          "button",
          {
            id: "subtract",
            onClick: this.props.operators,
            style: operatorStyle,
            value: "-",
          },
          "-"
        ),
        React.createElement(
          "button",
          { id: "four", onClick: this.props.numbers, value: "4" },
          "4"
        ),
        React.createElement(
          "button",
          { id: "five", onClick: this.props.numbers, value: "5" },
          "5"
        ),
        React.createElement(
          "button",
          { id: "six", onClick: this.props.numbers, value: "6" },
          "6"
        ),
        React.createElement(
          "button",
          {
            id: "add",
            onClick: this.props.operators,
            style: operatorStyle,
            value: "+",
          },
          "+"
        ),
        React.createElement(
          "button",
          { id: "one", onClick: this.props.numbers, value: "1" },
          "1"
        ),
        React.createElement(
          "button",
          { id: "two", onClick: this.props.numbers, value: "2" },
          "2"
        ),
        React.createElement(
          "button",
          { id: "three", onClick: this.props.numbers, value: "3" },
          "3"
        ),
        React.createElement(
          "button",
          {
            className: "jumbo",
            id: "zero",
            onClick: this.props.numbers,
            value: "0",
          },
          "0"
        ),
        React.createElement(
          "button",
          { id: "decimal", onClick: this.props.decimal, value: "." },
          "."
        ),
        React.createElement(
          "button",
          {
            id: "equals",
            onClick: this.props.evaluate,
            style: equalsStyle,
            value: "=",
          },
          "="
        )
      );
    }
  }

      // 4. Output and Formula Classes:
          // These simple classes represent the output screen and formula screen, respectively.
          // Their render functions display the current value and formula using the props received.

  class Output extends React.Component {
    render() {
      return React.createElement(
        "div",
        { className: "outputScreen", id: "display" },
        this.props.currentValue
      );
    }
  }

  class Formula extends React.Component {
    render() {
      return React.createElement(
        "div",
        { className: "formulaScreen" },
        this.props.formula
      );
    }
  }

      // 5. Rendering the Calculator:
          // ReactDOM.render takes a React element and injects it into the DOM element with the ID "app".
          // In this case, it renders an instance of the Calculator class.

  ReactDOM.render(
    React.createElement(Calculator, null),
    document.getElementById("app")
  );
})();

// Overall, this code creates a functional calculator that allows users to input numbers, operators, and decimals, perform calculations, and reset the state.
