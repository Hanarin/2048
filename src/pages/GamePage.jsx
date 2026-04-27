import styles from "./GamePage.module.css";
import Board from "../components/Board";
import { useEffect, useReducer } from "react";
import {
  createInitialState,
  addNewBlock,
  moveBlocks,
} from "../utils/GameUtils.js";

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

  const reducer = (state, action) => {
    switch (action.type) {
      case "MOVE":
        {
          const { newBlocks, scoreGained, hasChanged } = moveBlocks(
            state.blocks.map((block) => ({ ...block, merged: false })), // merged 플래그 초기화
            action.direction,
          );
          return state;
        }
        if (!hasChanged) return state;
        const { newBlocks, gameOver } = addNewBlock(
          state.blocks,
          nextId.current,
        );
        if (!gameOver) nextId.current++;
        return {
          ...state,
          blocks: newBlocks,
          score: state.score + scoreGained,
          gameOver,
        };
      case "RESET": {
        return createInitialState();
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, null, createInitialState);
  const nextId = useRef(1);

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
