import styles from "./GamePage.module.css";
import Board from "../components/Board";
import { useEffect, useReducer } from "react";
import { addNewBlock, moveBlocks } from "../utils/GameUtils.js";

const GamePage = () => {
  const createInitialState = () => {
    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const empty = [];
    board.forEach((row, r) =>
      row.forEach((_, c) => {
        empty.push([r, c]);
      }),
    );
    const [i1, j1] = empty.splice(
      Math.floor(Math.random() * empty.length),
      1,
    )[0];
    const [i2, j2] = empty[Math.floor(Math.random() * empty.length)];
    const newBoard = board.map((row, r) =>
      row.map((cell, c) =>
        (r === i1 && c === j1) || (r === i2 && c === j2) ? 2 : cell,
      ),
    );
    return { board: newBoard, score: 0, gameOver: false };
  };

  const initialState = createInitialState();

  // const initialState = {
  //   board: [
  //     [0, 0, 0, 0],
  //     [0, 0, 0, 0],
  //     [0, 0, 0, 0],
  //     [0, 0, 0, 0],
  //   ],
  //   score: 0,
  //   gameOver: false,
  // };

  const reducer = (state, action) => {
    switch (action.type) {
      case "MOVE": {
        const { newBoard: movedBoard, scoreGained } = moveBlocks(
          state,
          action.direction,
        );
        if (JSON.stringify(state.board) === JSON.stringify(movedBoard))
          return state;
        const { newBoard, gameOver } = addNewBlock(movedBoard);
        return {
          ...state,
          board: newBoard,
          score: state.score + scoreGained,
          gameOver,
        };
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const handleKeyDown = (e) => {
      dispatch({ type: "MOVE", direction: e.key });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.boardWrapper}>
        <div className={styles.scoreText} onClick={addNewBlock}>
          점수: {state.score}
        </div>
        <Board board={state.board} gameOver={state.gameOver} />
      </div>
    </div>
  );
};

export default GamePage;
