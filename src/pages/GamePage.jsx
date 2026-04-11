import styles from "./GamePage.module.css";
import Board from "../components/Board";
import { useEffect, useState } from "react";

const GamePage = () => {
  const [board, setBoard] = useState([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const empty = [];
    board.forEach((row, r) =>
      row.forEach((cell, c) => {
        empty.push([r, c]);
      }),
    );
    const [i1, j1] = empty.splice(
      Math.floor(Math.random() * empty.length),
      1,
    )[0];
    const [i2, j2] = empty[Math.floor(Math.random() * empty.length)];
    setBoard(
      board.map((row, r) =>
        row.map((cell, c) =>
          (r === i1 && c === j1) || (r === i2 && c === j2) ? 2 : cell,
        ),
      ),
    );
  }, []);

  const addNewBlock = () => {
    const empty = [];
    board.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell === 0) empty.push([r, c]);
      }),
    );
    const [i, j] = empty[Math.floor(Math.random() * empty.length)];
    setBoard(
      board.map((row, r) =>
        row.map((cell, c) =>
          r === i && c === j ? (Math.floor(Math.random() * 2) + 1) * 2 : cell,
        ),
      ),
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.boardWrapper}>
        <div className={styles.scoreText}>점수: {score}</div>
        <Board board={board} />
      </div>
    </div>
  );
};

export default GamePage;
