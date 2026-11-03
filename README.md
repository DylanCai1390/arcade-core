# @wenjuncai1390/arcade-core

Pure game logic for 2048. Every function takes a board and returns a new one. Nothing here touches the DOM, imports a UI framework, or assumes a browser, so it runs the same in Node, in a browser, or on a server.

It powers the 2048 game in [Wenjun Cai’s Arcade](https://dylancai1390.github.io/arcade/).

## Install

```sh
npm install @wenjuncai1390/arcade-core
```

## Usage

```js
import { move, spawn, hasMoves, canMove } from '@wenjuncai1390/arcade-core';

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

board = spawn(spawn(board));

if (canMove(board, 'left')) {
  board = spawn(move(board, 'left'));
}

if (!hasMoves(board)) {
  console.log('Game over');
}
```

## The board

A board is a 4×4 array of rows. Each cell holds a tile value (`2`, `4`, `8`, …) or `0` for an empty cell.

A direction is one of `'up'`, `'down'`, `'left'`, or `'right'`. The list is also exported as `DIRECTIONS`.

## API

| Function | Returns |
| --- | --- |
| `move(board, direction)` | A new board with every tile slid as far as it can go in that direction. Equal neighbours merge once each, so `2 2 2 2` becomes `4 4`, not `8`. |
| `spawn(board, rng?)` | A new board with a `2` (90% of the time) or a `4` in a random empty cell. `rng` defaults to `Math.random`; pass your own function returning a number in `[0, 1)` for repeatable results. A full board is returned unchanged. |
| `hasMoves(board)` | `true` if any direction would change the board, `false` when the game is over. |
| `canMove(board, direction)` | `true` if moving in that direction would change the board, `false` if nothing would happen. |

None of the functions change the board you pass in. Invalid boards or directions throw a `TypeError`.

## Development

```sh
npm test
```

Tests use Node’s built-in test runner, so there is nothing to install. They also run on every push through GitHub Actions.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE) © 2026 Wenjun Cai
