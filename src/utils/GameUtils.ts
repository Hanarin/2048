import type {
  Block,
  Direction,
  GameState,
  MergedBlock,
  SavedGameState,
} from "../types";
import { SIZE } from "../types";

const createInitialState = (): GameState => {
  const bestScore = Number(localStorage.getItem("bestScore")) || 0;
  const saved = localStorage.getItem("gameState");
  const gameState: SavedGameState | null = saved ? JSON.parse(saved) : null;
  if (gameState) {
    const blocks: Block[] = gameState.blocks.map((b) => ({
      ...b,
      isNew: false,
      merged: false,
      toRemove: false,
    }));
    return { ...gameState, blocks, bestScore, gameOver: false };
  }
  const blocks: Block[] = [];
  const empty: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      empty.push([r, c]);
    }
  }
  const [r1, c1] = empty.splice(Math.floor(Math.random() * empty.length), 1)[0];
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
  return { blocks, nextId: 3, score: 0, bestScore, gameOver: false };
};

const addNewBlock = (
  blocks: Block[],
  nextId: number,
): { newBlocks: Block[]; gameOver: boolean } => {
  const blockSet = new Set(blocks.map((block) => `${block.row},${block.col}`));
  const empty: [number, number][] = [];
  const newBlocks = blocks.map((block) => ({ ...block }));
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!blockSet.has(`${r},${c}`)) empty.push([r, c]);
    }
  }
  if (empty.length > 0) {
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    newBlocks.push({
      id: nextId,
      value: Math.random() < 0.9 ? 2 : 4,
      row: r,
      col: c,
      isNew: true,
      merged: false,
      toRemove: false,
    });
    return { newBlocks, gameOver: empty.length === 1 && isGameOver(newBlocks) };
  } else {
    return { newBlocks: blocks, gameOver: isGameOver(blocks) };
  }
};

const getTransform = (
  direction: Direction,
): { pre: (block: Block) => Block; post: (block: Block) => Block } => {
  switch (direction) {
    case "ArrowLeft":
      return {
        pre: (block) => block,
        post: (block) => block,
      };
    case "ArrowRight":
      return {
        pre: (block) => ({ ...block, col: SIZE - 1 - block.col }), // 좌우반전
        post: (block) => ({ ...block, col: SIZE - 1 - block.col }), // 좌우반전
      };
    case "ArrowUp":
      return {
        pre: (block) => ({
          ...block,
          row: SIZE - 1 - block.col,
          col: block.row,
        }), // 반시계방향 회전
        post: (block) => ({
          ...block,
          row: block.col,
          col: SIZE - 1 - block.row,
        }), // 시계방향 회전
      };
    case "ArrowDown":
      return {
        pre: (block) => ({
          ...block,
          row: block.col,
          col: SIZE - 1 - block.row,
        }), // 시계방향 회전
        post: (block) => ({
          ...block,
          row: SIZE - 1 - block.col,
          col: block.row,
        }), // 반시계방향 회전
      };
  }
};

const moveBlocks = (
  blocks: Block[],
  direction: Direction,
): { newBlocks: Block[]; scoreGained: number; hasChanged: boolean } => {
  const transform = getTransform(direction);

  let score = 0;
  const totalResult: Block[] = [];
  const totalMerged: MergedBlock[] = [];
  const rows: Block[][] = [[], [], [], []];
  // 선변환
  const normalized = blocks.map(transform.pre);
  normalized.forEach((block) => rows[block.row].push(block));
  // 정렬 및 왼쪽 방향 기준 병합
  rows.forEach((row) => {
    row.sort((a, b) => a.col - b.col); // col에 대해 오름차순
    const { result, merged, lineScore } = mergeLine(row);
    totalResult.push(...result);
    totalMerged.push(...merged);
    score += lineScore;
  });
  // [애니메이션] 병합된 블록을 흡수한 블록의 위치로 이동
  totalMerged.forEach((m) => {
    const absorber = totalResult.find((r) => r.id === m.mergeTargetId);
    if (!absorber) return;
    m.row = absorber.row;
    m.col = absorber.col;
  });
  // 후변환
  const newBlocks = [
    ...totalResult.map(transform.post),
    ...totalMerged.map(transform.post),
  ];
  // 이동, 병합 발생 여부 확인
  const hasChanged =
    totalMerged.length > 0 ||
    newBlocks.some((newBlock) => {
      const original = blocks.find((block) => block.id === newBlock.id);
      if (!original) return true;
      return (
        newBlock.toRemove ||
        original.row !== newBlock.row ||
        original.col !== newBlock.col
      );
    });
  return { newBlocks, scoreGained: score, hasChanged };
};

const mergeLine = (
  line: Block[],
): { result: Block[]; merged: MergedBlock[]; lineScore: number } => {
  let lineScore = 0;
  const result: Block[] = [];
  const merged: MergedBlock[] = [];
  for (const block of line) {
    const last = result[result.length - 1];
    if (last && last.value === block.value && !last.merged) {
      last.value *= 2;
      last.merged = true;
      lineScore += last.value;
      merged.push({ ...block, mergeTargetId: last.id, toRemove: true });
    } else {
      result.push({
        ...block,
        col: result.length,
        merged: false,
      });
    }
  }
  return { result, merged, lineScore };
};

const isGameOver = (blocks: Block[]): boolean => {
  const board = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => 0),
  );
  blocks.forEach((block) => {
    board[block.row][block.col] = block.value;
  });
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      if (c + 1 < board[0].length && board[r][c] === board[r][c + 1])
        return false;
      if (r + 1 < board[0].length && board[r][c] === board[r + 1][c])
        return false;
    }
  }
  return true;
};

export { createInitialState, addNewBlock, moveBlocks };
