import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  gameStatus: 'idle' | 'playing' | 'paused' | 'gameover';
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
}

export default function GameControls({ gameStatus, onStart, onPause, onResume }: GameControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {(gameStatus === 'idle' || gameStatus === 'gameover') && (
        <Button
          onClick={onStart}
          size="lg"
          className="bg-gradient-to-r from-game-primary to-game-secondary hover:from-game-primary/90 hover:to-game-secondary/90 text-white font-bold px-8 py-6 text-lg shadow-lg shadow-game-primary/30 transition-all hover:scale-105"
        >
          <Play className="w-5 h-5 mr-2" />
          {gameStatus === 'gameover' ? 'Play Again' : 'Start Game'}
        </Button>
      )}
      {gameStatus === 'playing' && (
        <Button
          onClick={onPause}
          size="lg"
          variant="outline"
          className="border-2 border-game-secondary text-game-secondary hover:bg-game-secondary hover:text-white font-bold px-8 py-6 text-lg transition-all hover:scale-105"
        >
          <Pause className="w-5 h-5 mr-2" />
          Pause
        </Button>
      )}
      {gameStatus === 'paused' && (
        <Button
          onClick={onResume}
          size="lg"
          className="bg-gradient-to-r from-game-primary to-game-secondary hover:from-game-primary/90 hover:to-game-secondary/90 text-white font-bold px-8 py-6 text-lg shadow-lg shadow-game-primary/30 transition-all hover:scale-105"
        >
          <Play className="w-5 h-5 mr-2" />
          Resume
        </Button>
      )}
      {gameStatus === 'gameover' && (
        <Button
          onClick={onStart}
          size="lg"
          variant="outline"
          className="border-2 border-game-accent text-game-accent hover:bg-game-accent hover:text-white font-bold px-8 py-6 text-lg transition-all hover:scale-105"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Restart
        </Button>
      )}
    </div>
  );
}
