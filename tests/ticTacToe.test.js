import test from 'node:test'
import assert from 'node:assert/strict'
import { chooseComputerMove, getResult, winningLines } from '../src/data/ticTacToe.js'

test('recognizes all winning lines for either player', () => {
  for (const line of winningLines) {
    for (const player of ['X', 'O']) {
      const board = Array(9).fill(null)
      for (const index of line) board[index] = player
      assert.deepEqual(getResult(board), { winner: player, line })
    }
  }
})

test('recognizes draws and unfinished boards', () => {
  assert.deepEqual(getResult(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']), { winner: null, line: [] })
  assert.equal(getResult(Array(9).fill(null)), null)
})

test('computer takes a winning move, otherwise chooses an empty square', () => {
  assert.equal(chooseComputerMove(['O', 'O', null, 'X', 'X', null, null, null, null], () => 0.99), 2)
  assert.equal(chooseComputerMove(['X', null, null, null, null, null, null, null, null], () => 0), 1)
  assert.equal(chooseComputerMove(['X', null, null, null, null, null, null, null, null], () => 0.99), 8)
  assert.equal(chooseComputerMove(['X', 'X', 'X', 'O', 'O', null, null, null, null]), null)
  assert.equal(chooseComputerMove(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']), null)
})
