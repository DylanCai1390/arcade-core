const SIZE = 4;

const VECTORS = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

export const DIRECTIONS = Object.freeze(Object.keys(VECTORS));

function assertBoard(board) {
  const valid =
    Array.isArray(board) &&
    board.length === SIZE &&
    board.every((row) => Array.isArray(row) && row.length === SIZE && row.every(Number.isInteger));
  if (!valid) {
    throw new TypeError('board must be a 4x4 array of integers, with 0 for empty cells');
  }
}

function assertDirection(direction) {
  if (!Object.hasOwn(VECTORS, direction)) {
    throw new TypeError(`direction must be one of: ${DIRECTIONS.join(', ')}`);
  }
}

function inBounds({ row, col }) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

function traversalOrder(vector) {
  const forward = [0, 1, 2, 3];
  const backward = [3, 2, 1, 0];
  const rows = vector.row === 1 ? backward : forward;
  const cols = vector.col === 1 ? backward : forward;
  return rows.flatMap((row) => cols.map((col) => ({ row, col })));
}

function farthestPosition(grid, start, vector) {
  let farthest = start;
  let next = { row: start.row + vector.row, col: start.col + vector.col };
  while (inBounds(next) && grid[next.row][next.col] === 0) {
    farthest = next;
    next = { row: next.row + vector.row, col: next.col + vector.col };
  }
  return { farthest, next };
}

export function describeMove(board, direction) {
  assertBoard(board);
  assertDirection(direction);

  const vector = VECTORS[direction];
  const grid = board.map((row) => [...row]);
  const combined = board.map((row) => row.map(() => false));
  const moves = [];
  let points = 0;

  for (const cell of traversalOrder(vector)) {
    const value = grid[cell.row][cell.col];
    if (value === 0) continue;

    const { farthest, next } = farthestPosition(grid, cell, vector);
    const joins =
      inBounds(next) && grid[next.row][next.col] === value && !combined[next.row][next.col];
    const target = joins ? next : farthest;

    grid[cell.row][cell.col] = 0;
    grid[target.row][target.col] = joins ? value * 2 : value;

    if (joins) {
      combined[target.row][target.col] = true;
      points += value * 2;
    }

    moves.push({ from: cell, to: target, merged: joins });
  }

  const changed = moves.some(
    ({ from, to, merged }) => merged || from.row !== to.row || from.col !== to.col,
  );

  return { board: grid, points, moves, changed };
}

export function move(board, direction) {
  return describeMove(board, direction).board;
}

export function canMove(board, direction) {
  return describeMove(board, direction).changed;
}

export function hasMoves(board) {
  return DIRECTIONS.some((direction) => canMove(board, direction));
}

export function spawn(board, rng = Math.random) {
  assertBoard(board);
  const next = board.map((row) => [...row]);
  const empty = [];
  next.forEach((row, r) => row.forEach((value, c) => {
    if (value === 0) empty.push({ row: r, col: c });
  }));
  if (empty.length === 0) return next;

  const cell = empty[Math.floor(rng() * empty.length)];
  next[cell.row][cell.col] = rng() < 0.9 ? 2 : 4;
  return next;
}
