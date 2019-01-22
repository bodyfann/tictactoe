import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.style} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  createTable = () => {
    let table = [];
    let style;

    for (let i = 0; i <= 2; i++) {
      let rows = [];

      for (let j = 0; j < 3; j++) {
        this.props.winner && this.props.winner.includes(j + i * 3)
          ? (style = 'square-win')
          : (style = 'square');
        rows.push(
          <Square
            key={j + i * 3}
            style={style}
            value={this.props.squares[j + i * 3]}
            onClick={() => this.props.onClick(j + i * 3)}
          />
        );
      }
      table.push(
        <div key={i} className="board-row">
          {rows}
        </div>
      );
    }
    return table;
  };

  render() {
    return <div>{this.createTable()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          square: { col: null, row: null }
        }
      ],
      stepNumber: 0,
      sort: 'asc',
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const currCol = getColumn(i);
    const currRow = getRow(i);

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([
        {
          squares: squares,
          square: { col: currCol, row: currRow }
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  sort() {
    this.state.sort === 'asc'
      ? this.setState({ sort: 'desc' })
      : this.setState({ sort: 'asc' });
  }

  render() {
    const history = this.state.history.slice();
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    if (this.state.sort === 'desc') {
      history.reverse();
    }
    const moves = history.map((step, move) => {
      let desc;
      let bold = '';
      let jump;
      if (this.state.sort === 'asc') {
        desc = move
          ? 'Go to move #' +
            move +
            ' (' +
            history[move].square.col +
            ', ' +
            history[move].square.row +
            ')'
          : 'Go to game start';
        if (this.state.stepNumber === move) {
          bold = 'text-bold';
        }
        jump = move;
      } else {
        if (move === history.length - 1) {
          desc = 'Go to game start';
        } else {
          desc =
            'Go to move #' +
            (history.length - 1 - move) +
            ' (' +
            history[move].square.col +
            ', ' +
            history[move].square.row +
            ')';
        }
        if (move === 0) {
          bold = 'text-bold';
        }
        jump = history.length - 1 - move;
      }

      return (
        <li key={move}>
          <button className={bold} onClick={() => this.jumpTo(jump)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner[0];
    } else {
      if (this.state.stepNumber === 9) {
        status = 'Draw';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winner={winner}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button className="sort" onClick={() => this.sort()}>
            Sort: {this.state.sort}
          </button>
          <ul>{moves}</ul>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // Return winning position and the winner symbol in front. E.g.: ["X", 0, 4, 8]
      lines[i].unshift(squares[a]);
      return lines[i];
    }
  }
  return null;
}

function getColumn(square) {
  let currCol;
  if (square === 0 || square === 3 || square === 6) currCol = 1;
  if (square === 1 || square === 4 || square === 7) currCol = 2;
  if (square === 2 || square === 5 || square === 8) currCol = 3;

  return currCol;
}

function getRow(square) {
  let currRow;
  if (square === 0 || square === 1 || square === 2) currRow = 1;
  if (square === 3 || square === 4 || square === 5) currRow = 2;
  if (square === 6 || square === 7 || square === 8) currRow = 3;

  return currRow;
}
