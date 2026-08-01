import React, { useState, useEffect } from "react";
import { Mic, Upload, FileText, Eraser, FileOutput, Users, Printer, Plus, Trash2, Download, Sparkles, Save, FolderOpen, Clock, FileDown, X, Check, Settings } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { exportToWord, exportBlankAttendanceToWord, exportFilledAttendanceToWord } from "./exportWord";
import { formatKhmerDateText, formatKhmerTimeText, formatKhmerDateStandard } from "./khmerUtils";

export default function App() {
  const [activeTab, setActiveTab] = useState("general");
  const [printMode, setPrintMode] = useState<"minutes" | "blank">("minutes");
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const [ministry, setMinistry] = useState(() => localStorage.getItem("ministry") || "");
  const [office, setOffice] = useState(() => localStorage.getItem("office") || "");
  const [school, setSchool] = useState(() => localStorage.getItem("school") || "");
  const [topic, setTopic] = useState(() => localStorage.getItem("topic") || "");
  const [lunarDate, setLunarDate] = useState(() => localStorage.getItem("lunarDate") || "");
  const [date, setDate] = useState(() => localStorage.getItem("date") || "");
  const [startTime, setStartTime] = useState(() => localStorage.getItem("startTime") || "");
  const [endTime, setEndTime] = useState(() => localStorage.getItem("endTime") || "");
  const [location, setLocation] = useState(() => localStorage.getItem("location") || "");
  const [chair, setChair] = useState(() => localStorage.getItem("chair") || "");
  const [secretary, setSecretary] = useState(() => localStorage.getItem("secretary") || "");
  const [agenda, setAgenda] = useState(() => localStorage.getItem("agenda") || "");
  const [content, setContent] = useState(() => localStorage.getItem("content") || "");
  const [decision, setDecision] = useState(() => localStorage.getItem("decision") || "");
  const [images, setImages] = useState<string[]>([]);
  const [attendees, setAttendees] = useState(() => {
    const saved = localStorage.getItem("attendees");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [isTranscribing, setIsTranscribing] = useState(false);
  const [rawTranscript, setRawTranscript] = useState(() => localStorage.getItem("rawTranscript") || "");

  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanedTranscript, setCleanedTranscript] = useState(() => localStorage.getItem("cleanedTranscript") || "");

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    localStorage.setItem("ministry", ministry);
    localStorage.setItem("office", office);
    localStorage.setItem("school", school);
    localStorage.setItem("topic", topic);
    localStorage.setItem("lunarDate", lunarDate);
    localStorage.setItem("date", date);
    localStorage.setItem("startTime", startTime);
    localStorage.setItem("endTime", endTime);
    localStorage.setItem("location", location);
    localStorage.setItem("chair", chair);
    localStorage.setItem("secretary", secretary);
    localStorage.setItem("agenda", agenda);
    localStorage.setItem("content", content);
    localStorage.setItem("decision", decision);
    localStorage.setItem("attendees", JSON.stringify(attendees));
    localStorage.setItem("rawTranscript", rawTranscript);
    localStorage.setItem("cleanedTranscript", cleanedTranscript);
    setLastSaved(new Date());
  }, [ministry, office, school, topic, lunarDate, date, startTime, endTime, location, chair, secretary, agenda, content, decision, attendees, rawTranscript, cleanedTranscript]);

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [sheetUrl, setSheetUrl] = useState("");
  const [sheetDateFilter, setSheetDateFilter] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [isGeneratingAgenda, setIsGeneratingAgenda] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isGeneratingDecision, setIsGeneratingDecision] = useState(false);
  const [isRefiningAgenda, setIsRefiningAgenda] = useState(false);
  const [proposedAgenda, setProposedAgenda] = useState("");
  const [showRefineAgendaModal, setShowRefineAgendaModal] = useState(false);
  const [isRefiningContent, setIsRefiningContent] = useState(false);
  const [proposedContent, setProposedContent] = useState("");
  const [showRefineModal, setShowRefineModal] = useState(false);
  const [facebookPost, setFacebookPost] = useState("");

  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem("geminiApiKey") || "");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentDocId, setCurrentDocId] = useState<string | null>(() => localStorage.getItem("currentDocId"));

  useEffect(() => {
    localStorage.setItem("geminiApiKey", geminiApiKey);
  }, [geminiApiKey]);

  useEffect(() => {
    if (currentDocId) {
      localStorage.setItem("currentDocId", currentDocId);
    } else {
      localStorage.removeItem("currentDocId");
    }
  }, [currentDocId]);

  const [savedDocs, setSavedDocs] = useState<any[]>(() => {
    const saved = localStorage.getItem("savedDocs");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("savedDocs", JSON.stringify(savedDocs));
  }, [savedDocs]);

  const saveCurrentDoc = () => {
    const newDoc = {
      id: Date.now().toString(),
      title: topic || "ឯកសារគ្មានឈ្មោះ",
      dateSaved: new Date().toISOString(),
      data: {
        ministry, office, school, topic, lunarDate, date, startTime, endTime,
        location, chair, secretary, agenda, content, decision, attendees,
        rawTranscript, cleanedTranscript
      }
    };
    setSavedDocs([newDoc, ...savedDocs]);
    setCurrentDocId(newDoc.id);
    alert("ឯកសារត្រូវបានបង្កើតថ្មី និងរក្សាទុកដោយជោគជ័យ។");
  };

  const updateCurrentDoc = () => {
    if (!currentDocId) return;
    const updatedDocs = savedDocs.map((doc) => {
      if (doc.id === currentDocId) {
        return {
          ...doc,
          title: topic || "ឯកសារគ្មានឈ្មោះ",
          dateSaved: new Date().toISOString(),
          data: {
            ministry, office, school, topic, lunarDate, date, startTime, endTime,
            location, chair, secretary, agenda, content, decision, attendees,
            rawTranscript, cleanedTranscript
          }
        };
      }
      return doc;
    });
    setSavedDocs(updatedDocs);
    alert("ឯកសារបច្ចុប្បន្នត្រូវបានកែប្រែ និងរក្សាទុករួចរាល់។");
  };

  const loadDoc = (doc: any) => {
    if (confirm("តើអ្នកប្រាកដជាចង់ទាញយកឯកសារនេះមកជំនួសឯកសារបច្ចុប្បន្នមែនទេ? ទិន្នន័យដែលកំពុងធ្វើបច្ចុប្បន្ននឹងបាត់បង់។")) {
      const d = doc.data;
      setCurrentDocId(doc.id);
      setMinistry(d.ministry || "");
      setOffice(d.office || "");
      setSchool(d.school || "");
      setTopic(d.topic || "");
      setLunarDate(d.lunarDate || "");
      setDate(d.date || "");
      setStartTime(d.startTime || "");
      setEndTime(d.endTime || "");
      setLocation(d.location || "");
      setChair(d.chair || "");
      setSecretary(d.secretary || "");
      setAgenda(d.agenda || "");
      setContent(d.content || "");
      setDecision(d.decision || "");
      if (d.attendees && d.attendees.length > 0) {
        setAttendees(d.attendees);
      }
      setRawTranscript(d.rawTranscript || "");
      setCleanedTranscript(d.cleanedTranscript || "");
      setActiveTab("general");
    }
  };

  const deleteDoc = (id: string) => {
    if (confirm("តើអ្នកប្រាកដជាចង់លុបឯកសារនេះមែនទេ?")) {
      setSavedDocs(savedDocs.filter(doc => doc.id !== id));
    }
  };

  const importFromSheet = async () => {
    if (!sheetUrl) return;
    setIsImporting(true);
    try {
      const res = await fetch("/api/import-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sheetUrl, dateFilter: sheetDateFilter })
      });
      if (!res.ok) {
        throw new Error("ការនាំចូលបរាជ័យ (Import failed). Make sure the sheet is public.");
      }
      const data = await res.json();
      if (data.attendees && data.attendees.length > 0) {
        setAttendees(data.attendees);
      } else {
        alert("មិនមានទិន្នន័យក្នុងតារាងទេ (No data found in sheet)");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setAudioUrl(URL.createObjectURL(selectedFile));
    }
  };

  const addAttendee = () => {
    setAttendees([...attendees, { id: Date.now(), name: "", gender: "", role: "", phone: "", note: "" }]);
  };

  const removeAttendee = (id: number) => {
    setAttendees(attendees.filter(a => a.id !== id));
  };

  const updateAttendee = (id: number, field: string, value: string) => {
    setAttendees(attendees.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((f: File) => URL.createObjectURL(f));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const handleTranscribe = async () => {
    if (!file) return;
    setIsTranscribing(true);
    setRawTranscript("");
    try {
      const formData = new FormData();
      formData.append("audio", file);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "x-gemini-api-key": geminiApiKey,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("ការបម្លែងសម្លេងបរាជ័យ (Transcription failed)");
      }
      const data = await res.json();
      setRawTranscript(data.transcript);
    } catch (err: any) {
      alert("កំហុសក្នុងការបម្លែងសម្លេង: " + err.message);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleClean = async () => {
    if (!rawTranscript) return;
    setIsCleaning(true);
    try {
      const res = await fetch("/api/clean-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-gemini-api-key": geminiApiKey },
        body: JSON.stringify({ transcript: rawTranscript }),
      });

      if (!res.ok) {
        throw new Error("ការកែសម្រួលបរាជ័យ (Cleaning failed)");
      }
      const data = await res.json();
      setCleanedTranscript(data.cleanedText);
      setContent(prev => prev + (prev ? "\n\n" : "") + data.cleanedText);
    } catch (err: any) {
      alert("កំហុសក្នុងការកែសម្រួល: " + err.message);
    } finally {
      setIsCleaning(false);
    }
  };

  const handleSummarize = async () => {
    if (!rawTranscript) return;
    setIsSummarizing(true);
    try {
      const res = await fetch("/api/summarize-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-gemini-api-key": geminiApiKey },
        body: JSON.stringify({ transcript: rawTranscript }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "ការសង្ខេបបរាជ័យ (Summarization failed)");
      }
      const data = await res.json();
      setContent(prev => prev + (prev ? "\n\n" : "") + data.summarizedText);
    } catch (err: any) {
      alert("កំហុសក្នុងការសង្ខេប: " + err.message);
    } finally {
      setIsSummarizing(false);
    }
  };

  const formatTextAsHtml = (text: string) => {
    return text.replace(/\n/g, "<br/>");
  };

  const handleGeneratePost = async () => {
    setIsGeneratingPost(true);
    try {
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-gemini-api-key": geminiApiKey },
        body: JSON.stringify({ topic, date, lunarDate, startTime, endTime, location, chair, content }),
      });
      const data = await response.json();
      if (response.ok) {
        setFacebookPost(data.postText);
      } else {
        alert("បរាជ័យក្នុងការបង្កើត Post: " + data.error);
      }
    } catch (e) {
      alert("បរាជ័យក្នុងការបង្កើត Post។");
    } finally {
      setIsGeneratingPost(false);
    }
  };

  const handleGenerateAgenda = async () => {
    if (!topic && !content) {
      alert("សូមបញ្ចូលប្រធានបទប្រជុំ ឬខ្លឹមសារកិច្ចប្រជុំជាមុនសិន។");
      return;
    }
    setIsGeneratingAgenda(true);
    try {
      const response = await fetch("/api/generate-agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-gemini-api-key": geminiApiKey },
        body: JSON.stringify({ topic, content }),
      });
      const data = await response.json();
      if (response.ok) {
        setAgenda(data.agendaText);
      } else {
        alert("បរាជ័យក្នុងការបង្កើតរបៀបវារៈ: " + data.error);
      }
    } catch (e) {
      alert("បរាជ័យក្នុងការបង្កើតរបៀបវារៈ។");
    } finally {
      setIsGeneratingAgenda(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!topic && !agenda) {
      alert("សូមបញ្ចូលប្រធានបទប្រជុំ និងរបៀបវារៈជាមុនសិន ដើម្បីទទួលបានខ្លឹមសារល្អ។");
      return;
    }
    setIsGeneratingContent(true);
    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-gemini-api-key": geminiApiKey },
        body: JSON.stringify({ topic, agenda, transcription: content }),
      });
      const data = await response.json();
      if (response.ok) {
        setContent(data.contentText);
      } else {
        alert("បរាជ័យក្នុងការបង្កើតខ្លឹមសារ: " + data.error);
      }
    } catch (e) {
      alert("បរាជ័យក្នុងការបង្កើតខ្លឹមសារ។");
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleGenerateDecision = async () => {
    if (!topic && !content) {
      alert("សូមបញ្ចូលប្រធានបទប្រជុំ ឬខ្លឹមសារជាមុនសិន ដើម្បីទទួលបានសេចក្តីសម្រេច។");
      return;
    }
    setIsGeneratingDecision(true);
    try {
      const response = await fetch("/api/generate-decision", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-gemini-api-key": geminiApiKey },
        body: JSON.stringify({ topic, content }),
      });
      const data = await response.json();
      if (response.ok) {
        setDecision(data.decisionText);
      } else {
        alert("បរាជ័យក្នុងការបង្កើតសេចក្តីសម្រេច: " + data.error);
      }
    } catch (e) {
      alert("បរាជ័យក្នុងការបង្កើតសេចក្តីសម្រេច។");
    } finally {
      setIsGeneratingDecision(false);
    }
  };

  const handleRefineAgenda = async () => {
    if (!agenda) {
      alert("សូមបញ្ចូលរបៀបវារៈជាមុនសិន ដើម្បីឱ្យ AI ជួយកែសម្រួល។");
      return;
    }
    setIsRefiningAgenda(true);
    try {
      const response = await fetch("/api/refine-agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-gemini-api-key": geminiApiKey },
        body: JSON.stringify({ agenda }),
      });
      const data = await response.json();
      if (response.ok) {
        setProposedAgenda(data.refinedText);
        setShowRefineAgendaModal(true);
      } else {
        alert("បរាជ័យក្នុងការកែសម្រួលរបៀបវារៈ: " + data.error);
      }
    } catch (e) {
      alert("បរាជ័យក្នុងការកែសម្រួលរបៀបវារៈ។");
    } finally {
      setIsRefiningAgenda(false);
    }
  };

  const handleRefineContent = async () => {
    if (!content) {
      alert("សូមបញ្ចូលខ្លឹមសារជាមុនសិន ដើម្បីឱ្យ AI ជួយកែសម្រួល។");
      return;
    }
    setIsRefiningContent(true);
    try {
      const response = await fetch("/api/refine-content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-gemini-api-key": geminiApiKey },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      if (response.ok) {
        setProposedContent(data.refinedText);
        setShowRefineModal(true);
      } else {
        alert("បរាជ័យក្នុងការកែសម្រួលខ្លឹមសារ: " + data.error);
      }
    } catch (e) {
      alert("បរាជ័យក្នុងការកែសម្រួលខ្លឹមសារ។");
    } finally {
      setIsRefiningContent(false);
    }
  };

  const handleCreateNewDocument = () => {
    if (window.confirm("តើអ្នកពិតជាចង់បង្កើតឯកសារថ្មី ដោយលុបទិន្នន័យចាស់ៗទាំងអស់មែនទេ?")) {
      setCurrentDocId(null);
      setMinistry("");
      setOffice("");
      setSchool("");
      setTopic("");
      setLunarDate("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setLocation("");
      setChair("");
      setSecretary("");
      setAgenda("");
      setContent("");
      setDecision("");
      setAttendees([]);
      setRawTranscript("");
      setCleanedTranscript("");
      setActiveTab("general");
    }
  };

  const handleClearGeneralData = () => {
    if (window.confirm("តើអ្នកពិតជាចង់សម្អាតទិន្នន័យទូទៅទាំងអស់មែនទេ?")) {
      setCurrentDocId(null);
      setMinistry("");
      setOffice("");
      setSchool("");
      setTopic("");
      setLunarDate("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setLocation("");
      setChair("");
      setSecretary("");
      setAgenda("");
      setContent("");
      setDecision("");
      setImages([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 print:bg-white print:py-0 print:px-0 font-sans text-slate-800">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-5xl mx-auto space-y-8 relative"
      >
        <button
          onClick={() => setShowSettingsModal(true)}
          className="absolute right-0 top-0 mt-2 mr-2 print:hidden flex items-center justify-center p-2.5 rounded-full hover:bg-white hover:shadow-sm text-slate-400 hover:text-slate-600 transition-all"
          title="ការកំណត់ (Settings)"
        >
          <Settings className="w-6 h-6" />
        </button>
        
        {/* Header Section */}
        <div className="text-center space-y-5 print:hidden pb-4">
          <motion.img 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            src="/program-logo.png" 
            alt="Program Logo" 
            className="h-28 mx-auto object-contain drop-shadow-sm" 
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 leading-normal py-1">
              បរិក្ខារកំណត់ហេតុប្រជុំ
            </h1>
            <p className="text-slate-500 mt-2 text-lg">ប្រព័ន្ធបម្លែងសម្លេងជាអក្សរ និងរៀបចំជារបាយការណ៍កំណត់ហេតុស្ដង់ដារ</p>
            <p className="text-[13.5px] text-slate-400 mt-2 font-medium">បង្កើតដោយ៖ គ្រូសាលាបឋមសិក្សាអូរតាប្រុក</p>
            
            <div className="flex flex-col items-center justify-center gap-4 mt-6">
              <button
                onClick={handleCreateNewDocument}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-[15.5px]"
              >
                <Plus className="w-5 h-5"/> បង្កើតឯកសារថ្មី
              </button>
              
              {lastSaved && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[13px] text-emerald-600 flex items-center justify-center gap-1.5 font-medium bg-emerald-50/80 px-4 py-1.5 rounded-full border border-emerald-100"
                >
                  <Check className="w-4 h-4" /> រក្សាទុកទិន្នន័យដោយស្វ័យប្រវត្តិចុងក្រោយនៅម៉ោង {lastSaved.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </motion.p>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-2xl shadow-sm border border-slate-200/60 p-2 mb-8 gap-2 overflow-x-auto print:hidden max-w-4xl mx-auto w-full sticky top-4 z-10 backdrop-blur-md bg-white/80">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-xl font-medium text-[15.5px] transition-all whitespace-nowrap ${activeTab === "general" ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
          >
           <FileText className="w-5 h-5" /> ទិន្នន័យទូទៅ
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-xl font-medium text-[15.5px] transition-all whitespace-nowrap ${activeTab === "attendance" ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
          >
            <Users className="w-5 h-5" /> បញ្ជីវត្ដមាន
          </button>
          <button
            onClick={() => setActiveTab("audio")}
            className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-xl font-medium text-[15.5px] transition-all whitespace-nowrap ${activeTab === "audio" ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
          >
            <Mic className="w-5 h-5" /> បំប្លែងសំឡេង
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-xl font-medium text-[15.5px] transition-all whitespace-nowrap ${activeTab === "preview" ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
          >
            <Printer className="w-5 h-5" /> មើល & បោះពុម្ព
          </button>
          <button
            onClick={() => setActiveTab("archives")}
            className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-xl font-medium text-[15.5px] transition-all whitespace-nowrap ${activeTab === "archives" ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
          >
            <FolderOpen className="w-5 h-5" /> ឯកសារបណ្ណសារ
          </button>
        </div>

        <div className="w-full">
          {/* Archives Tab */}
          {activeTab === "archives" && (
            <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100/60 print:hidden max-w-4xl mx-auto space-y-6">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FolderOpen className="w-6 h-6 text-indigo-600"/> ឯកសារបណ្ណសាររបស់អ្នក
                </h2>
                <div className="flex items-center gap-3">
                  {currentDocId && (
                    <button
                      onClick={updateCurrentDoc}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition text-[15px]"
                    >
                      <Save className="w-5 h-5"/> ចំណាំបច្ចុប្បន្នភាព (Update)
                    </button>
                  )}
                  <button
                    onClick={saveCurrentDoc}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition text-[15px]"
                  >
                    <Plus className="w-5 h-5"/> បង្កើតជាឯកសារថ្មី
                  </button>
                </div>
              </div>

              {savedDocs.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <FolderOpen className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                  <p>មិនទាន់មានឯកសារត្រូវបានរក្សាទុកនៅឡើយទេ</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedDocs.map(doc => (
                    <div key={doc.id} className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-800 line-clamp-2 text-[15px]">{doc.title}</h3>
                      </div>
                      <div className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> ត្រូវបានរក្សាទុកនៅ: {new Date(doc.dateSaved).toLocaleString("km-KH")}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadDoc(doc)}
                          className="flex-1 bg-white border border-indigo-300 text-blue-700 hover:bg-blue-50 py-2 rounded-lg text-[15px] font-medium transition"
                        >
                          បន្តកែសម្រួល
                        </button>
                        <button
                          onClick={() => deleteDoc(doc.id)}
                          className="px-4 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2 rounded-lg text-[15px] font-medium transition"
                        >
                          លុប
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* General Tab */}
          {activeTab === "general" && (
            <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100/60 print:hidden max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2"><FileText className="w-6 h-6 text-indigo-600"/> ព័ត៌មាននៃការប្រជុំ</h2>
                <button
                  onClick={handleClearGeneralData}
                  className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  សម្អាតទិន្នន័យ
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-700 font-medium mb-1.5">ស្ថាប័ន / ក្រសួង</label>
                  <input type="text" placeholder="ឧ. ក្រសួងអប់រំ យុវជន និងកីឡា" value={ministry} onChange={e => setMinistry(e.target.value)} className="w-full rounded-xl border-slate-200 border px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm transition-all text-slate-800 placeholder:text-slate-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 font-medium mb-1.5">មន្ទីរ / ការិយាល័យ</label>
                  <input type="text" placeholder="ឧ. ការិយាល័យអប់រំយុវជន និងកីឡាស្រុកក្រគរ" value={office} onChange={e => setOffice(e.target.value)} className="w-full rounded-xl border-slate-200 border px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm transition-all text-slate-800 placeholder:text-slate-400 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-700 font-medium mb-1.5">ឈ្មោះសាលារៀន</label>
                  <input type="text" placeholder="ឧ. សាលាបឋមសិក្សាអូរតាប្រុក" value={school} onChange={e => setSchool(e.target.value)} className="w-full rounded-xl border-slate-200 border px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm transition-all text-slate-800 placeholder:text-slate-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 font-medium mb-1.5">ប្រធានបទប្រជុំ</label>
                  <input type="text" placeholder="ឧ. ការបំពេញស្ដង់ដាសាលាគំរូ" value={topic} onChange={e => setTopic(e.target.value)} className="w-full rounded-xl border-slate-200 border px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm transition-all text-slate-800 placeholder:text-slate-400 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm text-slate-700 font-medium mb-1.5">ថ្ងៃខែឆ្នាំចន្ទគតិ</label>
                  <input type="text" placeholder="ឧ. ថ្ងៃព្រហស្បតិ៍ ០៤រោច ខែជេស្ឋ ឆ្នាំរោង" value={lunarDate} onChange={e => setLunarDate(e.target.value)} className="w-full rounded-xl border-slate-200 border px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm transition-all text-slate-800 placeholder:text-slate-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 font-medium mb-1.5">កាលបរិច្ឆេទ</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full rounded-xl border-slate-200 border px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm transition-all text-slate-800 placeholder:text-slate-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 font-medium mb-1.5">ម៉ោងចាប់ផ្ដើម</label>
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full rounded-xl border-slate-200 border px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm transition-all text-slate-800 placeholder:text-slate-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 font-medium mb-1.5">ម៉ោងបញ្ចប់</label>
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full rounded-xl border-slate-200 border px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm transition-all text-slate-800 placeholder:text-slate-400 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 font-medium mb-1.5">ទីកន្លែង</label>
                <input type="text" placeholder="ឧ. តាមរយៈ Google Meet" value={location} onChange={e => setLocation(e.target.value)} className="w-full rounded-xl border-slate-200 border px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm transition-all text-slate-800 placeholder:text-slate-400 focus:outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-700 font-medium mb-1.5">ប្រធានអង្គប្រជុំ (អ្នកដឹកនាំ)</label>
                  <input type="text" placeholder="ឧ. លួន សុផាត" value={chair} onChange={e => setChair(e.target.value)} className="w-full rounded-xl border-slate-200 border px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm transition-all text-slate-800 placeholder:text-slate-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 font-medium mb-1.5">អ្នកកត់ត្រា (លេខា)</label>
                  <input type="text" placeholder="ឧ. អ៊ិត ថាត" value={secretary} onChange={e => setSecretary(e.target.value)} className="w-full rounded-xl border-slate-200 border px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm transition-all text-slate-800 placeholder:text-slate-400 focus:outline-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm text-slate-700 font-medium">របៀបវារៈ</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRefineAgenda}
                      disabled={isRefiningAgenda}
                      className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded text-sm transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      {isRefiningAgenda ? "កំពុងកែសម្រួល..." : "កែសម្រួល & បន្ថែមអត្ថន័យដោយ AI"}
                    </button>
                    <button
                      onClick={handleGenerateAgenda}
                      disabled={isGeneratingAgenda}
                      className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded text-sm transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      {isGeneratingAgenda ? "កំពុងបង្កើត..." : "បង្កើតរបៀបវារៈដោយ AI"}
                    </button>
                  </div>
                </div>
                <textarea placeholder="ឧ. ១. ចុះវត្តមាន
២. មតិសំណេះសំណាល
៣. បទបង្ហាញ" value={agenda} onChange={e => setAgenda(e.target.value)} className="w-full rounded-xl border-slate-200 border px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm transition-all text-slate-800 placeholder:text-slate-400 focus:outline-none h-32 leading-relaxed whitespace-pre-wrap"></textarea>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm text-slate-700 font-medium">ដំណើរការនៃកិច្ចប្រជុំ / ខ្លឹមសារ (អាចបញ្ចូលពីការបំប្លែងសំឡេងបាន)</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRefineContent}
                      disabled={isRefiningContent}
                      className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded text-sm transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      {isRefiningContent ? "កំពុងកែសម្រួល..." : "កែសម្រួល & បន្ថែមអត្ថន័យដោយ AI"}
                    </button>
                    <button
                      onClick={handleGenerateContent}
                      disabled={isGeneratingContent}
                      className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded text-sm transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      {isGeneratingContent ? "កំពុងបង្កើត..." : "បង្កើតខ្លឹមសារដោយ AI"}
                    </button>
                  </div>
                </div>
                <textarea placeholder="ទីនេះអ្នកអាចសរសេរខ្លឹមសារ..." value={content} onChange={e => setContent(e.target.value)} className="w-full rounded-xl border-slate-200 border px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm transition-all text-slate-800 placeholder:text-slate-400 focus:outline-none h-40 leading-relaxed whitespace-pre-wrap"></textarea>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm text-slate-700 font-medium">សេចក្ដីសម្រេច</label>
                  <button
                    onClick={handleGenerateDecision}
                    disabled={isGeneratingDecision}
                    className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded text-sm transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isGeneratingDecision ? "កំពុងបង្កើត..." : "បង្កើតសេចក្តីសម្រេចដោយ AI"}
                  </button>
                </div>
                <textarea placeholder="សេចក្ដីសម្រេច..." value={decision} onChange={e => setDecision(e.target.value)} className="w-full rounded-xl border-slate-200 border px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm transition-all text-slate-800 placeholder:text-slate-400 focus:outline-none h-24 whitespace-pre-wrap"></textarea>
              </div>

              <div className="pt-2">
                <label className="block text-sm text-slate-700 font-medium mb-2">រូបភាពឯកសារយោង (ភ្ជាប់ទៅក្នុងកំណត់ហេតុ)</label>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer" />
                {images.length > 0 && (
                  <div className="flex gap-4 mt-4 flex-wrap">
                    {images.map((img, i) => (
                      <div key={i} className="relative w-24 h-24 group">
                        <img src={img} alt={`Ref ${i}`} className="w-full h-full object-cover rounded-md border border-gray-300" />
                        <button onClick={() => setImages(images.filter((_, index) => index !== i))} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end pt-6 border-t mt-6">
                <button onClick={() => setActiveTab("attendance")} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-8 rounded-lg transition text-[15px]">បន្ទាប់ (Next) &rarr;</button>
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100/60 print:hidden max-w-4xl mx-auto space-y-6">
              <div className="flex justify-between items-center border-b pb-4 mt-2">
                <h2 className="text-xl font-bold flex items-center gap-2"><Users className="w-6 h-6 text-indigo-600"/> បញ្ជីវត្ដមានអ្នកចូលរួម</h2>
                <div className="flex gap-2">
                  <button onClick={() => exportBlankAttendanceToWord({ ministry, office, school, topic, lunarDate, date, startTime, endTime, location, chair, secretary, agenda, content, decision, attendees })} className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 font-medium py-2.5 px-4 rounded-lg transition shadow-sm text-[15px]">
                    <FileDown className="w-4 h-4" /> ទាញយកឯកសារទទេ (Word)
                  </button>
                  <button onClick={() => exportFilledAttendanceToWord({ ministry, office, school, topic, lunarDate, date, startTime, endTime, location, chair, secretary, agenda, content, decision, attendees })} className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 font-medium py-2.5 px-4 rounded-lg transition shadow-sm text-[15px]">
                    <Download className="w-4 h-4" /> ទាញយកទិន្នន័យបានបំពេញ (Word)
                  </button>
                  <button onClick={() => { setPrintMode("blank"); setTimeout(() => window.print(), 100); }} className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 font-medium py-2.5 px-4 rounded-lg transition shadow-sm text-[15px]">
                    <Printer className="w-4 h-4" /> លិខិតទទេ (Print)
                  </button>
                  <button onClick={addAttendee} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 font-medium py-2.5 px-4 rounded-lg transition shadow-sm text-[15px]">
                    <Plus className="w-4 h-4" /> បន្ថែមអ្នកចូលរួម
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex flex-col md:flex-row gap-3 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-sm text-blue-800 font-medium mb-1">ទាញព្រឹត្តិបត្រពីវត្តមាន Google Sheet</label>
                  <input type="text" value={sheetUrl} onChange={e => setSheetUrl(e.target.value)} placeholder="https://docs.google.com/spreadsheets/d/..." className="w-full rounded border-blue-200 border px-3 py-2 text-[15px] outline-none focus:ring-1 focus:ring-blue-500 bg-white" />
                </div>
                <div className="w-full md:w-56">
                  <label className="block text-sm text-blue-800 font-medium mb-1">ច្រោះតាមកាលបរិច្ឆេទ</label>
                  <input type="text" value={sheetDateFilter} onChange={e => setSheetDateFilter(e.target.value)} placeholder="ឧទាហរណ៍: 19/06/2026, 20/06/2026" className="w-full rounded border-blue-200 border px-3 py-2 text-[15px] outline-none focus:ring-1 focus:ring-blue-500 bg-white" />
                </div>
                <button onClick={importFromSheet} disabled={isImporting || !sheetUrl} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg font-medium transition text-[15px] whitespace-nowrap">
                  {isImporting ? "កំពុងទាញ..." : "នាំចូលទិន្នន័យ (Import)"}
                </button>
              </div>

              <div className="bg-gray-50 flex justify-between items-center gap-6 p-4 rounded-lg font-medium text-gray-700 border border-gray-200 text-[15px]">
                <span>សរុប: <span className="font-bold text-gray-900">{attendees.length}</span> នាក់</span>
                {attendees.length > 0 && (
                  <button onClick={() => {
                    if (window.confirm("តើអ្នកពិតជាចង់សម្អាតបញ្ជីវត្តមានពិតប្រាកដមែនទេ?")) {
                      setAttendees([]);
                    }
                  }} className="text-red-600 hover:bg-red-100 flex items-center gap-2 text-[15px] bg-red-50 px-4 py-2 rounded-md transition-colors border border-red-200 shadow-sm">
                    <Trash2 className="w-4 h-4" /> សម្អាតបញ្ជី
                  </button>
                )}
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-100 text-gray-800 text-[15px] border-b border-gray-200">
                      <th className="p-3 font-bold w-12 text-center">ល.រ</th>
                      <th className="p-3 font-bold w-[20%]">ឈ្មោះ</th>
                      <th className="p-3 font-bold w-[10%] text-center">ភេទ</th>
                      <th className="p-3 font-bold w-[20%]">តួនាទី</th>
                      <th className="p-3 font-bold w-[15%]">លេខទូរស័ព្ទ</th>
                      <th className="p-3 font-bold w-[12%] text-center">ហត្ថលេខា</th>
                      <th className="p-3 font-bold w-[13%]">ផ្សេងៗ</th>
                      <th className="p-3 font-bold w-[8%] text-center">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {attendees.map((attendee, index) => (
                      <tr key={attendee.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-center text-gray-600 font-medium">{index + 1}</td>
                        <td className="p-3">
                          <input type="text" value={attendee.name} onChange={(e) => updateAttendee(attendee.id, 'name', e.target.value)} placeholder="បញ្ចូលឈ្មោះ" className="w-full rounded border-gray-200 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-[15px]"/>
                        </td>
                        <td className="p-3 text-center">
                          <select value={attendee.gender} onChange={(e) => updateAttendee(attendee.id, 'gender', e.target.value)} className="w-full rounded border-gray-200 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-[15px] bg-white">
                            <option value=""></option>
                            <option value="ប្រុស">ប្រុស</option>
                            <option value="ស្រី">ស្រី</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <input type="text" value={attendee.role} onChange={(e) => updateAttendee(attendee.id, 'role', e.target.value)} placeholder="តួនាទី" className="w-full rounded border-gray-200 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-[15px]"/>
                        </td>
                        <td className="p-3">
                          <input type="text" value={attendee.phone} onChange={(e) => updateAttendee(attendee.id, 'phone', e.target.value)} placeholder="លេខទូរស័ព្ទ" className="w-full rounded border-gray-200 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-[15px]"/>
                        </td>
                        <td className="p-3">
                          <input type="text" disabled placeholder="ទទេ" className="w-full rounded border-transparent bg-transparent px-3 py-2 text-center text-gray-400 text-[13px] outline-none" />
                        </td>
                        <td className="p-3">
                          <input type="text" value={attendee.note} onChange={(e) => updateAttendee(attendee.id, 'note', e.target.value)} placeholder="ផ្សេងៗ" className="w-full rounded border-gray-200 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-[15px]"/>
                        </td>
                        <td className="p-3 text-center">
                          <button onClick={() => removeAttendee(attendee.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors" title="លុប">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {attendees.length === 0 && (
                  <div className="text-center py-10 text-gray-500 bg-white">មិនទាន់មានអ្នកចូលរួមនៅក្នុងបញ្ជីទេ</div>
                )}
              </div>

              <div className="flex justify-between pt-6 mt-4 border-t border-gray-100">
                <button onClick={() => setActiveTab("general")} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-6 rounded-lg transition text-[15px]">&larr; ត្រឡប់ (Back)</button>
                <button onClick={() => setActiveTab("audio")} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-8 rounded-lg transition text-[15px]">បន្ទាប់ (Next) &rarr;</button>
              </div>
            </div>
          )}

          {/* Audio Tab */}
          {activeTab === "audio" && (
            <div className="space-y-6 print:hidden max-w-3xl mx-auto">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Mic className="w-5 h-5 text-purple-500"/> ឯកសារសម្លេង (Audio File)</h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition">
                  <input type="file" id="audioUpload" accept="audio/*" onChange={handleFileChange} className="hidden" />
                  <label htmlFor="audioUpload" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">{file ? file.name : "ជ្រើសរើសឯកសារសម្លេង (MP3...)"}</span>
                    <span className="text-xs text-gray-500">គាំទ្រទម្រង់ឯកសារសម្លេងផ្សេងៗ</span>
                  </label>
                </div>
                {audioUrl && (
                  <div className="w-full bg-gray-50 rounded-xl p-3 border border-neutral-200">
                    <audio controls src={audioUrl} className="w-full" />
                  </div>
                )}
                <button
                  onClick={handleTranscribe}
                  disabled={!file || isTranscribing}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  {isTranscribing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Mic className="w-5 h-5" />}
                  {isTranscribing ? "កំពុងបម្លែងជាអក្សរ..." : "បម្លែងសម្លេងជាអក្សរ (100%)"}
                </button>
              </div>
            </div>

            {rawTranscript && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex flex-col h-[300px]">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-gray-500"/> អត្ថបទដើម (Raw Transcript)</h2>
                <div className="flex-1 overflow-y-auto mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-800 text-sm whitespace-pre-wrap">
                  {rawTranscript}
                </div>
                <div className="flex gap-4 mt-auto">
                  <button
                    onClick={handleClean}
                    disabled={isCleaning || isSummarizing}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                     {isCleaning ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Eraser className="w-5 h-5" />}
                     {isCleaning ? "កំពុងកែសម្រួល..." : "កែសម្រួលពាក្យទាក់/ស្ទួនៗ"}
                  </button>
                  <button
                    onClick={handleSummarize}
                    disabled={isCleaning || isSummarizing}
                    className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                     {isSummarizing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Sparkles className="w-5 h-5" />}
                     {isSummarizing ? "កំពុងសង្ខេប..." : "សង្ខេបដោយ AI"}
                  </button>
                </div>
              </div>
            )}
            </div>
          )}

          {/* Preview & Print Tab */}
          <div className={`${activeTab === "preview" ? "block" : "hidden"} ${printMode === "minutes" ? "print:block" : "print:hidden"} mx-auto max-w-4xl`}>
            <div className="bg-white shadow-md border border-neutral-200 rounded-lg overflow-y-auto print:overflow-visible print:shadow-none print:border-none w-full relative min-h-[800px] print:min-h-auto print:h-auto">
              
              <div className="flex flex-wrap justify-end gap-2 p-4 border-b bg-gray-50 print:hidden sticky top-0 z-50 rounded-t-lg">
                 <button onClick={() => setActiveTab("audio")} className="bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow-sm font-medium flex items-center gap-2 transition-colors mr-auto">
                   &larr; ត្រឡប់កែសម្រួល
                 </button>
                 <button onClick={() => setShowPostModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-sm text-[15px] font-medium flex items-center gap-2 transition-colors">
                   <Sparkles className="w-5 h-5"/> បង្កើត Post
                 </button>
                 <button onClick={() => exportToWord({ ministry, office, school, topic, lunarDate, date, startTime, endTime, location, chair, secretary, agenda, content, decision, attendees })} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg shadow-sm text-[15px] font-medium flex items-center gap-2 transition-colors">
                   <Download className="w-5 h-5"/> ទាញយកជា Word
                 </button>
                 <button onClick={() => { setPrintMode("minutes"); setTimeout(() => window.print(), 100); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-sm text-[15px] font-medium flex items-center gap-2 transition-colors">
                   <Printer className="w-5 h-5"/> បោះពុម្ពឯកសារ
                 </button>
              </div>

              {/* Standard Cambodian Document Template */}
              <div className="p-8 md:p-12 text-black print:p-0 print:border-none relative max-w-4xl mx-auto mt-4">
                 <div className="text-center font-bold text-[17px] leading-[1.8] mb-8 font-khmer">
                   ព្រះរាជាណាចក្រកម្ពុជា<br/>
                   ជាតិ សាសនា ព្រះមហាក្សត្រ<br/>
                   <div className="w-[120px] h-[1px] bg-black mx-auto mt-2"></div>
                 </div>

                 <div className="flex justify-between items-start mb-8 text-[15px]">
                   <div className="font-bold leading-[1.8] text-left font-khmer">
                     {ministry}<br/>
                     {office}<br/>
                     {school}
                   </div>
                 </div>

                 <div className="text-center mb-6">
                   <h2 className="font-bold text-[18px] mb-2 underline underline-offset-4 font-khmer">កំណត់ហេតុប្រជុំ</h2>
                   <h3 className="font-bold text-[16px] font-khmer">ស្ដីពី</h3>
                   <h3 className="font-bold text-[16px] max-w-lg mx-auto leading-relaxed font-khmer pt-1">{topic || "...................................................."}</h3>
                 </div>

                 <div className="space-y-4 text-justify text-[15px] mb-8 leading-relaxed">
                   <p className="indent-10">
                     {date ? formatKhmerDateText(date) : "ឆ្នាំ........... ខែ........... ថ្ងៃទី........... "} វេលាម៉ោង {startTime ? formatKhmerTimeText(startTime) : "........... "} {location || "..................."} បានរៀបចំកិច្ចប្រជុំស្ដីពី {topic || "...................................................."}។ កិច្ចប្រជុំនេះស្ថិតក្រោមអធិបតីភាព{chair || "..................."} ជានាយក{school || "..................."}។
                   </p>
                 </div>

                 <div className="space-y-4 text-[15px] leading-relaxed mb-6">
                   <div>
                     <span className="font-bold">I. សមាសភាពអ្នកចូលរួម (ដូចមានបញ្ជីវត្តមានភ្ជាប់មកជាមួយ)</span>
                     <div className="pl-6 mt-3">
                       {attendees.some(a => a.name.trim() !== "") ? (
                         <table className="w-full border-collapse border border-gray-500 text-[15px] font-khmer font-normal">
                           <thead>
                             <tr>
                               <th className="border border-gray-500 px-2 py-1.5 font-bold" style={{width: "40px"}}>ល.រ</th>
                               <th className="border border-gray-500 px-2 py-1.5 font-bold">ឈ្មោះ - នាមត្រកូល</th>
                               <th className="border border-gray-500 px-2 py-1.5 font-bold">ភេទ</th>
                               <th className="border border-gray-500 px-2 py-1.5 font-bold">តួនាទី</th>
                               <th className="border border-gray-500 px-2 py-1.5 font-bold">លេខទូរស័ព្ទ</th>
                               <th className="border border-gray-500 px-2 py-1.5 font-bold">ហត្ថលេខា</th>
                               <th className="border border-gray-500 px-2 py-1.5 font-bold">ផ្សេងៗ</th>
                             </tr>
                           </thead>
                           <tbody className="text-center">
                             {attendees.filter(a => a.name.trim() !== "").map((a, i) => (
                               <tr key={a.id}>
                                 <td className="border border-gray-500 px-2 py-1.5">{i + 1}</td>
                                 <td className="border border-gray-500 px-2 py-1.5 text-left">{a.name}</td>
                                 <td className="border border-gray-500 px-2 py-1.5">{a.gender}</td>
                                 <td className="border border-gray-500 px-2 py-1.5">{a.role}</td>
                                 <td className="border border-gray-500 px-2 py-1.5">{a.phone}</td>
                                 <td className="border border-gray-500 px-2 py-1.5 text-transparent">...</td>
                                 <td className="border border-gray-500 px-2 py-1.5">{a.note}</td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       ) : (
                         <div className="text-gray-400 italic">មិនមានអ្នកចូលរួម</div>
                       )}
                     </div>
                   </div>

                   <div>
                     <span className="font-bold">II. របៀបវារៈ</span>
                     <div className="pl-6 mt-1 whitespace-pre-wrap">
                       {agenda || "របៀបវារៈសំខាន់ៗនៃកិច្ចប្រជុំ..."}
                     </div>
                   </div>

                   <div>
                     <span className="font-bold">III. ដំណើរការនៃកិច្ចប្រជុំ និងខ្លឹមសារ</span>
                     <div className="pl-6 mt-2 text-justify">
                       {content ? (
                         <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatTextAsHtml(content) }}></div>
                       ) : (
                         <div className="text-gray-400 italic mt-2 print:hidden">(ខ្លឹមសារកិច្ចប្រជុំនឹងបង្ហាញនៅទីនេះ...)</div>
                       )}
                     </div>
                   </div>
                   
                   {decision && (
                     <div>
                       <span className="font-bold">IV. សេចក្ដីសម្រេច</span>
                       <div className="pl-6 mt-2 text-justify whitespace-pre-wrap">
                         {decision}
                       </div>
                     </div>
                   )}
                 </div>

                 <p className="indent-10 text-justify text-[15px] leading-relaxed mb-12">
                   កិច្ចប្រជុំបានបញ្ចប់នៅវេលាម៉ោង {endTime ? formatKhmerTimeText(endTime) : "........... "} នាថ្ងៃខែឆ្នាំដដែល ក្នុងបរិយាកាសរីករាយ និងស្និទ្ធស្នាល។
                 </p>

                 <div className="flex justify-between font-bold text-[15px] pb-10">
                   <div className="text-center ml-8">
                     បានឃើញ និងឯកភាព<br/>
                     នាយកសាលា
                   </div>
                   <div className="text-center mr-8">
                     {lunarDate || "ថ្ងៃ.................... ខែ........... ឆ្នាំ........... ព.ស. ២៥..."}<br/>
                     {location || "អូរតាប្រុក"}, {formatKhmerDateStandard(date)}<br/>
                     <span className="text-blue-800 mt-2 block">អ្នកធ្វើកំណត់ហេតុ</span>
                   </div>
                 </div>

                 {images.length > 0 && (
                   <div style={{ pageBreakBefore: 'always' }} className="mt-16 break-before-page">
                     <h3 className="font-bold text-center text-[16px] mb-6 font-khmer">រូបភាពឯកសារយោងនៃកិច្ចប្រជុំ</h3>
                     <div className="grid grid-cols-2 gap-6">
                       {images.map((img, i) => (
                         <img key={i} src={img} alt={`ឯកសារយោង ${i+1}`} className="w-full h-auto rounded-md shadow-sm border border-gray-200" />
                       ))}
                     </div>
                   </div>
                 )}
              </div>
            </div>
          </div>

          {/* Blank Attendance Sheet (Print Only) */}
          <div className={`hidden ${printMode === "blank" ? "print:block" : "print:hidden"} w-full max-w-4xl mx-auto bg-white`}>
            <div className="p-0 text-black border-none relative max-w-4xl mx-auto pt-8">
               <div className="text-center font-bold text-[17px] leading-[1.8] mb-8 font-khmer">
                 ព្រះរាជាណាចក្រកម្ពុជា<br/>
                 ជាតិ សាសនា ព្រះមហាក្សត្រ<br/>
               </div>

               <div className="flex justify-between items-start mb-8 text-[15px]">
                 <div className="font-bold leading-[1.8] text-left font-khmer">
                   {ministry}<br/>
                   {office}<br/>
                   {school}
                 </div>
               </div>

               <div className="text-center mb-6">
                 <h2 className="font-bold text-[18px] mb-4 font-khmer">សម្រង់វត្តមានប្រជុំ</h2>
                 <div className="text-left font-bold text-[16px] font-khmer flex gap-2 w-full mx-auto">
                   ស្ដីពី: <div className="border-b-[1.5px] border-dotted border-black flex-1 min-w-0 pb-1">{topic}</div>
                 </div>
                 <div className="border-b-[1.5px] border-dotted border-black w-full mx-auto mt-6"></div>
               </div>

               <table className="w-full border-collapse border border-black text-[15px] font-khmer mb-8">
                 <thead>
                   <tr>
                     <th className="border border-black px-2 py-2 font-bold text-center" style={{width: "50px"}}>ល.រ</th>
                     <th className="border border-black px-2 py-2 font-bold text-center">គោត្តនាម និងនាម</th>
                     <th className="border border-black px-2 py-2 font-bold text-center" style={{width: "60px"}}>ភេទ</th>
                     <th className="border border-black px-2 py-2 font-bold text-center" style={{width: "150px"}}>តួនាទី</th>
                     <th className="border border-black px-2 py-2 font-bold text-center" style={{width: "150px"}}>ហត្ថលេខា</th>
                     <th className="border border-black px-2 py-2 font-bold text-center" style={{width: "120px"}}>ផ្សេងៗ</th>
                   </tr>
                 </thead>
                 <tbody>
                   {Array.from({length: 12}).map((_, i) => (
                     <tr key={i}>
                       <td className="border border-black px-2 text-center" style={{height: "38px"}}>{['១','២','៣','៤','៥','៦','៧','៨','៩','១០','១១','១២'][i]}</td>
                       <td className="border border-black px-2"></td>
                       <td className="border border-black px-2"></td>
                       <td className="border border-black px-2"></td>
                       <td className="border border-black px-2"></td>
                       <td className="border border-black px-2"></td>
                     </tr>
                   ))}
                 </tbody>
               </table>

               <div className="flex justify-between font-bold text-[15px] pb-10">
                 <div className="text-center ml-8 mt-12">
                   ប្រធានអង្គប្រជុំ
                 </div>
                 <div className="text-center mr-8">
                   {lunarDate || "ថ្ងៃ.................... ខែ........... ឆ្នាំ........... ព.ស. ២៥..."}<br/>
                   {location || "អូរតាប្រុក"}, {formatKhmerDateStandard(date)}<br/>
                   <span className="mt-2 block text-blue-800">អ្នកស្រង់វត្តមាន</span>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </motion.div>

      {showRefineAgendaModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h3 className="text-xl font-bold flex items-center gap-2 text-green-700">
                <Sparkles className="w-5 h-5" /> ពិនិត្យ និងយល់ព្រមលើការកែសម្រួលរបៀបវារៈ
              </h3>
              <button 
                onClick={() => setShowRefineAgendaModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <h4 className="font-semibold text-gray-700 border-b pb-2">របៀបវារៈដើម</h4>
                <div className="bg-red-50 p-4 rounded-lg flex-1 text-red-900 whitespace-pre-wrap text-[15px] leading-relaxed border border-red-100" dangerouslySetInnerHTML={{ __html: formatTextAsHtml(agenda) }} />
              </div>
              <div className="flex flex-col space-y-2">
                <h4 className="font-semibold text-gray-700 border-b pb-2">របៀបវារៈដែល AI បានកែសម្រួល</h4>
                <div className="bg-green-50 p-4 rounded-lg flex-1 text-green-900 whitespace-pre-wrap text-[15px] leading-relaxed border border-green-100" dangerouslySetInnerHTML={{ __html: formatTextAsHtml(proposedAgenda) }} />
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex items-center justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setShowRefineAgendaModal(false)}
                className="px-5 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                បិទចោល (Cancel)
              </button>
              <button
                onClick={() => {
                  setAgenda(proposedAgenda);
                  setShowRefineAgendaModal(false);
                }}
                className="px-6 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> យល់ព្រមជំនួសត្រង់នេះ
              </button>
            </div>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                <Settings className="w-5 h-5" /> ការកំណត់ (Settings)
              </h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gemini API Key ផ្ទាល់ខ្លួនរបស់អ្នក
                  </label>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                    ដើម្បីជៀសវាងការអស់ Quota បែងចែក កម្មវិធីនេះតម្រូវឲ្យអ្នកប្រើប្រាស់ API Key របស់ខ្លួនឯង (អាចបង្កើតបានដោយឥតគិតថ្លៃតាម Google AI Studio)។ ទិន្នន័យ API Key នេះត្រូវបានរក្សាទុកតែក្នុងកម្មវិធីរុករក (Browser) របស់អ្នកប៉ុណ្ណោះ។
                  </p>
                  <input 
                    type="password" 
                    value={geminiApiKey} 
                    onChange={e => setGeminiApiKey(e.target.value)} 
                    placeholder="ឧ. AIzaSy..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {!geminiApiKey && (
                    <p className="text-xs text-red-500 mt-2">
                       សូមបញ្ចូល API Key របស់អ្នក ដើម្បីអាចប្រើប្រាស់មុខងារ AI បាន!
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex items-center justify-end rounded-b-2xl">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                រក្សាទុក និងបិទ
              </button>
            </div>
          </div>
        </div>
      )}

      {showRefineModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h3 className="text-xl font-bold flex items-center gap-2 text-green-700">
                <Sparkles className="w-5 h-5" /> ពិនិត្យ និងយល់ព្រមលើការកែសម្រួលខ្លឹមសារ
              </h3>
              <button 
                onClick={() => setShowRefineModal(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <h4 className="font-semibold text-gray-700 border-b pb-2">ខ្លឹមសារដើម</h4>
                <div className="bg-red-50 p-4 rounded-lg flex-1 text-red-900 whitespace-pre-wrap text-[15px] leading-relaxed border border-red-100" dangerouslySetInnerHTML={{ __html: formatTextAsHtml(content) }} />
              </div>
              <div className="flex flex-col space-y-2">
                <h4 className="font-semibold text-gray-700 border-b pb-2">ខ្លឹមសារដែល AI បានកែសម្រួល</h4>
                <div className="bg-green-50 p-4 rounded-lg flex-1 text-green-900 whitespace-pre-wrap text-[15px] leading-relaxed border border-green-100" dangerouslySetInnerHTML={{ __html: formatTextAsHtml(proposedContent) }} />
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex items-center justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setShowRefineModal(false)}
                className="px-5 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                បិទចោល (Cancel)
              </button>
              <button
                onClick={() => {
                  setContent(proposedContent);
                  setShowRefineModal(false);
                }}
                className="px-6 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> យល់ព្រមជំនួសត្រង់នេះ
              </button>
            </div>
          </div>
        </div>
      )}

      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-700">
                <Sparkles className="w-5 h-5" /> បង្កើត Caption សម្រាប់ Facebook
              </h3>
              <button 
                onClick={() => setShowPostModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl"
              >&times;</button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              {!facebookPost ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">តើអ្នកចង់ឱ្យ AI បង្កើត Post ស្វ័យប្រវត្តិមែនទេ?</h4>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    AI នឹងសរសេរ Caption សម្រាប់ផុសលើទំព័រហ្វេសប៊ុក ដោយប្រើពាក្យពេចន៍សមរម្យតាមស្ដង់ដារបស់ក្រសួងអប់រំ យុវជន និងកីឡា។
                  </p>
                  <button 
                    onClick={handleGeneratePost}
                    disabled={isGeneratingPost}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-xl transition shadow-md flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                  >
                    {isGeneratingPost ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        កំពុងតែងនិពន្ធ...
                      </>
                    ) : (
                       "ចាប់ផ្ដើមបង្កើត Post"
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 flex gap-3 text-sm">
                     <span className="text-2xl mt-0.5">💡</span>
                     <div>អ្នកអាចកែសម្រួលអត្ថបទខាងក្រោមទៅតាមការជាក់ស្ដែងបានមុននឹងយកទៅផុស។</div>
                  </div>
                  <textarea
                    value={facebookPost}
                    onChange={(e) => setFacebookPost(e.target.value)}
                    className="w-full h-[350px] p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-[15px] leading-relaxed resize-none bg-gray-50/50"
                  />
                  <div className="flex justify-end gap-3 mt-4">
                     <button
                       onClick={() => navigator.clipboard.writeText(facebookPost).then(() => alert("បានចម្លង!"))}
                       className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-medium py-2.5 px-6 rounded-lg transition"
                     >
                       ចម្លងអត្ថបទ (Copy)
                     </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
