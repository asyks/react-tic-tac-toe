import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button >
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let i = 0;
    const board = []
    for (let row = 1; row <= 3; row++) {
      const squares = [];
      for (let column = 1; column <= 3; column++) {
        squares.push(this.renderSquare(i));
        i++;
      }
      board.push(<div className="board-row">{squares}</div>);
    }

    return <div>{board}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        selection: null
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  getRowCol(i) {
    return [
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
      { row: 2, col: 3 },
      { row: 3, col: 1 },
      { row: 3, col: 2 },
      { row: 3, col: 3 },
    ][i]
  }

  handleClick(i) {
    // duplicate the `history` array up to and including the current `stepNumber`
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // retreive the last entry in the duplicated history array, and duplicate it
    const current = history[history.length - 1];
    let squares = current.squares.slice();

    // ignore clicks if there's a winner OR the square is already filled
    if (calculateWinner(squares) || squares[i]) {
      return
    }

    // update the value of the clicked square in the current step
    squares[i] = this.state.xIsNext ? "X" : "O";
    // duplicate, and update the `history` array with the current step
    this.setState(
      {
        history: history.concat([{
          squares: squares,
          selection: i,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      }
    );
  }

  jumpTo(stepNumber) {
    this.setState({
      stepNumber: stepNumber,
      xIsNext: (stepNumber % 2) === 0,
    });
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // create a list of previous moves that can be "jumped to"
    const moves = history.map((step, move) => {
      // determine the row and column of the clicked square in the current step
      const coords = this.getRowCol(step.selection);
      const desc = move ? "Go to move #" + move + " square: (" + coords.row + "," + coords.col + ")" : "Go to game start";
      const highlight = move === this.state.stepNumber
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={highlight ? "highlight" : null}
          >
            {desc}
          </button>
        </li>
      );
    });

    // if there's a winner display it, otherwise display who's turn is next
    let status;
    if (winner) {
      status = "Winner: " + winner
    }
    else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game" >
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    /*
    if square at index `a` is filled, and its value matches the winning combination
    being checked then declare a winner
    */
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
