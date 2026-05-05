import styles from "./Board.module.css";
import Block from "./Block";

const Board = ({ blocks, score, gameOver }) => {
  return (
    <div className={styles.board}>
      {Array.from({ length: 16 }).map((_, index) => (
        <div key={index} className={styles.cell} />
      ))}
      {blocks.map((block) => (
        <Block
          key={block.id}
          value={block.value}
          row={block.row}
          col={block.col}
          isNew={block.isNew}
          merged={block.merged}
          toRemove={block.toRemove}
          style={{
            transform: `translate(${block.col * 100}%, ${block.row * 100}%)`,
            transition: "transform 150ms ease-in-out",
          }}
        />
      ))}
      {gameOver && (
        <div className={styles.overlay}>
          <span className={styles.gameOverText}>Game Over</span>
          <span className={styles.scoreText}>score: {score}</span>
        </div>
      )}
    </div>
  );
};

export default Board;
