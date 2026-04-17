import styles from "./Board.module.css";
import Block from "./Block";

const Board = ({ board, gameOver }) => {
  return (
    <div className={styles.board}>
      {board.flat().map((value, index) => (
        <Block key={index} value={value} />
      ))}
      {gameOver && (
        <div className={styles.overlay}>
          <span className={styles.gameOverText}>Game Over</span>
        </div>
      )}
    </div>
  );
};

export default Board;
