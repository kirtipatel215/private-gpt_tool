"use client";

import { FileText, Loader2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DocumentInfo } from "@/types";

type DocumentListProps = {
  documents: DocumentInfo[];
  onRemoveDocument: (id: string) => void;
};

export function DocumentList({ documents, onRemoveDocument }: DocumentListProps) {
  if (documents.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="space-y-3 w-full"
      >
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted px-1">Active Documents</h3>
        {documents.map(doc => (
          <div key={doc.id} className="bg-brand-card rounded-[18px] p-4 shadow-sm border border-brand-border flex items-center justify-between group">
            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden mr-2">
              <div className="w-10 h-10 bg-brand-accent/10 rounded-lg flex items-center justify-center text-brand-accent shrink-0">
                <FileText size={20} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-text truncate">{doc.name}</p>
                <p className="text-xs text-brand-text-muted flex flex-wrap items-center gap-2 mt-0.5">
                  <span>{doc.size}</span>
                  <span className="w-1 h-1 rounded-full bg-brand-border" />
                  <span className={doc.status === 'Processing' ? 'text-brand-accent' : doc.status === 'Error' ? 'text-red-500' : 'text-brand-text-muted'}>{doc.status}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
               {doc.status === 'Indexed' && <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full hidden sm:inline-block">Ready</span>}
               {doc.status === 'Processing' && <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-yellow-500/10 text-yellow-600 rounded-full flex items-center gap-1 hidden sm:flex"><Loader2 size={10} className="animate-spin"/>Indexing</span>}
               {doc.status === 'Error' && <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-red-500/10 text-red-600 rounded-full hidden sm:inline-block">Error</span>}
              <button 
                onClick={(e) => { e.stopPropagation(); onRemoveDocument(doc.id); }} 
                className="text-brand-text-muted lg:opacity-0 lg:group-hover:opacity-100 transition-opacity p-1 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
