import { test } from 'node:test';
import assert from 'node:assert/strict';
import { move, spawn, hasMoves, canMove, DIRECTIONS } from '../src/index.js';

const empty = () => [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const freeze = (board) => Object.freeze(board.map((row) => Object.freeze([...row])));

const stuck = [
  [2, 4, 2, 4],
  [4, 2, 4, 2],
  [2, 4, 2, 4],
  [4, 2, 4, 2],
];

test('move slides tiles as far as they can go', () => {
  const board = [
    [0, 0, 0, 2],
    [0, 4, 0, 0],
    [0, 0, 0, 0],
    [8, 0, 0, 0],
  ];
  assert.deepEqual(move(board, 'left'), [
    [2, 0, 0, 0],
    [4, 0, 0, 0],
    [0, 0, 0, 0],
    [8, 0, 0, 0],
  ]);
  assert.deepEqual(move(board, 'down'), [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [8, 4, 0, 2],
  ]);
});

test('each tile merges at most once per move', () => {
  const row = (cells) => [cells, [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  assert.deepEqual(move(row([2, 2, 2, 2]), 'left')[0], [4, 4, 0, 0]);
  assert.deepEqual(move(row([4, 4, 8, 0]), 'left')[0], [8, 8, 0, 0]);
  assert.deepEqual(move(row([2, 2, 2, 0]), 'right')[0], [0, 0, 2, 4]);
  assert.deepEqual(move(row([2, 0, 2, 4]), 'left')[0], [4, 4, 0, 0]);
});

test('merges happen toward the direction of the move', () => {
  const board = [
    [2, 0, 0, 0],
    [2, 0, 0, 0],
    [2, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  assert.deepEqual(move(board, 'up').map((row) => row[0]), [4, 2, 0, 0]);
  assert.deepEqual(move(board, 'down').map((row) => row[0]), [0, 0, 2, 4]);
});

test('move never changes the board it is given', () => {
  const board = freeze([
    [2, 2, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 4, 4],
    [0, 0, 0, 0],
  ]);
  for (const direction of DIRECTIONS) {
    assert.doesNotThrow(() => move(board, direction));
  }
  assert.deepEqual(board[0], [2, 2, 0, 0]);
});

test('canMove is false when a move would change nothing', () => {
  const board = [
    [2, 4, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  assert.equal(canMove(board, 'left'), false);
  assert.equal(canMove(board, 'up'), false);
  assert.equal(canMove(board, 'right'), true);
  assert.equal(canMove(board, 'down'), true);
});

test('canMove is true when only a merge is possible', () => {
  const board = [
    [2, 2, 4, 8],
    [4, 8, 2, 4],
    [8, 2, 4, 2],
    [2, 4, 8, 4],
  ];
  assert.equal(canMove(board, 'left'), true);
  assert.equal(canMove(board, 'up'), false);
});

test('hasMoves reports whether the game can continue', () => {
  assert.equal(hasMoves(stuck), false);
  assert.equal(hasMoves(empty()), false);
  const open = stuck.map((row) => [...row]);
  open[3][3] = 0;
  assert.equal(hasMoves(open), true);
  const pair = stuck.map((row) => [...row]);
  pair[0][1] = 2;
  assert.equal(hasMoves(pair), true);
});

test('spawn places one 2 or 4 in an empty cell', () => {
  const board = freeze(empty());
  const placed = spawn(board, () => 0);
  assert.equal(placed[0][0], 2);
  assert.equal(placed.flat().filter((value) => value !== 0).length, 1);
  assert.deepEqual(board, empty());
});

test('spawn uses the rng to choose the cell and the value', () => {
  const values = [0.99, 0.95];
  const placed = spawn(empty(), () => values.shift());
  assert.equal(placed[3][3], 4);
});

test('spawn only uses empty cells and leaves a full board alone', () => {
  const board = stuck.map((row) => [...row]);
  board[1][2] = 0;
  const placed = spawn(board, () => 0.5);
  assert.notEqual(placed[1][2], 0);
  assert.deepEqual(spawn(stuck), stuck);
});

test('spawn works with the default Math.random', () => {
  const placed = spawn(empty());
  const tiles = placed.flat().filter((value) => value !== 0);
  assert.equal(tiles.length, 1);
  assert.ok(tiles[0] === 2 || tiles[0] === 4);
});

test('invalid input throws a TypeError', () => {
  assert.throws(() => move(empty(), 'sideways'), TypeError);
  assert.throws(() => move([[2, 2]], 'left'), TypeError);
  assert.throws(() => spawn('not a board'), TypeError);
});
