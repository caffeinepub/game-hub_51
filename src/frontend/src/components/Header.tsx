import { Gamepad2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-game-primary to-game-secondary flex items-center justify-center shadow-lg shadow-game-primary/20">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                Game Hub
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Arcade Action</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-full bg-game-primary/10 border border-game-primary/20">
              <span className="text-sm font-bold text-game-primary">Ready to Play</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
