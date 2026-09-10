export const toBlocks = (board) => {
  /*
    [[2, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]]
    =>
    [{ id: 1, value: 2, row: 0, col: 0, isNew: false, merged: false, toRemove: false }]
  */
  const blocks = [];
  let id = 1;
  board.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value !== 0)
        blocks.push({
          id: id++,
          value,
          row: r,
          col: c,
          isNew: false,
          merged: false,
          toRemove: false,
        });
    });
  });
  return blocks;
};

export const toBoard = (blocks) => {
  /*
    [{ id: 1, value: 2, row: 0, col: 0, isNew: false, merged: false, toRemove: false }]
    =>
    [[2, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]]
  */
  const board = Array.from({ length: 4 }, () => Array(4).fill(0));
  blocks
    .filter((b) => !b.toRemove)
    .forEach((b) => {
      board[b.row][b.col] = b.value;
    });
  return board;
};
