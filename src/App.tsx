import { MouseEventHandler, useState } from "react";
import "./App.css";

// To collect data from multiple children, or to have two child components communicate with each other,
// declare the shared state in their parent component instead. The parent component can pass that state
// back down to the children via props. This keeps the child components in sync with each other and
// with their parent.

// setSquares tells react that component state has changed, triggering a re-render of the components
// that use the squares state and any child components

// 1. Clicking on the upper left square runs the function that the button received as its onClick prop from the Square.
//    The Square component received that function as its onSquareClick prop from the Board. The Board component defined
//    that function directly in the JSX. It calls handleClick with an argument of 0.

// 2. handleClick uses the argument (0) to update the first element of the squares array from null to X.

// 3. The squares state of the Board component was updated, so the Board and all of its children re-render. This causes 
//    the value prop of the Square component with index 0 to change from null to X.

const Game = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handlePlay = (nextSquares: string[]) => {
    const nextHistory = [...history.slice(0,currentMove + 1), nextSquares];

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const jumpTo = (nextMove: number) => {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
     </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

const Board = ({xIsNext, squares, onPlay} : {xIsNext: boolean, squares: string[], onPlay: ((any))}) => {
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const handleClick = (i: number) => {
    // nextSquares contains copy of the squares array
    const nextSquares = squares.slice();
    // if square is already fulled, return early so the state isn't updated
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  // Cannot use onSquareClick={handleClick[0]} as this re-renders the board, but changes the
  // state of board so re-renders creating an infinite loop
  // Function is only being passed down as a prop, this would call the function

  // New way creates a new function that when called, calls handleClick itself with the argument
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
    </>
  );
};

// Creates id as an object of type string, (i.e. we create id of type id, which consists of string property called id)
// as React components require objects as props, not a single value

const Square = ({ value, onSquareClick }: { value: string, onSquareClick: MouseEventHandler<HTMLButtonElement> }) => {
  // const Square = () => {
  // const [value, setValue] = useState<string | null>(null);

  // const handleClick = () => {
  //   setValue("X");
  // };

  // return (
  //   <button className="square" onClick={handleClick}>
  //     {value}
  //   </button>
  // );

  return <button className="square" onClick={onSquareClick}>{value}</button>;
};

const calculateWinner = (squares: Array<string>) => {
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

export default Game;
