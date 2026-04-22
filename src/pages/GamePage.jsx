import styles from "./GamePage.module.css";
import Board from "../components/Board";
import { useEffect, useReducer } from "react";
import { addNewBlock, moveBlocks } from "../utils/GameUtils.js";

const GamePage = () => {
  // block = {
  //   id: 1,
  //   value: 2,
  //   row: 0,
  //   col: 0,
  //   isNew: true, // 목적: 생성 애니메이션
  //   merged: false, // 목적: 병합 애니메이션
  //   toRemove: false, // 목적: 삭제 애니메이션
  // };
  const createInitialState = () => {
    const blocks = [];
    const empty = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        empty.push([r, c]);
      }
    }
    const [r1, c1] = empty.splice(
      Math.floor(Math.random() * empty.length),
      1,
    )[0];
    const [r2, c2] = empty[Math.floor(Math.random() * empty.length)];
    blocks.push({
      id: 1,
      value: 2,
      row: r1,
      col: c1,
      isNew: true,
      merged: false,
      toRemove: false,
    });
    blocks.push({
      id: 2,
      value: 2,
      row: r2,
      col: c2,
      isNew: true,
      merged: false,
      toRemove: false,
    });
    return { blocks, top: 2, score: 0, gameOver: false };
  };

  const initialState = createInitialState();

  const reducer = (state, action) => {
    switch (action.type) {
      case "MOVE": {
        // const { newBoard: movedBoard, scoreGained } = moveBlocks(
        //   state,
        //   action.direction,
        // );
        // if (JSON.stringify(state.board) === JSON.stringify(movedBoard))
        //   return state;
        // const { newBoard, gameOver } = addNewBlock(movedBoard);
        // return {
        //   ...state,
        //   board: newBoard,
        //   score: state.score + scoreGained,
        //   gameOver,
        // };
        return state;
      }
      case "RESET": {
        return createInitialState();
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const onClick = () => {};

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
        {!state.gameOver && (
          <div className={styles.scoreText} onClick={addNewBlock}>
            SCORE: {state.score}
          </div>
        )}
        <Board
          blocks={state.blocks}
          score={state.score}
          gameOver={state.gameOver}
        />
      </div>
      {state.gameOver && (
        <button
          className={styles.replayButton}
          onClick={() => dispatch({ type: "RESET" })}
        >
          Replay
        </button>
      )}
    </div>
  );
};

export default GamePage;
