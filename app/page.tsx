"use client";

import { useState } from "react";
import { useDocuments } from "@/hooks/useDocuments";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { UploadArea } from "@/components/documents/UploadArea";
import { DocumentList } from "@/components/documents/DocumentList";
import { motion, AnimatePresence } from "motion/react";

export default function Page() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const {
    documents,
    summary,
    isSummarizing,
    question,
    setQuestion,
    answer,
    isAnswering,
    handleFileUpload,
    handleAskQuestion,
    removeDocument
  } = useDocuments();

  const togglePanel = () => setIsPanelOpen(!isPanelOpen);
  const closePanel = () => setIsPanelOpen(false);
  const openPanel = () => setIsPanelOpen(true);

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-brand-bg text-brand-text">
      <Navbar isPanelOpen={isPanelOpen} togglePanel={togglePanel} />

      <main className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden min-h-0 w-full relative">
        {/* Main Content Area */}
        <section className="flex-none md:flex-1 h-auto md:h-full md:overflow-y-auto min-w-0 p-4 sm:p-8 flex flex-col items-center justify-start md:justify-center relative z-10 w-full max-w-full pb-8 md:pb-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
            className="w-full max-w-[520px] space-y-6 sm:space-y-8 px-2"
          >
            <UploadArea onFileUpload={handleFileUpload} openPanel={openPanel} />
            <DocumentList documents={documents} onRemoveDocument={removeDocument} />
          </motion.div>
        </section>

        {/* Right Side Panel */}
        <Sidebar 
          isPanelOpen={isPanelOpen}
          closePanel={closePanel}
          summary={summary}
          isSummarizing={isSummarizing}
          question={question}
          setQuestion={setQuestion}
          answer={answer}
          isAnswering={isAnswering}
          handleAskQuestion={handleAskQuestion}
          documents={documents}
        />
      </main>
    </div>
  );
}
