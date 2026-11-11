import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, RotateCcw, Terminal, X } from 'lucide-react'
import { chooseComputerMove, getResult } from './data/ticTacToe'

export default function ProjectChallenge({ onClose, onUnlock }) {
  const reduceMotion = useReducedMotion()
  const dialogRef = useRef(null)
  const [board, setBoard] = useState(Array(9).fill(null))
  const [turn, setTurn] = useState('X')
  const result = getResult(board)
  const status = result?.winner === 'X'
    ? 'You won! The project directory is ready to unlock.'
    : result?.winner === 'O'
      ? 'Computer wins this round. Try again!'
      : result
        ? 'It’s a draw. Try again to unlock the projects.'
        : turn === 'X' ? 'Your turn. Choose an empty square.' : 'Computer is thinking...'

  useEffect(() => {
    const previousFocus = document.activeElement
    dialogRef.current?.querySelector('button')?.focus()
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll('button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')
        if (!focusable?.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus?.()
    }
  }, [onClose])

  useEffect(() => {
    if (turn !== 'O' || result) return undefined
    const timer = window.setTimeout(() => {
      const move = chooseComputerMove(board)
      if (move === null) return
      const next = [...board]
      next[move] = 'O'
      setBoard(next)
      setTurn('X')
    }, reduceMotion ? 0 : 450)
    return () => window.clearTimeout(timer)
  }, [board, turn, result, reduceMotion])

  function play(index) {
    if (turn !== 'X' || result || board[index]) return
    const next = [...board]
    next[index] = 'X'
    setBoard(next)
    if (!getResult(next)) setTurn('O')
  }

  function reset() {
    setBoard(Array(9).fill(null))
    setTurn('X')
  }

  return (
    <motion.div
      className="dialog-backdrop"
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.22 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.section
        ref={dialogRef}
        className="project-dialog challenge-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="challenge-title"
        aria-describedby="challenge-instructions"
        initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: reduceMotion ? 0 : 0.22 }}
      >
        <div className="dialog-topline">
          <span><Terminal size={15} /> sanjay.dev / projects / challenge</span>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close project challenge"><X size={18} /></button>
        </div>
        <div className="dialog-content challenge-content">
          <p className="eyebrow"><span>01</span> / A LITTLE CHALLENGE</p>
          <h2 id="challenge-title">Play to unlock<span className="challenge-title-dot">.</span></h2>
          <p id="challenge-instructions" className="challenge-intro">Beat the computer at tic-tac-toe to explore all projects. Get three in a row to win!</p>
          <div className="challenge-players">
            <div className="challenge-player player-you"><span className="player-mark">X</span><span>YOU <small>First move</small></span></div>
            <span className="challenge-vs">VS</span>
            <div className="challenge-player player-computer"><span className="player-mark">O</span><span>COMPUTER <small>Ready to play</small></span></div>
          </div>
          <div className="challenge-board" role="group" aria-label="Tic-tac-toe board">
            {board.map((cell, index) => (
              <button
                key={index}
                type="button"
                className={`challenge-cell${cell ? ` mark-${cell.toLowerCase()}` : ''}${result?.line.includes(index) ? ' is-winning' : ''}`}
                aria-label={`Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}: ${cell === 'X' ? 'your X' : cell === 'O' ? 'computer O' : 'empty'}`}
                aria-disabled={Boolean(cell || result || turn !== 'X')}
                onClick={() => play(index)}
              >
                {cell}
              </button>
            ))}
          </div>
          <p className="challenge-status" role="status" aria-live="polite"><span>&gt;_</span> {status}</p>
          <div className="challenge-actions">
            {result?.winner === 'X' ? (
              <button className="button button-primary" type="button" onClick={onUnlock}>Explore all projects <ArrowRight size={15} /></button>
            ) : (
              <button className="button button-secondary" type="button" onClick={reset}><RotateCcw size={14} /> Restart game</button>
            )}
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
}
