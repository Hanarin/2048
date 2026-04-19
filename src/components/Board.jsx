import styles from "./Board.module.css";
import Block from "./Block";

const Board = ({ state }) => {
  return (
    <div className={styles.board}>
      {state.board.flat().map((value, index) => (
        <Block key={index} value={value} />
      ))}
      {state.gameOver && (
        <div className={styles.overlay}>
          <span className={styles.gameOverText}>Game Over</span>
          <span className={styles.scoreText}>score: {state.score}</span>
        </div>
      )}
    </div>
  );
};

export default Board;
