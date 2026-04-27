import confetti from 'canvas-confetti'

export function useConfetti() {
  const fire = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#6366f1', '#8b5cf6', '#34d399', '#f59e0b'] })
    setTimeout(() => confetti({ particleCount: 50, spread: 120, origin: { y: 0.5 }, colors: ['#818cf8', '#c084fc'] }), 180)
  }
  return { fire }
}
