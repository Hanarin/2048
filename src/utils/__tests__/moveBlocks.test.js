import { describe, it, expect } from "vitest";
import { moveBlocks } from "../GameUtils.js";
import { toBlocks, toBoard } from "./helpers.js";

const move = (board, direction) => {
  const result = moveBlocks(toBlocks(board), direction);
  return { board: toBoard(result.newBlocks), ...result };
};

describe("moveBlocks - 이동", () => {
  it("왼쪽으로 이동하면 블럭들이 왼쪽 끝으로 붙는다", () => {
    const { board } = move(
      [
        [0, 0, 0, 2],
        [0, 0, 2, 0],
        [0, 0, 0, 0],
        [0, 2, 0, 0],
      ],
      "ArrowLeft",
    );
    expect(board).toEqual([
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 0, 0, 0],
    ]);
  });

  it("오른쪽으로 이동하면 블럭들이 오른쪽 끝으로 붙는다", () => {
    const { board } = move(
      [
        [2, 0, 0, 0],
        [0, 0, 2, 0],
        [0, 0, 0, 0],
        [0, 2, 0, 0],
      ],
      "ArrowRight",
    );
    expect(board).toEqual([
      [0, 0, 0, 2],
      [0, 0, 0, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 2],
    ]);
  });

  it("아래로 이동하면 블럭들이 아래쪽 끝으로 붙는다", () => {
    const { board } = move(
      [
        [2, 0, 0, 0],
        [0, 0, 2, 0],
        [0, 2, 0, 0],
        [0, 0, 0, 0],
      ],
      "ArrowDown",
    );
    expect(board).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 2, 2, 0],
    ]);
  });

  it("위로 이동하면 블럭들이 위쪽 끝으로 붙는다", () => {
    const { board } = move(
      [
        [0, 0, 0, 0],
        [0, 0, 2, 0],
        [0, 2, 0, 0],
        [0, 0, 0, 2],
      ],
      "ArrowUp",
    );
    expect(board).toEqual([
      [0, 2, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
  });
});

describe("moveBlocks - 병합", () => {
  it("이동하는 방향의 같은 값인 두 개의 블록은 병합되며 병합된 블록의 값만큼의 점수를 얻는다", () => {
    const { board, scoreGained } = move(
      [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      "ArrowLeft",
    );
    expect(board[0]).toEqual([4, 0, 0, 0]);
    expect(scoreGained).toBe(4);
  });

  it("같은 값인 두 개의 블록 사이가 비어있어도 병합된다", () => {
    const { board } = move(
      [
        [2, 0, 2, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      "ArrowLeft",
    );
    expect(board[0]).toEqual([4, 0, 0, 0]);
  });

  it("같은 값인 블록이 세 개일 경우에는 이동방향쪽의 두 개의 블록만 병합된다", () => {
    const { board } = move(
      [
        [2, 2, 2, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      "ArrowLeft",
    );
    expect(board[0]).toEqual([4, 2, 0, 0]);
  });

  it("같은 값인 블록이 네 개일 경우에는 두 개씩 병합되며 병합된 블록은 같은 차례에 다시 병합되지 않는다", () => {
    const { board, scoreGained } = move(
      [
        [4, 4, 4, 4],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      "ArrowLeft",
    );
    expect(board[0]).toEqual([8, 8, 0, 0]);
    expect(scoreGained).toBe(16);
  });

  it("다른 값의 블록끼리는 병합되지 않는다", () => {
    const { board, scoreGained } = move(
      [
        [2, 4, 8, 16],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      "ArrowLeft",
    );
    expect(board[0]).toEqual([2, 4, 8, 16]);
    expect(scoreGained).toBe(0);
  });
});

describe("moveBlocks - hasChanged 판정", () => {
  it("이동, 병합이 없으면 hasChanged가 false", () => {
    const { hasChanged } = move(
      [
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ],
      "ArrowLeft",
    );
    expect(hasChanged).toBe(false);
  });

  it("이동이 있으면 hasChanged가 true", () => {
    const { hasChanged } = move(
      [
        [0, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      "ArrowLeft",
    );
    expect(hasChanged).toBe(true);
  });

  it("병합이 있으면 hasChanged가 true", () => {
    const { hasChanged } = move(
      [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      "ArrowLeft",
    );
    expect(hasChanged).toBe(true);
  });
});
