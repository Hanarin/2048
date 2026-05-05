import styles from "./GamePage.module.css";
import Board from "../components/Board";
import { useRef, useEffect, useReducer } from "react";
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

  const animationTimer = useRef(null);

  const reducer = (state, action) => {
    switch (action.type) {
      case "MOVE": {
        const {
          newBlocks: movedBlocks,
          scoreGained,
          hasChanged,
        } = moveBlocks(
          state.blocks
            .filter((block) => !block.toRemove)
            .map((block) => ({ ...block, isNew: false, merged: false })), // merged 플래그 초기화
          action.direction,
        );
        if (!hasChanged) return state;
        const { newBlocks, gameOver } = addNewBlock(movedBlocks, state.nextId);
        const score = state.score + scoreGained;
        return {
          ...state,
          blocks: newBlocks,
          nextId: gameOver ? state.nextId : state.nextId + 1,
          score,
          bestScore: Math.max(score, state.bestScore),
          gameOver,
        };
      }
      case "REMOVE_MERGED": {
        return {
          ...state,
          blocks: state.blocks.filter((block) => !block.toRemove),
        };
      }
      case "RESET": {
        return createInitialState();
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, null, createInitialState);

  const onClick = () => {};

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        return;
      if (animationTimer.current) {
        clearTimeout(animationTimer.current);
        animationTimer.current = null;
        dispatch({ type: "REMOVE_MERGED" });
      }
      dispatch({ type: "MOVE", direction: e.key });
      animationTimer.current = setTimeout(() => {
        dispatch({ type: "REMOVE_MERGED" });
        animationTimer.current = null;
      }, 150);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("bestScore", state.bestScore);
  }, [state.bestScore]);

  return (
    <div className={styles.page}>
      <div className={styles.boardWrapper}>
        {!state.gameOver && (
          <div className={styles.scoreWrapper}>
            <div className={styles.scoreTextWrapper}>
              <div className={styles.scoreTitleText}>SCORE</div>
              <div className={styles.scoreText}>{state.score}</div>
            </div>
            <div className={styles.scoreTextWrapper}>
              <div className={styles.scoreTitleText}>BEST</div>
              <div className={styles.scoreText}>{state.bestScore}</div>
            </div>
          </div>
        )}
        <Board
          blocks={state.blocks}
          score={state.score}
          bestScore={state.bestScore}
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
