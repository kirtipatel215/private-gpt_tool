"use client";

import { Loader2, Sparkles, ArrowUp, X, PanelRightClose } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { SummaryData, DocumentInfo } from "@/types";

type SidebarProps = {
  isPanelOpen: boolean;
  closePanel: () => void;
  summary: SummaryData | null;
  isSummarizing: boolean;
  question: string;
  setQuestion: (q: string) => void;
  answer: string | null;
  isAnswering: boolean;
  handleAskQuestion: (q?: string) => void;
  documents: DocumentInfo[];
};

export function Sidebar({
  isPanelOpen,
  closePanel,
  summary,
  isSummarizing,
  question,
  setQuestion,
  answer,
  isAnswering,
  handleAskQuestion,
  documents
}: SidebarProps) {
  return (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          {/* Mobile Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePanel}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 z-30 md:hidden"
          />

          <motion.div 
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 md:static w-[90vw] sm:w-[400px] md:w-[350px] lg:w-[420px] shrink-0 md:h-full bg-brand-bg/95 md:bg-brand-bg/60 backdrop-blur-xl border-l border-brand-border flex flex-col z-40 md:z-20 box-border"
          >
            <div className="p-4 sm:p-6 border-b border-brand-border flex items-center justify-between shrink-0 top-safe relative">
              <h3 className="text-sm font-bold tracking-tight text-brand-text flex items-center gap-2">
                <Sparkles size={18} strokeWidth={2} className="text-brand-accent" /> AI Summary
              </h3>
              <button onClick={closePanel} className="p-2 -mr-2 text-brand-text-muted hover:text-brand-text md:hidden rounded-full hover:bg-brand-secondary transition-colors">
                <PanelRightClose size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* AI Summary Section */}
              <div className="space-y-3">
                {isSummarizing ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="animate-spin text-brand-accent" size={32} />
                    <p className="text-[13px] text-brand-text-muted animate-pulse">Analyzing document...</p>
                  </div>
                ) : summary ? (
                  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-4">
                    <div className="p-3.5 bg-brand-card rounded-xl border border-brand-border shadow-sm">
                      <p className="text-[11px] font-bold text-brand-accent uppercase mb-1">Key Insights</p>
                      <ul className="text-[13px] leading-relaxed text-brand-text space-y-1.5 ml-3 list-disc">
                        {summary.insights.map((insight, i) => (
                          <li key={i}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3.5 bg-brand-card rounded-xl border border-brand-border shadow-sm">
                      <p className="text-[11px] font-bold text-emerald-500 uppercase mb-1">Action Points</p>
                      <ul className="text-[13px] leading-relaxed text-brand-text space-y-1.5 ml-3 list-disc">
                        {summary.actionPoints.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ) : (
                  <p className="text-[14px] text-brand-text-muted text-center italic py-4">Upload a document to see the summary.</p>
                )}
              </div>

              {/* AI Response Display */}
              <AnimatePresence>
                {(isAnswering || answer) && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border-t border-brand-border pt-6 space-y-3"
                  >
                    <h4 className="text-[11px] font-bold text-brand-accent uppercase mb-2">AI Response</h4>
                    <div className="p-4 bg-brand-card text-brand-text border border-brand-border rounded-2xl shadow-sm max-h-[350px] overflow-y-auto">
                      {isAnswering ? (
                        <div className="flex items-center gap-2 opacity-70 text-brand-text-muted">
                          <Loader2 size={16} className="animate-spin text-brand-accent" /> Thinking...
                        </div>
                      ) : (
                        <div className="text-[14px] leading-relaxed max-w-none text-brand-text [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-1 [&_strong]:font-semibold [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:font-semibold [&_h3]:mb-2 [&_h4]:font-semibold [&_h4]:mb-2 [&_pre]:bg-brand-primary/5 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:mb-4 [&_code]:font-mono [&_code]:text-sm">
                          <ReactMarkdown>{answer!}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Suggested Questions */}
              <div className="border-t border-brand-border pt-6 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-text-muted">Suggested</p>
                <div className="flex flex-wrap gap-2">
                  {(summary?.suggestedQuestions || ["Summarize main points", "What are risks?", "Key deadlines?", "Important contacts?", "Explain in simple words", "What should I focus on?"]).map((sq, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleAskQuestion(sq)}
                      disabled={isSummarizing || isAnswering || documents.length === 0}
                      className="px-3 py-1.5 bg-brand-card border border-brand-border rounded-full text-xs text-brand-text hover:bg-brand-accent/5 hover:border-brand-accent/30 transition-all disabled:opacity-50 text-left"
                    >
                      {sq}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Input Area */}
            <div className="p-4 sm:p-6 bg-brand-card md:bg-transparent border-t border-brand-border shrink-0 mb-safe">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleAskQuestion(); }}
                className="space-y-4"
              >
                <div className="relative">
                  <textarea 
                     value={question}
                     onChange={e => setQuestion(e.target.value)}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter' && !e.shiftKey) {
                         e.preventDefault();
                         handleAskQuestion();
                       }
                     }}
                     disabled={isSummarizing || isAnswering || documents.length === 0}
                     placeholder="Ask anything from uploaded documents..." 
                     className="w-full p-3 sm:p-4 pr-12 bg-brand-card rounded-2xl border border-brand-border text-[13px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 text-brand-text placeholder:text-brand-text-muted disabled:opacity-50 resize-none h-[80px] sm:h-[100px]"
                  />
                  <button 
                    type="submit"
                    disabled={!question.trim() || isSummarizing || isAnswering || documents.length === 0}
                    className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 w-8 h-8 bg-brand-text text-brand-bg rounded-full flex items-center justify-center hover:opacity-90 transition-colors disabled:opacity-50"
                  >
                    <ArrowUp size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </form>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
