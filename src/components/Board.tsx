import styles from "./Board.module.css";
import Block from "./Block";
import type { Block as BlockType } from "../types";

interface BoardProps {
  blocks: BlockType[];
  score: number;
  bestScore: number;
  gameOver: boolean;
}

const Board = ({ blocks, score, bestScore, gameOver }: BoardProps) => {
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
        />
      ))}
      {gameOver && (
        <div className={styles.overlay}>
          <span className={styles.gameOverText}>Game Over</span>
          <span className={styles.scoreText}>Score: {score}</span>
          <span className={styles.scoreText}>Best score: {bestScore}</span>
        </div>
      )}
    </div>
  );
};

export default Board;
