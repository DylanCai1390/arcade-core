# Changelog

All notable changes to this package are documented here. Versions follow [Semantic Versioning](https://semver.org/).

## [1.1.0] - 2026-11-02

### Added

- `describeMove(board, direction)` returns the new board together with the points the move earned, the path of every tile, and whether anything changed. Apps can use it to keep score and to animate tiles without repeating the game rules.

## [1.0.0] - 2026-11-02

### Added

- `move(board, direction)` slides and merges tiles and returns a new board.
- `spawn(board, rng?)` adds a 2 or a 4 to a random empty cell.
- `hasMoves(board)` reports whether any move is still possible.
- `canMove(board, direction)` reports whether one direction would change the board.
- `DIRECTIONS` lists the four valid directions.
