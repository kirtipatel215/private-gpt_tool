"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";

type UploadAreaProps = {
  onFileUpload: (files: File[]) => void;
  openPanel: () => void;
};

export function UploadArea({ onFileUpload, openPanel }: UploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      onFileUpload(files);
      openPanel();
    }
    if (event.target) event.target.value = '';
  };

  return (
    <>
      <div className="text-center space-y-3 mb-8 hidden">
        <h1 className="text-[32px] font-semibold tracking-tight text-brand-text">
          Knowledge Base
        </h1>
        <p className="text-[15px] text-brand-text-muted max-w-lg mx-auto">
          Securely upload your private documents. They never leave your device without your permission, perfectly aligned with Apple&apos;s privacy principles.
        </p>
      </div>

      <div className="w-full relative group" onClick={() => fileInputRef.current?.click()}>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".pdf,.txt,.csv" 
          multiple 
        />
        <div className="w-full aspect-[16/9] bg-brand-card rounded-[24px] border-2 border-dashed border-brand-border hover:border-brand-accent/50 flex flex-col items-center justify-center p-6 sm:p-8 transition-all duration-300 group shadow-sm cursor-pointer hover:shadow-md">
          <div className="w-16 h-16 bg-brand-accent/10 rounded-full flex items-center justify-center text-brand-accent mb-4 group-hover:scale-110 transition-transform">
            <Upload size={28} strokeWidth={2} />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold mb-1 text-brand-text text-center">Upload Your Private Documents</h2>
          <p className="text-xs sm:text-sm text-brand-text-muted mb-6 text-center">PDF, TXT, CSV supported (Up to 50MB)</p>
          <div className="px-6 py-2.5 bg-brand-primary text-brand-secondary rounded-full text-sm font-medium hover:opacity-90 transition-all text-center">
            Choose Files
          </div>
        </div>
      </div>
    </>
  );
}
