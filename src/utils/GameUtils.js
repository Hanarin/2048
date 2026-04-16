const addNewBlock = (board) => {
  const empty = [];
  board.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell === 0) empty.push([r, c]);
    }),
  );
  if (empty.length > 0) {
    const [i, j] = empty[Math.floor(Math.random() * empty.length)];
    return board.map((row, r) =>
      row.map((cell, c) =>
        r === i && c === j
          ? Math.floor(Math.random() * 10) !== 5
            ? 2
            : 4
          : cell,
      ),
    );
  } else {
    // 게임 오버
  }
};

const moveBlocks = (state, direction) => {
  if (["ArrowUp", "ArrowDown"].includes(direction)) {
    let score = 0;
    const newBoard = Array.from({ length: state.board.length }, () =>
      Array.from({ length: state.board[0].length }, () => 0),
    );
    for (let i = 0; i < state.board[0].length; i++) {
      const column = [];
      for (let j = 0; j < state.board.length; j++) {
        column.push(state.board[j][i]);
      }
      const { mergedArr, scoreGained } =
        direction === "ArrowUp" ? merge(column) : merge([...column].reverse());
      if (direction === "ArrowDown") mergedArr.reverse();
      score += scoreGained;
      for (let c = 0; c < state.board.length; c++) {
        if (direction === "ArrowUp") {
          if (c < mergedArr.length) newBoard[c][i] = mergedArr[c];
          else newBoard[c][i] = 0;
        } else {
          if (c < column.length - mergedArr.length) newBoard[c][i] = 0;
          else
            newBoard[c][i] = mergedArr[c - (column.length - mergedArr.length)];
        }
      }
    }
    return { newBoard, scoreGained: score };
  } else if (["ArrowLeft", "ArrowRight"].includes(direction)) {
    let score = 0;
    const newBoard = state.board.map((row) => {
      const { mergedArr, scoreGained } =
        direction === "ArrowLeft" ? merge(row) : merge([...row].reverse());
      if (direction === "ArrowRight") mergedArr.reverse();
      score += scoreGained;
      const zeros = Array.from(
        { length: row.length - mergedArr.length },
        () => 0,
      );
      if (direction === "ArrowLeft") return mergedArr.concat(zeros);
      else return zeros.concat(mergedArr);
    });
    return { newBoard, scoreGained: score };
  }
  return { newBoard: state.board, scoreGained: 0 };
};

const merge = (arr) => {
  let scoreGained = 0;
  const mergedArr = [];
  const merged = new Set();
  for (let cell of arr) {
    if (cell !== 0) {
      const top = mergedArr.length - 1;
      if (cell === mergedArr[top] && !merged.has(top)) {
        mergedArr[top] *= 2;
        scoreGained += mergedArr[top];
        merged.add(top);
      } else {
        mergedArr.push(cell);
      }
    }
  }
  return { mergedArr, scoreGained };
};

export { addNewBlock, moveBlocks, merge };
