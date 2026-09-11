export const SIZE = 4;

export type Direction = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

export interface Block {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew: boolean; // 등장 애니메이션
  merged: boolean; // 병합 애니메이션 및 재병합 방지
  toRemove: boolean; // 제거 애니메이션
}

export interface MergedBlock extends Block {
  mergeTargetId: number;
}

export interface GameState {
  blocks: Block[];
  nextId: number;
  score: number;
  bestScore: number;
  gameOver: boolean;
}

export interface SavedGameState {
  blocks: Pick<Block, "id" | "value" | "row" | "col">[];
  score: number;
  nextId: number;
}
