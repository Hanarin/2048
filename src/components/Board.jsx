import styles from "./Board.module.css";
import Block from "./Block";

const Board = ({ board }) => {
  return (
    <div className={styles.board}>
      {board.flat().map((value, index) => (
        <Block key={index} value={value} />
      ))}
    </div>
  );
};

export default Board;
