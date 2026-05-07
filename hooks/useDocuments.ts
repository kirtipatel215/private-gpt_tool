"use client";

import { useState } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { DocumentInfo, SummaryData } from "@/types";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    const newDocs: DocumentInfo[] = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      status: 'Processing',
      mimeType: file.type || "text/plain",
    }));

    const originalDocs = [...documents];
    setDocuments(prev => [...prev, ...newDocs]);
    setIsSummarizing(true);
    setAnswer(null);

    try {
      const contentsToSummarize: any[] = ["Analyze these documents and provide a JSON summary. Return specific Key Insights (string array), Action Points (string array), and 4 to 6 Suggested Questions (string array) that a user could ask about these documents. Make them concise."];
      
      for (const doc of originalDocs) {
        if (doc.base64) {
          contentsToSummarize.push({ inlineData: { data: doc.base64, mimeType: doc.mimeType } });
        } else if (doc.textContent) {
          contentsToSummarize.push(doc.textContent);
        }
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const buffer = await file.arrayBuffer();
        
        if (file.type === "application/pdf") {
          const base64 = btoa(
            new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
          );
          contentsToSummarize.push({ inlineData: { data: base64, mimeType: "application/pdf" } });
          newDocs[i].base64 = base64;
        } else {
          const decoder = new TextDecoder("utf-8");
          const textContent = decoder.decode(buffer);
          contentsToSummarize.push(textContent);
          newDocs[i].textContent = textContent;
        }
        newDocs[i].status = 'Indexed';
      }

      setDocuments([...originalDocs, ...newDocs]);

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: contentsToSummarize as any,
        config: {
           responseMimeType: "application/json",
           responseSchema: {
             type: Type.OBJECT,
             properties: {
               insights: { type: Type.ARRAY, items: { type: Type.STRING } },
               actionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
               suggestedQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
             },
             required: ["insights", "actionPoints", "suggestedQuestions"]
           }
        }
      });
      
      if (response.text) {
        setSummary(JSON.parse(response.text));
      }
    } catch (e: any) {
      console.error(e);
      setDocuments(prev => prev.map(d => newDocs.find(n => n.id === d.id) ? { ...d, status: 'Error' } : d));
      if (e?.message?.includes("quota") || e?.status === 429 || e?.message?.includes("429")) {
        setAnswer("You've exceeded your Gemini API quota. Please check your plan and billing details.");
      }
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleAskQuestion = async (presetQuestion?: string) => {
    const q = presetQuestion || question;
    if (!q || documents.length === 0) return;
    
    setQuestion("");
    setIsAnswering(true);
    setAnswer(null);

    try {
      const prompt = `Based strictly on the provided documents, answer this question: ${q}`;
      const contents: any[] = [prompt];
      
      for (const doc of documents) {
         if (doc.base64) {
            contents.push({ inlineData: { data: doc.base64, mimeType: doc.mimeType } });
         } else if (doc.textContent) {
            contents.push(doc.textContent);
         }
      }
        
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: contents as any,
      });

      setAnswer(response.text || "No answer generated.");
    } catch (e: any) {
      console.error(e);
      let errorMsg = "Sorry, I encountered an error answering that.";
      if (e?.message?.includes("quota") || e?.status === 429 || e?.message?.includes("429")) {
        errorMsg = "You've exceeded your Gemini API quota. Please check your plan and billing details.";
      }
      setAnswer(errorMsg);
    } finally {
      setIsAnswering(false);
    }
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => {
       const updated = prev.filter(d => d.id !== id);
       if (updated.length === 0) {
          setSummary(null);
          setAnswer(null);
       }
       return updated;
    });
  };

  return {
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
  };
}
