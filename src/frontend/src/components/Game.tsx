import { useEffect, useRef, useState } from 'react';
import '../styles/game.css';

interface GameProps {
  gameStatus: 'idle' | 'playing' | 'paused' | 'gameover';
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  color: string;
}

export default function Game({ gameStatus, onGameOver, onScoreUpdate }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const gameStateRef = useRef({
    ball: { x: 0, y: 0, dx: 4, dy: -4, radius: 8 } as Ball,
    paddle: { x: 0, y: 0, width: 100, height: 12 } as Paddle,
    bricks: [] as Brick[],
    keys: { left: false, right: false },
    animationId: 0,
  });

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = Math.min(container.clientWidth, 800);
        canvas.height = 500;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize game objects
    const state = gameStateRef.current;
    state.paddle.x = canvas.width / 2 - state.paddle.width / 2;
    state.paddle.y = canvas.height - 30;
    state.ball.x = canvas.width / 2;
    state.ball.y = canvas.height - 50;

    // Create bricks
    const brickRowCount = 5;
    const brickColumnCount = 8;
    const brickWidth = 80;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 60;
    const brickOffsetLeft = (canvas.width - (brickColumnCount * (brickWidth + brickPadding))) / 2;

    const colors = ['#FF6B35', '#F7931E', '#FDC830', '#37B679', '#4ECDC4'];
    state.bricks = [];

    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        state.bricks.push({
          x: brickOffsetLeft + c * (brickWidth + brickPadding),
          y: brickOffsetTop + r * (brickHeight + brickPadding),
          width: brickWidth,
          height: brickHeight,
          visible: true,
          color: colors[r % colors.length],
        });
      }
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw bricks
      state.bricks.forEach((brick) => {
        if (brick.visible) {
          ctx.fillStyle = brick.color;
          ctx.shadowColor = brick.color;
          ctx.shadowBlur = 10;
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
          ctx.shadowBlur = 0;
          
          // Brick border
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 2;
          ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        }
      });

      // Draw paddle
      const paddleGradient = ctx.createLinearGradient(
        state.paddle.x,
        state.paddle.y,
        state.paddle.x + state.paddle.width,
        state.paddle.y
      );
      paddleGradient.addColorStop(0, '#FF6B35');
      paddleGradient.addColorStop(0.5, '#F7931E');
      paddleGradient.addColorStop(1, '#FF6B35');
      ctx.fillStyle = paddleGradient;
      ctx.shadowColor = '#FF6B35';
      ctx.shadowBlur = 15;
      ctx.fillRect(state.paddle.x, state.paddle.y, state.paddle.width, state.paddle.height);
      ctx.shadowBlur = 0;

      // Draw ball
      ctx.beginPath();
      ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#FDC830';
      ctx.shadowColor = '#FDC830';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.closePath();
      ctx.shadowBlur = 0;
    };

    const update = () => {
      // Move paddle
      if (state.keys.left && state.paddle.x > 0) {
        state.paddle.x -= 7;
      }
      if (state.keys.right && state.paddle.x < canvas.width - state.paddle.width) {
        state.paddle.x += 7;
      }

      // Move ball
      state.ball.x += state.ball.dx;
      state.ball.y += state.ball.dy;

      // Wall collision
      if (state.ball.x + state.ball.radius > canvas.width || state.ball.x - state.ball.radius < 0) {
        state.ball.dx = -state.ball.dx;
      }
      if (state.ball.y - state.ball.radius < 0) {
        state.ball.dy = -state.ball.dy;
      }

      // Paddle collision
      if (
        state.ball.y + state.ball.radius > state.paddle.y &&
        state.ball.x > state.paddle.x &&
        state.ball.x < state.paddle.x + state.paddle.width
      ) {
        // Add spin based on where ball hits paddle
        const hitPos = (state.ball.x - state.paddle.x) / state.paddle.width;
        state.ball.dx = (hitPos - 0.5) * 8;
        state.ball.dy = -Math.abs(state.ball.dy);
      }

      // Brick collision
      state.bricks.forEach((brick) => {
        if (brick.visible) {
          if (
            state.ball.x > brick.x &&
            state.ball.x < brick.x + brick.width &&
            state.ball.y > brick.y &&
            state.ball.y < brick.y + brick.height
          ) {
            state.ball.dy = -state.ball.dy;
            brick.visible = false;
            const newScore = score + 10;
            setScore(newScore);
            onScoreUpdate(newScore);
          }
        }
      });

      // Game over
      if (state.ball.y + state.ball.radius > canvas.height) {
        onGameOver(score);
        return;
      }

      // Win condition
      if (state.bricks.every((brick) => !brick.visible)) {
        onGameOver(score);
        return;
      }
    };

    const gameLoop = () => {
      update();
      draw();
      state.animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (state.animationId) {
        cancelAnimationFrame(state.animationId);
      }
    };
  }, [gameStatus, score, onGameOver, onScoreUpdate]);

  // Keyboard controls
  useEffect(() => {
    const state = gameStateRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        state.keys.left = true;
      }
      if (e.key === 'ArrowRight') {
        state.keys.right = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        state.keys.left = false;
      }
      if (e.key === 'ArrowRight') {
        state.keys.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Reset score when game restarts
  useEffect(() => {
    if (gameStatus === 'idle') {
      setScore(0);
    }
  }, [gameStatus]);

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: '800px',
          display: 'block',
          margin: '0 auto',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
          borderRadius: '8px',
        }}
      />
      {gameStatus === 'idle' && (
        <div className="game-overlay">
          <div className="game-message">
            <h3 className="text-3xl font-black text-white mb-2">Ready to Play?</h3>
            <p className="text-white/80">Press Start to begin!</p>
          </div>
        </div>
      )}
      {gameStatus === 'paused' && (
        <div className="game-overlay">
          <div className="game-message">
            <h3 className="text-3xl font-black text-white mb-2">Paused</h3>
            <p className="text-white/80">Press Resume to continue</p>
          </div>
        </div>
      )}
      {gameStatus === 'gameover' && (
        <div className="game-overlay">
          <div className="game-message game-over">
            <h3 className="text-4xl font-black text-white mb-2">Game Over!</h3>
            <p className="text-2xl text-game-accent font-bold mb-4">Score: {score}</p>
            <p className="text-white/80">Press Start to play again</p>
          </div>
        </div>
      )}
    </div>
  );
}
