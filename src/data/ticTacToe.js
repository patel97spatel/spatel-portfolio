export const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

export function getResult(board) {
  const line = winningLines.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c])
  if (line) return { winner: board[line[0]], line }
  if (board.every(Boolean)) return { winner: null, line: [] }
  return null
}

export function chooseComputerMove(board, random = Math.random) {
  if (getResult(board)) return null
  const available = board.flatMap((cell, index) => cell ? [] : [index])
  const winningMove = available.find((index) => {
    const next = [...board]
    next[index] = 'O'
    return getResult(next)?.winner === 'O'
  })
  return winningMove ?? available[Math.floor(random() * available.length)]
}
