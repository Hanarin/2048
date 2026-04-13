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

  useEffect(() => {
    const handleKeyDown = (e) => {
      moveBlocks(e.key);
      addNewBlock();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const addNewBlock = () => {
    setBoard((prevBoard) => {
      const empty = [];
      prevBoard.forEach((row, r) =>
        row.forEach((cell, c) => {
          if (cell === 0) empty.push([r, c]);
        }),
      );
      if (empty.length > 0) {
        const [i, j] = empty[Math.floor(Math.random() * empty.length)];
        return prevBoard.map((row, r) =>
          row.map((cell, c) =>
            r === i && c === j
              ? Math.floor(Math.random() * 10) !== 5
                ? 2
                : 4
              : cell,
          ),
        );
      } else {
        // 게임 오버
      }
    });
  };

  const moveBlocks = (direction) => {
    setBoard((prevBoard) => {
      if (["ArrowUp", "ArrowDown"].includes(direction)) {
        const newBoard = Array.from({ length: prevBoard.length }, () =>
          Array.from({ length: prevBoard[0].length }, () => 0),
        );
        for (let i = 0; i < prevBoard[0].length; i++) {
          const column = [];
          for (let j = 0; j < prevBoard.length; j++) {
            column.push(prevBoard[j][i]);
          }
          const mergedColumn = merge(column);
          for (let c = 0; c < prevBoard.length; c++) {
            if (direction === "ArrowUp") {
              if (c < mergedColumn.length) newBoard[c][i] = mergedColumn[c];
              else newBoard[c][i] = 0;
            } else {
              if (c < prevBoard.length - mergedColumn.length)
                newBoard[c][i] = 0;
              else
                newBoard[c][i] =
                  mergedColumn[c - (prevBoard.length - mergedColumn.length)];
            }
          }
        }
        return newBoard;
      } else if (["ArrowLeft", "ArrowRight"].includes(direction)) {
        return prevBoard.map((row) => {
          const mergedRow = merge(row);
          const zeros = Array.from(
            { length: row.length - mergedRow.length },
            () => 0,
          );
          if (direction === "ArrowLeft") return mergedRow.concat(zeros);
          else return zeros.concat(mergedRow);
        });
      }
      return prevBoard;
    });
  };

  const merge = (arr) => {
    const mergedArr = [];
    const merged = new Set();
    for (let cell of arr) {
      if (cell !== 0) {
        const top = mergedArr.length - 1;
        if (cell === mergedArr[top] && !merged.has(top)) {
          mergedArr[top] *= 2;
          merged.add(top);
        } else {
          mergedArr.push(cell);
        }
      }
    }
    return mergedArr;
  };

  return (
    <div className={styles.page}>
      <div className={styles.boardWrapper}>
        <div className={styles.scoreText} onClick={addNewBlock}>
          점수: {score}
        </div>
        <Board board={board} />
      </div>
    </div>
  );
};

export default GamePage;
