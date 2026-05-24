import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <div className="relative">
        <div className="absolute inset-0 rounded-lg bg-gold/40 blur-md" />
        <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold via-gold to-gold/70 font-display text-base font-bold text-gold-foreground shadow-gold">
          M
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-base font-semibold tracking-tight">Music & Speech</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Academy · est. 2014</span>
      </div>
    </Link>
  );
}
