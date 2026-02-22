import { useState } from 'react';
import Game from '../components/Game';
import GameControls from '../components/GameControls';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy, Zap, Target } from 'lucide-react';

export default function GamePage() {
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'paused' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleGameStart = () => {
    setGameStatus('playing');
    setScore(0);
  };

  const handleGamePause = () => {
    setGameStatus('paused');
  };

  const handleGameResume = () => {
    setGameStatus('playing');
  };

  const handleGameOver = (finalScore: number) => {
    setGameStatus('gameover');
    if (finalScore > highScore) {
      setHighScore(finalScore);
    }
  };

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background via-background to-game-primary/5">
      {/* Hero Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Game Hub Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl tracking-tight">
              Brick Breaker
            </h2>
            <p className="text-lg md:text-xl text-white/90 font-bold drop-shadow-lg">
              Break all the bricks and set a high score!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-game-primary/20 shadow-xl shadow-game-primary/10">
              <CardContent className="p-6">
                <Game
                  gameStatus={gameStatus}
                  onGameOver={handleGameOver}
                  onScoreUpdate={handleScoreUpdate}
                />
              </CardContent>
            </Card>

            {/* Controls */}
            <GameControls
              gameStatus={gameStatus}
              onStart={handleGameStart}
              onPause={handleGamePause}
              onResume={handleGameResume}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Score Card */}
            <Card className="border-2 border-game-secondary/20 bg-gradient-to-br from-card to-game-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-game-accent" />
                  Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground font-medium mb-1">Current Score</div>
                  <div className="text-5xl font-black text-game-primary tabular-nums">
                    {score}
                  </div>
                </div>
                <div className="text-center pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground font-medium mb-1">High Score</div>
                  <div className="text-3xl font-black text-game-accent tabular-nums">
                    {highScore}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card className="border-2 border-game-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-game-primary" />
                  How to Play
                </CardTitle>
                <CardDescription>Master the controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-game-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-game-primary">←→</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Arrow Keys</div>
                    <div className="text-xs text-muted-foreground">Move paddle left and right</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-game-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-game-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Objective</div>
                    <div className="text-xs text-muted-foreground">Break all bricks without dropping the ball</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-game-accent/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-game-accent">+10</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Scoring</div>
                    <div className="text-xs text-muted-foreground">Each brick is worth 10 points</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
