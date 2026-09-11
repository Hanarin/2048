import styles from "./GamePage.module.css";
import Board from "../components/Board";
import { useRef, useEffect, useReducer } from "react";
import {
  createInitialState,
  addNewBlock,
  moveBlocks,
} from "../utils/GameUtils.js";
import type { Direction, GameState, SavedGameState } from "../types";

type Action =
  | { type: "MOVE"; direction: Direction }
  | { type: "REMOVE_MERGED" }
  | { type: "RESET" };

const ARROW_KEYS: Direction[] = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
];

const ANIMATION_MS = 150;

const GamePage = () => {
  const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reducer = (state: GameState, action: Action): GameState => {
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
        const { newBlocks, gameOver } = addNewBlock(
          movedBlocks.filter((block) => !block.toRemove),
          state.nextId,
        );
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
        localStorage.removeItem("gameState");
        return createInitialState();
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, null, createInitialState);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!ARROW_KEYS.includes(e.key as Direction)) return;
      if (animationTimer.current) {
        clearTimeout(animationTimer.current);
        animationTimer.current = null;
        dispatch({ type: "REMOVE_MERGED" });
      }
      dispatch({ type: "MOVE", direction: e.key as Direction });
      animationTimer.current = setTimeout(() => {
        dispatch({ type: "REMOVE_MERGED" });
        animationTimer.current = null;
      }, ANIMATION_MS);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("bestScore", String(state.bestScore));
  }, [state.bestScore]);

  useEffect(() => {
    if (state.gameOver) {
      localStorage.removeItem("gameState");
      return;
    }
    const savedGameState: SavedGameState = {
      blocks: state.blocks
        .filter((block) => !block.toRemove)
        .map(({ id, value, row, col }) => ({ id, value, row, col })),
      score: state.score,
      nextId: state.nextId,
    };
    localStorage.setItem("gameState", JSON.stringify(savedGameState));
  }, [state.blocks, state.score, state.nextId, state.gameOver]);

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
            <button
              className={styles.newGameButton}
              onClick={() => dispatch({ type: "RESET" })}
            >
              New Game
            </button>
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
