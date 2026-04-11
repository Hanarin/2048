import styles from "./GamePage.module.css";
import Board from "../components/Board";
import { useState } from "react";

const GamePage = () => {
  const [board, setBoard] = useState([
    [0, 2, 4, 8],
    [16, 32, 64, 128],
    [256, 512, 1024, 2048],
    [5096, 10192, 20384, 40768],
  ]);
  const [score, setScore] = useState(0);

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
