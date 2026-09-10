import { describe, it, expect, vi, afterEach } from "vitest";
import { addNewBlock } from "../GameUtils.js";
import { toBlocks } from "./helpers.js";

afterEach(() => vi.restoreAllMocks());

describe("addNewBlock", () => {
  it("빈 보드에 2, 4 중 하나의 값을 가지는 블록이 정확히 하나 추가된다", () => {
    const { newBlocks } = addNewBlock(
      toBlocks([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]),
      1,
    );
    expect(newBlocks).toHaveLength(1);
    expect([2, 4]).toContain(newBlocks[0].value);
  });

  it("Math.random을 0으로 고정하면 값이 2로 생성된다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { newBlocks } = addNewBlock(
      toBlocks([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]),
      1,
    );
    expect(newBlocks[0].value).toBe(2);
  });

  it("Math.random을 0.95으로 고정하면 값이 4로 생성된다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.95);
    const { newBlocks } = addNewBlock(
      toBlocks([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]),
      1,
    );
    expect(newBlocks[0].value).toBe(4);
  });

  it("빈 칸이 없고 더이상 병합할 수 없으면 gameOver가 true가 된다", () => {
    const { gameOver } = addNewBlock(
      toBlocks([
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ]),
      99,
    );
    expect(gameOver).toBe(true);
  });

  it("빈 칸이 없어도 병합할 수 있으면 gameOver가 false가 된다", () => {
    const { gameOver } = addNewBlock(
      toBlocks([
        [2, 2, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ]),
      99,
    );
    expect(gameOver).toBe(false);
  });
});
