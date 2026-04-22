const SIZE = 4;

// const addNewBlock = (board) => {
//   const empty = [];
//   board.forEach((row, r) =>
//     row.forEach((cell, c) => {
//       if (cell === 0) empty.push([r, c]);
//     }),
//   );
//   if (empty.length > 0) {
//     const [i, j] = empty[Math.floor(Math.random() * empty.length)];
//     const newBoard = board.map((row, r) =>
//       row.map((cell, c) =>
//         r === i && c === j
//           ? Math.floor(Math.random() * 10) !== 5
//             ? 2
//             : 4
//           : cell,
//       ),
//     );
//     return { newBoard, gameOver: empty.length === 1 && isGameOver(newBoard) };
//   } else {
//     return { newBoard: board, gameOver: isGameOver(board) };
//   }
// };

const getTransform = (direction) => {
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
        pre: (block) => ({ ...block, row: block.col, col: block.row }), // 전치
        post: (block) => ({ ...block, row: block.col, col: block.row }), // 전치
      };
    case "ArrowDown":
      return {
        // 상하반전 후 전치
        pre: (block) => ({
          ...block,
          row: SIZE - 1 - block.col,
          col: block.row,
        }),
        // 전치 후 상하반전
        post: (block) => ({
          ...block,
          row: block.col,
          col: SIZE - 1 - block.row,
        }),
      };
  }
};

// TODO: 왼쪽 방향 이동 기준으로 변환 후 이동 후 원래 방향으로 변환
// ArrowLeft: 그대로
// ArrowRight: col => SIZE - 1 - col
// ArrowUp: row => col, col => row
// ArrowDown: row => SIZE - 1 - col, col => row / row => col, col => SIZE - 1 - row
const moveBlocks = (blocks, direction) => {
  const transform = getTransform(direction);

  let score = 0;
  const totalResult = [];
  const totalMerged = [];
  const rows = [[], [], [], []];
  // 선변환
  const normalized = blocks.map(transform.pre);
  normalized.forEach((block) => rows[block.row].push(block));
  // 정렬 및 왼쪽 방향 기준 병합
  rows.forEach((row, index) => {
    row.sort((a, b) => a.col - b.col); // col에 대해 오름차순
    const { result, merged, lineScore } = mergeLine(row);
    totalResult.push(...result);
    totalMerged.push(...merged);
    score += lineScore;
  });
  // [애니메이션] 병합된 블록을 흡수한 블록의 위치로 이동
  totalMerged.forEach((m) => {
    const absorber = totalResult.find((r) => r.id === m.mergeTargetId);
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
    totalResult.some((newBlock) => {
      const original = blocks.find((block) => block.id === newBlock.id);
      return original.row !== newBlock.row || original.col !== newBlock.col;
    });
  return { newBlocks, scoreGained: score, hasChanged };
};

const mergeLine = (line) => {
  let lineScore = 0;
  const result = [];
  const merged = [];
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

// const isGameOver = (board) => {
//   for (let r = 0; r < board.length; r++) {
//     for (let c = 0; c < board[0].length; c++) {
//       if (c + 1 < board[0].length && board[r][c] === board[r][c + 1])
//         return false;
//       if (r + 1 < board[0].length && board[r][c] === board[r + 1][c])
//         return false;
//     }
//   }
//   return true;
// };

export { addNewBlock, moveBlocks };
