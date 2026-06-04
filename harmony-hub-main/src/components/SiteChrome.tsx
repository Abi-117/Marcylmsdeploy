import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import logo from "@/assets/logo.png";

import { Button } from "@/components/ui/button";

// =======================================
// NAV
// =======================================

const nav = [];

// =======================================
// HEADER
// =======================================

export function SiteHeader() {

  const [open, setOpen] =
    useState(false);

  const pathname =
    useLocation().pathname;

  return (

    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-8">

        {/* LOGO */}

        <div className="flex items-center gap-3">

          <img
            src={logo}
            alt="logo"
            className="h-20 w-20 rounded-md object-cover"
          />

          <div className="hidden sm:block">

            <div className="text-xl font-semibold text-gold">

              Marcys Academy

            </div>

            <div className="text-[14px] text-muted-foreground">

              Music & Performance Arts

            </div>

          </div>

        </div>

        {/* DESKTOP BUTTONS */}

        <div className="hidden items-center gap-2 lg:flex">

          <Button
            asChild
            variant="ghost"
            size="lg"
          >
            <Link to="/login">
              Sign in
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            className="bg-gold text-gold-foreground hover:bg-gold/90"
          >
            <Link to="/signup">
              Book Now
            </Link>
          </Button>

        </div>

        {/* MOBILE MENU */}

        <button
          onClick={() =>
            setOpen(!open)
          }
          className="lg:hidden"
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

      </div>

      {/* MOBILE */}

      {open && (

        <div className="border-t border-border bg-background lg:hidden">

          <div className="flex flex-col gap-3 p-4">

            <Button
              asChild
              variant="outline"
              size="sm"
            >
              <Link to="/login">
                Sign in
              </Link>
            </Button>

            <Button
              asChild
              size="sm"
              className="bg-gold text-gold-foreground hover:bg-gold/90"
            >
              <Link to="/signup">
                Book Trial
              </Link>
            </Button>

          </div>

        </div>

      )}

    </header>

  );

}

// =======================================
// FOOTER
// =======================================

export function SiteFooter() {

  return (

    <footer className="relative overflow-hidden border-t border-gold/10 bg-black text-white">

      {/* BG EFFECT */}

      <div className="absolute inset-0 opacity-20">

        <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,#d4af3720,transparent_35%),radial-gradient(circle_at_bottom_left,#d4af3710,transparent_30%)]" />

      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-14">

        {/* GRID */}

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">

          {/* LOGO */}

          <div>

            <img
              src={logo}
              alt="logo"
              className="h-16 w-16 rounded-md object-cover"
            />

            <h2 className="mt-4 text-2xl font-semibold text-gold">

              Marcys Academy

            </h2>

            <p className="mt-3 text-sm leading-7 text-zinc-300">

              Western Music |
              Performance Arts

            </p>

            <p className="mt-5 max-w-xs text-sm leading-7 text-zinc-400">

              (TCL) Trinity College,
              (RSL) RockSchool Awards,
              London, UK Syllabus

            </p>

          </div>

          {/* QUICK LINKS */}

          <div>

            <h3 className="mb-5 text-lg font-semibold text-white">

              Quick Links

            </h3>

            <div className="space-y-3 text-sm text-zinc-300">

              <Link
                to="/"
                className="block transition hover:text-gold"
              >
                Home
              </Link>

              <Link
                to="/login"
               className="block transition hover:text-gold"
              >
                login
              </Link>

             

             
             
            </div>

          </div>

          {/* WESTERN MUSIC */}

          <div>

            <h3 className="mb-5 text-lg font-semibold text-white">

              Western Music

            </h3>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-zinc-300">

              <div>Guitar</div>
              <div>Piano</div>

              <div>Singing</div>
              <div>Drums</div>

              <div>Electric Guitar</div>
              <div>Keyboard</div>

              <div>Violin</div>
              <div>Ukulele</div>

              <div>Bass Guitar</div>
              <div>Classical Guitar</div>

              <div>Acoustic Guitar</div>
              <div>Music Theory</div>

              <div>Music Production</div>

            </div>

          </div>

          {/* PERFORMANCE */}

          <div>

            <h3 className="mb-5 text-lg font-semibold text-white">

              Performance Arts

            </h3>

            <div className="space-y-3 text-sm text-zinc-300">

              <div>Speech & Drama</div>

              <div>Musical Theatre</div>

              <div>Public Speaking Skill</div>

              <div>Communication Skill</div>

              <div>Acting Skills</div>

              <div>Screen Acting</div>

            </div>

          </div>

          {/* CONTACT */}

          <div>

            <h3 className="mb-5 text-lg font-semibold text-white">

              Reach Us

            </h3>

            <div className="space-y-7">

              <div>

                <div className="text-base font-semibold text-gold">

                  Western Music

                </div>

                <div className="mt-2 text-sm text-zinc-300">

                  +91 90258 49150

                </div>

              </div>

              <div>

                <div className="text-base font-semibold text-gold">

                  Performance Arts

                </div>

                <div className="mt-2 text-sm text-zinc-300">

                  +91 98401 983480

                </div>

              </div>

              <div>

                <div className="text-base font-semibold text-gold">

                  Reach Out

                </div>

                <div className="mt-2 space-y-2 text-sm text-zinc-300">

                  <div>
                    contact@marcysacademy.com
                  </div>

                  <div>
                    marcysacademy@gmail.com
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM */}

        <div className="mt-12 border-t border-gold/10 pt-6 text-center text-sm text-zinc-400">

          © 2026 Marcys Academy of Music & Speech.
          All rights reserved.

        </div>

      </div>

    </footer>

  );

}