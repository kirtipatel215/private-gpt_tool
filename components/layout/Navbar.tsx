"use client";

import { Settings, PanelRight, PanelRightClose, Apple } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

type NavbarProps = {
  isPanelOpen: boolean;
  togglePanel: () => void;
};

export function Navbar({ isPanelOpen, togglePanel }: NavbarProps) {
  return (
    <nav className="h-[72px] w-full flex items-center justify-between px-4 sm:px-8 bg-brand-secondary/70 backdrop-blur-md border-b border-brand-border z-20 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-brand-primary rounded-xl flex items-center justify-center text-brand-secondary">
          <Apple size={20} className="mb-0.5" />
        </div>
        <span className="text-xl font-semibold tracking-tight text-brand-text hidden sm:inline-block">PrivateGPT</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <button className="p-2.5 rounded-full bg-brand-secondary border border-brand-border hover:bg-brand-button-hover transition-colors text-brand-text-muted">
          <Settings size={20} />
        </button>
        <button 
          onClick={togglePanel}
          className={`p-2.5 rounded-full transition-colors border ${isPanelOpen ? 'bg-brand-button-hover border-transparent text-brand-text shadow-inner' : 'bg-brand-secondary border-brand-border hover:bg-brand-button-hover text-brand-text-muted'}`}
          title="Toggle Sidebar"
        >
          {isPanelOpen ? <PanelRightClose size={20} /> : <PanelRight size={20} />}
        </button>
      </div>
    </nav>
  );
}
