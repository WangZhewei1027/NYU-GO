"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Bus,
  Map,
  Route,
  Smartphone,
  Gauge,
  Shield,
  Zap,
  ArrowRight,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// 👉 Drop this component into any Next.js / React page.
// Tailwind + shadcn/ui + framer-motion + lucide-react assumed available.
// Mobile-first, clean palette, subtle motion, image placeholders.

const Accent = ({ children }: { children: React.ReactNode }) => (
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600">
    {children}
  </span>
);

const Section = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={`relative mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}
  >
    {children}
  </section>
);

const PhoneMock = ({
  src = "/nyugo/phone-hero.png",
  caption = "",
  shadow = true,
}) => (
  <div className="relative mx-auto aspect-[9/19] w-[82%] max-w-[380px] rounded-[2.2rem] border border-zinc-200 bg-zinc-900 shadow-2xl ring-1 ring-black/5 sm:w-[70%]">
    <div className="absolute inset-[6px] rounded-[2rem] overflow-hidden bg-black">
      {/* Image placeholder */}
      <img
        src={src}
        alt="NYU GO app preview"
        className="h-full w-full object-cover"
      />
    </div>
    {/* Notch */}
    <div className="absolute left-1/2 top-0 h-6 w-40 -translate-x-1/2 rounded-b-2xl bg-zinc-900" />
    {shadow && (
      <div className="absolute -inset-6 -z-10 blur-3xl bg-gradient-to-br from-purple-500/20 via-fuchsia-500/20 to-indigo-500/20 rounded-[3rem]" />
    )}
    {caption && (
      <p className="mt-4 text-center text-xs text-zinc-500">{caption}</p>
    )}
  </div>
);

const Feature = ({
  icon: Icon,
  title,
  desc,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  title: string;
  desc: string;
}) => (
  <Card className="border-zinc-200/70 shadow-sm">
    <CardContent className="p-5 flex items-start gap-4">
      <div className="rounded-xl p-2 bg-gradient-to-br from-purple-600/10 to-indigo-600/10 ring-1 ring-purple-600/20">
        <Icon className="size-6 text-purple-600" />
      </div>
      <div>
        <h3 className="font-semibold text-zinc-900">{title}</h3>
        <p className="text-sm text-zinc-600 mt-1 leading-6">{desc}</p>
      </div>
    </CardContent>
  </Card>
);

export default function NYUGO_LandingPage() {
  return (
    <div className="min-h-dvh bg-white text-zinc-900 [--nyupurple:#57068c] overflow-x-hidden">
      {/* ====== NAVBAR ====== */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <Section className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 grid place-items-center rounded-lg bg-[--nyupurple] text-white shadow-sm">
              <Bus className="size-4" />
            </div>
            <span className="font-bold tracking-tight">
              NYU <span className="text-[--nyupurple]">GO</span>
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" className="text-zinc-700">
              Features
            </Button>
            <Button variant="ghost" className="text-zinc-700">
              Screens
            </Button>
            <Button variant="ghost" className="text-zinc-700">
              FAQ
            </Button>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden sm:inline-flex">
              Open App
            </Button>
            <Button className="bg-[--nyupurple] hover:bg-[--nyupurple]/90">
              Get the PWA
            </Button>
          </div>
        </Section>
      </header>

      {/* ====== HERO ====== */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* soft background accents */}
          <div className="absolute right-0 top-[-10%] h-[45vh] w-[65vw] max-w-[90%] rounded-full blur-3xl bg-gradient-to-br from-purple-300/30 via-fuchsia-300/30 to-indigo-300/30" />
          <div className="absolute left-0 bottom-[-20%] h-[35vh] w-[55vw] max-w-[90%] rounded-full blur-3xl bg-gradient-to-tr from-purple-200/40 via-indigo-200/30 to-fuchsia-200/30" />
        </div>

        <Section className="py-10 sm:py-16">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center md:text-left"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Real‑time <Accent>NYU Shuttle</Accent> tracking.
              </h1>
              <p className="mt-3 text-zinc-600 leading-7">
                Plan your campus commute with live buses, smart ETAs, and
                beautiful maps. Designed for speed. Built for students.
              </p>
              <div className="mt-6 flex items-center justify-center md:justify-start gap-3">
                <Button
                  size="lg"
                  className="bg-[--nyupurple] hover:bg-[--nyupurple]/90"
                >
                  <Zap className="mr-2 size-4" /> Launch Now
                </Button>
                <Button size="lg" variant="outline">
                  <PlayCircle className="mr-2 size-4" /> Watch Demo
                </Button>
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                PWA ready · iOS & Android · Works offline*
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <PhoneMock
                src="/landing/phone-hero.png"
                caption="Live bus locations · ETA · Route overlays"
              />
            </motion.div>
          </div>
        </Section>
      </div>

      {/* ====== STATS STRIP ====== */}
      <div className="border-y border-zinc-100 bg-zinc-50/60">
        <Section className="py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            ["Live routes", "12"],
            ["Avg. refresh", "2s"],
            ["Campuses", "3"],
            ["Daily users", "1,200+"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col">
              <span className="text-sm text-zinc-500">{k}</span>
              <span className="text-lg font-semibold">{v}</span>
            </div>
          ))}
        </Section>
      </div>

      {/* ====== FEATURES ====== */}
      <Section className="py-12 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Built for campus life
          </h2>
          <p className="mt-2 text-zinc-600">
            Fast, dependable, and delightful on the go.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Feature
            icon={Map}
            title="Beautiful Maps"
            desc="Crisp, touch-friendly maps with route overlays and stop details."
          />
          <Feature
            icon={Gauge}
            title="Smart ETA"
            desc="Predictive arrival times that update in real time."
          />
          <Feature
            icon={Route}
            title="Multi-Route"
            desc="Switch across routes instantly with color-coded clarity."
          />
          <Feature
            icon={Shield}
            title="Reliable Offline"
            desc="Key assets cached for when your signal drops."
          />
        </div>
      </Section>

      {/* ====== SHOWCASE / SCREENS ====== */}
      {/* <Section className="py-8 sm:py-12">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Screens</h3>
          <a
            href="#"
            className="text-sm text-[--nyupurple] inline-flex items-center"
          >
            See more <ArrowRight className="ml-1 size-4" />
          </a>
        </div>
        <div className="mt-4 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2">
          {[
            "/onboarding/onboarding1.gif",
            "/onboarding/onboarding2.gif",
            "/onboarding/onboarding3.gif",
          ].map((src) => (
            <div key={src} className="shrink-0 snap-center">
              <PhoneMock src={src} shadow={false} />
            </div>
          ))}
        </div>
      </Section> */}

      {/* ====== HOW IT WORKS ====== */}
      <Section className="py-12">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-xl font-semibold">How it works</h3>
            <ol className="mt-4 space-y-4">
              {[
                [
                  "Open NYU GO",
                  "Add the PWA to your home screen for 1‑tap access.",
                ],
                ["Pick a Route", "Choose your shuttle line and nearest stop."],
                [
                  "Track Live",
                  "Watch buses move in real time with minute‑by‑minute ETAs.",
                ],
                [
                  "Get Notified",
                  "Optional alerts for arrivals and service changes.",
                ],
              ].map(([title, desc], i) => (
                <li key={i} className="flex gap-3">
                  <div className="mt-1 size-6 rounded-full bg-purple-600/10 text-purple-700 grid place-items-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-sm text-zinc-600">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative">
              <div className="absolute -inset-6 -z-10 blur-3xl bg-gradient-to-br from-purple-400/20 via-fuchsia-400/20 to-indigo-400/20 rounded-3xl" />
              <img
                src="/onboarding/onboarding1.gif"
                alt="NYU GO route map demo"
                className="w-full rounded-2xl border border-zinc-200 shadow-lg"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ====== FAQ ====== */}
      <Section className="py-10 sm:py-14">
        <div className="mx-auto max-w-2xl">
          <h3 className="text-xl font-semibold">FAQ</h3>
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="q1">
              <AccordionTrigger>
                Does NYU GO work on both iOS and Android?
              </AccordionTrigger>
              <AccordionContent>
                Yes. It’s a progressive web app designed for Safari and Chrome.
                Add to Home Screen for the best experience.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Are the ETAs accurate?</AccordionTrigger>
              <AccordionContent>
                ETAs are updated every few seconds using live vehicle telemetry
                and route data. Network conditions may affect precision.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Does it work offline?</AccordionTrigger>
              <AccordionContent>
                Key assets and your last viewed map are cached. Real‑time
                features require connectivity.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Section>

      {/* ====== CTA ====== */}
      <Section className="py-10">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-6 sm:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute -left-16 -bottom-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl font-semibold">
              Catch your next shuttle with <Accent>NYU GO</Accent>
            </h3>
            <p className="mt-1 text-sm text-zinc-600">
              Lightning-fast, student-made, campus‑smart.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-[--nyupurple] hover:bg-[--nyupurple]/90"
              >
                <Smartphone className="mr-2 size-4" /> Add to Home Screen
              </Button>
              <Button size="lg" variant="outline">
                <Map className="mr-2 size-4" /> Explore Routes
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ====== FOOTER ====== */}
      <footer className="mt-12 border-t border-zinc-100">
        <Section className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            Built by{" "}
            <span className="font-medium text-zinc-700">David Zhewei Wang</span>{" "}
            (full‑stack) &nbsp;and&nbsp;{" "}
            <span className="font-medium text-zinc-700">Chanel Shuya Feng</span>{" "}
            (UI/UX).
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-700">
              Privacy
            </a>
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-700">
              Terms
            </a>
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-700">
              Contact
            </a>
          </div>
        </Section>
      </footer>
    </div>
  );
}
