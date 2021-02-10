import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
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
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
	  counter: 0
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
	const counter = this.state.counter;
	
    if (calculateWinner(squares)) {
      return;
    }
	
	if (this.state.stepNumber < 6)
	{
		if (squares[i])
		{
			return;
		}
		
		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({
			history: history.concat([{squares: squares}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
			counter: i,
		});
	}
	else
	{
		if(!squares[counter])
		{
			if (counter === i)
			{
				squares[i] = this.state.xIsNext ? "X" : "O";
				
				this.setState({
					history: history.concat([{squares:squares,}]),
					stepNumber: history.length,
					xIsNext: this.state.xIsNext,
					counter: i,
				});		
			}
			
			if(!adjacent(i, counter) || squares[i])
			{
				if (counter !== i && squares[i] === null)
				{
					alert('The selected square must be adjacent')
				}
				return;
			}
			
			if (squares[4] === (this.state.xIsNext ? "X" : "O"))
			{
				squares[i] = this.state.xIsNext ? "X" : "O";
				
				if(!calculateWinner(squares))
				{
					alert('You must win or vacate the middle square')
					squares[i] = null;
					return;
				}
			}
			
			squares[i] = this.state.xIsNext ? "X" : "O";
			
			this.setState({
				history: history.concat([{squares:squares,}]),
				stepNumber: history.length,
				xIsNext: !this.state.xIsNext,
				counter: i,
			});
		}
		else
		{		
			if (squares[i] !== (this.state.xIsNext ? "X" : "O"))
			{
				return;
			}
			
			squares[i] = null;
			
			this.setState({
				history: history.concat([{squares:squares,}]),
				stepNumber: history.length,
				xIsNext: this.state.xIsNext,
				counter: i,
			});
		}
	}
  }

  
  
  
  
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
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

ReactDOM.render(<Game />, document.getElementById("root"));

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
      return squares[a];
    }
  }
  return null;
}

function adjacent(i, j) 
{
  if (i === 0)
    return j === 1 || j === 3 || j === 4;
  else if (i === 1)
    return j === 0 || j === 2 || j === 4 || j === 3 || j === 5;
  else if (i === 2)
    return j === 1 || j === 4 || j === 5;
  else if (i === 3)
    return j === 0 || j === 1 || j === 4 || j === 6 || j === 7;
  else if (i === 4) 
    return true;
  else if (i === 5)
    return j === 1 || j === 2 || j === 4 || j === 7 || j === 8;
  else if (i === 6)
    return j === 3 || j === 4 || j === 7;
  else if (i === 7)
    return j === 3 || j === 4 || j === 5 || j === 6 || j === 8;
  else if (i === 8)
    return j === 4 || j === 5 || j === 7;
}