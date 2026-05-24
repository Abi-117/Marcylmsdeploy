import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

const nav = [
  // { to: "/", label: "Home" },
  // { to: "/about", label: "About" },
  // { to: "/courses", label: "Courses" },
  // { to: "/events", label: "Events" },
  // { to: "/gallery", label: "Gallery" },
  // { to: "/pricing", label: "Pricing" },
  // { to: "/faq", label: "FAQ" },
  // { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useLocation().pathname;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        {/* <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`text-sm font-medium transition-colors hover:text-foreground ${pathname === n.to ? "text-foreground" : "text-muted-foreground"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav> */}
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-gold">
            <Link to="/signup">Book trial</Link>
          </Button>
        </div>
        <button onClick={() => setOpen(!open)} className="lg:hidden">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="flex flex-col gap-1 p-4">
            {/* {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent">
                {n.label}
              </Link>
            ))} */}
            <div className="mt-2 flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1"><Link to="/login">Sign in</Link></Button>
              <Button asChild size="sm" className="flex-1 bg-gold text-gold-foreground hover:bg-gold/90"><Link to="/signup">Trial</Link></Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground">
            India's premier academy for music & speech — structured programs, certified mentors, and global standards.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Academy</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/events">Events & Recitals</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Support</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login">Student login</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Visit us</div>
          <p className="mt-3 text-sm text-muted-foreground">
            42 Symphony Lane, Bandra West<br />Mumbai 400050<br />+91 98200 12345
          </p>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Music & Speech Academy. All rights reserved.
      </div>
    </footer>
  );
}
