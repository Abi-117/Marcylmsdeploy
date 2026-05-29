import { Link } from "react-router-dom";
import logo from "@/assets/logo.webp";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <div className="relative">
        
          <img src={logo} alt="Logo" className="h-16 w-16" />
        
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-base font-semibold tracking-tight">Marcys Academy</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Music & Speech</span>
      </div>
    </Link>
  );
}
