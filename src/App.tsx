import React, { useState } from "react";
import { Mic, Upload, FileText, Eraser, FileOutput, Users, Printer, Plus, Trash2 } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("general");
  const [printMode, setPrintMode] = useState<"minutes" | "blank">("minutes");
  const [file, setFile] = useState<File | null>(null);
  
  const [ministry, setMinistry] = useState("");
  const [office, setOffice] = useState("ការិយាល័យអប់រំយុវជន និងកីឡាស្រុកក្រគរ");
  const [school, setSchool] = useState("សាលាបឋមសិក្សាអូរតាប្រុក");
  const [topic, setTopic] = useState("ការបំពេញស្ដង់ដាសាលាគំរូ");
  const [lunarDate, setLunarDate] = useState("ថ្ងៃព្រហស្បតិ៍ ០៤រោច ខែជេស្ឋ ឆ្នាំរោង");
  const [date, setDate] = useState("2026-06-04");
  const [startTime, setStartTime] = useState("08:30");
  const [endTime, setEndTime] = useState("21:40");
  const [location, setLocation] = useState("តាមរយៈ Google Meet");
  const [chair, setChair] = useState("លួន សុផាត");
  const [secretary, setSecretary] = useState("អ៊ិត ថាត");
  const [agenda, setAgenda] = useState("១. ចុះវត្តមាន (https://forms.gle/H9xzUHHYmdHiKTC59)\n២. មតិសំណេះសំណាលរបស់លោកនាយកសាលារៀន\n៣. បទបង្ហាញស្ដីពីវឌ្ឍនភាពការបំពេញស្តង់ដាសាលាគំរូ");
  const [content, setContent] = useState("");
  const [decision, setDecision] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [attendees, setAttendees] = useState([
    { id: 1, name: "", role: "នាយកសាលា", phone: "", note: "" },
    { id: 2, name: "", role: "គ្រូបង្រៀន", phone: "", note: "" }
  ]);

  const [isTranscribing, setIsTranscribing] = useState(false);
  const [rawTranscript, setRawTranscript] = useState("");

  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanedTranscript, setCleanedTranscript] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const addAttendee = () => {
    setAttendees([...attendees, { id: Date.now(), name: "", role: "", phone: "", note: "" }]);
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
        headers: { "Content-Type": "application/json" },
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

  const formatTextAsHtml = (text: string) => {
    return text.replace(/\n/g, "<br/>");
  };

  return (
    <div className="min-h-screen bg-neutral-100 py-10 px-4 print:bg-white print:py-0 print:px-0">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="text-center space-y-2 print:hidden">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">បរិក្ខារកំណត់ហេតុប្រជុំ (Meeting Minutes Generator)</h1>
          <p className="text-gray-500">ប្រព័ន្ធបម្លែងសម្លេងជាអក្សរ និងរៀបចំជារបាយការណ៍កំណត់ហេតុស្ដង់ដារ</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-xl shadow-sm border border-neutral-200 p-2 mb-6 gap-2 overflow-x-auto print:hidden max-w-4xl mx-auto w-full">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-lg font-medium text-[15.5px] transition-colors whitespace-nowrap ${activeTab === "general" ? "bg-blue-100/60 text-blue-800 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
          >
           <FileText className="w-5 h-5" /> ទិន្នន័យទូទៅ
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-lg font-medium text-[15.5px] transition-colors whitespace-nowrap ${activeTab === "attendance" ? "bg-blue-100/60 text-blue-800 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <Users className="w-5 h-5" /> បញ្ជីវត្ដមាន
          </button>
          <button
            onClick={() => setActiveTab("audio")}
            className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-lg font-medium text-[15.5px] transition-colors whitespace-nowrap ${activeTab === "audio" ? "bg-blue-100/60 text-blue-800 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <Mic className="w-5 h-5" /> បំប្លែងសំឡេង
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-lg font-medium text-[15.5px] transition-colors whitespace-nowrap ${activeTab === "preview" ? "bg-blue-100/60 text-blue-800 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <Printer className="w-5 h-5" /> មើល និងបោះពុម្ព
          </button>
        </div>

        <div className="w-full">
          {/* General Tab */}
          {activeTab === "general" && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 print:hidden max-w-4xl mx-auto space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b pb-4"><FileText className="w-6 h-6 text-blue-600"/> ព័ត៌មាននៃការប្រជុំ</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">ស្ថាប័ន / ក្រសួង</label>
                  <input type="text" value={ministry} onChange={e => setMinistry(e.target.value)} className="w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">មន្ទីរ / ការិយាល័យ</label>
                  <input type="text" value={office} onChange={e => setOffice(e.target.value)} className="w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">ឈ្មោះសាលារៀន</label>
                  <input type="text" value={school} onChange={e => setSchool(e.target.value)} className="w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">ប្រធានបទប្រជុំ</label>
                  <input type="text" value={topic} onChange={e => setTopic(e.target.value)} className="w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">ថ្ងៃខែឆ្នាំចន្ទគតិ</label>
                  <input type="text" value={lunarDate} onChange={e => setLunarDate(e.target.value)} className="w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">កាលបរិច្ឆេទ</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">ម៉ោងចាប់ផ្ដើម</label>
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">ម៉ោងបញ្ចប់</label>
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">ទីកន្លែង</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">ប្រធានអង្គប្រជុំ (អ្នកដឹកនាំ)</label>
                  <input type="text" value={chair} onChange={e => setChair(e.target.value)} className="w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">អ្នកកត់ត្រា (លេខា)</label>
                  <input type="text" value={secretary} onChange={e => setSecretary(e.target.value)} className="w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">របៀបវារៈ</label>
                <textarea value={agenda} onChange={e => setAgenda(e.target.value)} className="w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none h-32 leading-relaxed whitespace-pre-wrap"></textarea>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">ដំណើរការនៃកិច្ចប្រជុំ / ខ្លឹមសារ (អាចបញ្ចូលពីការបំប្លែងសំឡេងបាន)</label>
                <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none h-40 leading-relaxed whitespace-pre-wrap"></textarea>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">សេចក្ដីសម្រេច</label>
                <textarea value={decision} onChange={e => setDecision(e.target.value)} className="w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none h-24 whitespace-pre-wrap"></textarea>
              </div>

              <div className="pt-2">
                <label className="block text-sm text-gray-600 mb-2">រូបភាពឯកសារយោង (ភ្ជាប់ទៅក្នុងកំណត់ហេតុ)</label>
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
                <button onClick={() => setActiveTab("attendance")} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-lg transition text-[15px]">បន្ទាប់ (Next) &rarr;</button>
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200 print:hidden max-w-4xl mx-auto space-y-6">
              <div className="flex justify-between items-center border-b pb-4 mt-2">
                <h2 className="text-xl font-bold flex items-center gap-2"><Users className="w-6 h-6 text-blue-600"/> បញ្ជីវត្ដមានអ្នកចូលរួម</h2>
                <div className="flex gap-2">
                  <button onClick={() => { setPrintMode("blank"); setTimeout(() => window.print(), 100); }} className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 font-medium py-2.5 px-4 rounded-lg transition shadow-sm text-[14.5px]">
                    <Printer className="w-4 h-4" /> លិខិតទទេ
                  </button>
                  <button onClick={addAttendee} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 font-medium py-2.5 px-4 rounded-lg transition shadow-sm text-[14.5px]">
                    <Plus className="w-4 h-4" /> បន្ថែមអ្នកចូលរួម
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 flex items-center gap-6 p-4 rounded-lg font-medium text-gray-700 border border-gray-200 text-[15px]">
                <span>សរុប: <span className="font-bold text-gray-900">{attendees.length}</span> នាក់</span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-100 text-gray-800 text-[15px] border-b border-gray-200">
                      <th className="p-3 font-bold w-12 text-center">ល.រ</th>
                      <th className="p-3 font-bold w-[25%]">ឈ្មោះ</th>
                      <th className="p-3 font-bold w-[25%]">តួនាទី</th>
                      <th className="p-3 font-bold w-[20%]">លេខទូរស័ព្ទ</th>
                      <th className="p-3 font-bold w-[20%]">ផ្សេងៗ</th>
                      <th className="p-3 font-bold w-[10%] text-center">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {attendees.map((attendee, index) => (
                      <tr key={attendee.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-center text-gray-600 font-medium">{index + 1}</td>
                        <td className="p-3">
                          <input type="text" value={attendee.name} onChange={(e) => updateAttendee(attendee.id, 'name', e.target.value)} placeholder="បញ្ចូលឈ្មោះ" className="w-full rounded border-gray-200 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-[15px]"/>
                        </td>
                        <td className="p-3">
                          <input type="text" value={attendee.role} onChange={(e) => updateAttendee(attendee.id, 'role', e.target.value)} placeholder="តួនាទី" className="w-full rounded border-gray-200 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-[15px]"/>
                        </td>
                        <td className="p-3">
                          <input type="text" value={attendee.phone} onChange={(e) => updateAttendee(attendee.id, 'phone', e.target.value)} placeholder="លេខទូរស័ព្ទ" className="w-full rounded border-gray-200 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-[15px]"/>
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
                <button onClick={() => setActiveTab("audio")} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-lg transition text-[15px]">បន្ទាប់ (Next) &rarr;</button>
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
                <button
                  onClick={handleTranscribe}
                  disabled={!file || isTranscribing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
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
                <button
                  onClick={handleClean}
                  disabled={isCleaning}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition mt-auto"
                >
                   {isCleaning ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Eraser className="w-5 h-5" />}
                   {isCleaning ? "កំពុងកែសម្រួល..." : "កែសម្រួលពាក្យទាក់/ស្ទួនៗ"}
                </button>
              </div>
            )}
            </div>
          )}

          {/* Preview & Print Tab */}
          <div className={`${activeTab === "preview" ? "block" : "hidden"} ${printMode === "minutes" ? "print:block" : "print:hidden"} mx-auto max-w-4xl`}>
            <div className="bg-white shadow-md border border-neutral-200 rounded-lg overflow-y-auto print:overflow-visible print:shadow-none print:border-none w-full relative min-h-[800px] print:min-h-auto print:h-auto">
              
              <div className="absolute top-4 right-4 flex gap-2 print:hidden z-10">
                 <button onClick={() => setActiveTab("audio")} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-sm font-medium flex items-center gap-2 transition-colors mr-2">
                   &larr; ត្រឡប់កែសម្រួល
                 </button>
                 <button onClick={() => { setPrintMode("minutes"); setTimeout(() => window.print(), 100); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-sm text-[15px] font-medium flex items-center gap-2 transition-colors">
                   <Printer className="w-5 h-5"/> បោះពុម្ពឯកសារ
                 </button>
              </div>

              {/* Standard Cambodian Document Template */}
              <div className="p-12 text-black print:p-0 print:border-none relative max-w-4xl mx-auto">
                 <div className="text-center font-bold text-[17px] leading-tight mb-8 font-khmer">
                   ព្រះរាជាណាចក្រកម្ពុជា<br/>
                   ជាតិ សាសនា ព្រះមហាក្សត្រ<br/>
                   <div className="w-[120px] h-[1px] bg-black mx-auto mt-2"></div>
                 </div>

                 <div className="flex justify-between items-start mb-8 text-[15px]">
                   <div className="font-bold leading-snug text-center font-khmer">
                     {ministry}<br/>
                     {office}<br/>
                     {school}<br/>
                     <div className="w-[80px] h-[1px] bg-black mx-auto mt-1"></div>
                   </div>
                 </div>

                 <div className="text-center mb-6">
                   <h2 className="font-bold text-[18px] mb-2 underline underline-offset-4 font-khmer">កំណត់ហេតុប្រជុំ</h2>
                   <h3 className="font-bold text-[16px] font-khmer">ស្ដីពី</h3>
                   <h3 className="font-bold text-[16px] max-w-lg mx-auto leading-relaxed font-khmer pt-1">{topic || "...................................................."}</h3>
                 </div>

                 <div className="space-y-4 text-justify text-[15px] mb-8 leading-relaxed">
                   <p className="indent-10">
                     នៅ{lunarDate} ត្រូវនឹងថ្ងៃទី {date ? new Date(date).toLocaleDateString('km-KH') : "..............ខែ...........ឆ្នាំ........"} វេលាម៉ោង {startTime || "..........."} ដល់ម៉ោង {endTime || "..........."} នៅ {location || "..................."} 
                     បានរៀបចំកិច្ចប្រជុំស្ដីពី {topic || "...................................................."}។ 
                     កិច្ចប្រជុំនេះស្ថិតក្រោមអធិបតីភាព {chair || "..........................................................."} និងមានអ្នកកត់ត្រា {secretary || "........................................................."}។
                   </p>
                 </div>

                 <div className="space-y-4 text-[15px] leading-relaxed mb-6">
                   <div>
                     <span className="font-bold">I. សមាសភាពអ្នកចូលរួម (ដូចមានបញ្ជីវត្តមានភ្ជាប់មកជាមួយ)</span>
                     <div className="pl-6 mt-3">
                       {attendees.some(a => a.name.trim() !== "") ? (
                         <table className="w-full border-collapse border border-gray-500 text-[14.5px] font-khmer font-normal">
                           <thead>
                             <tr>
                               <th className="border border-gray-500 px-2 py-1.5 font-bold" style={{width: "40px"}}>ល.រ</th>
                               <th className="border border-gray-500 px-2 py-1.5 font-bold">ឈ្មោះ - នាមត្រកូល</th>
                               <th className="border border-gray-500 px-2 py-1.5 font-bold">តួនាទី</th>
                               <th className="border border-gray-500 px-2 py-1.5 font-bold">លេខទូរស័ព្ទ</th>
                               <th className="border border-gray-500 px-2 py-1.5 font-bold">ផ្សេងៗ</th>
                             </tr>
                           </thead>
                           <tbody className="text-center">
                             {attendees.filter(a => a.name.trim() !== "").map((a, i) => (
                               <tr key={a.id}>
                                 <td className="border border-gray-500 px-2 py-1.5">{i + 1}</td>
                                 <td className="border border-gray-500 px-2 py-1.5 text-left">{a.name}</td>
                                 <td className="border border-gray-500 px-2 py-1.5">{a.role}</td>
                                 <td className="border border-gray-500 px-2 py-1.5">{a.phone}</td>
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
                   កិច្ចប្រជុំបានបញ្ចប់នៅវេលាម៉ោង {endTime} នាថ្ងៃខែឆ្នាំដដែល ក្នុងបរិយាកាសរីករាយ និងស្និទ្ធស្នាល។
                 </p>

                 <div className="flex justify-between font-bold text-[15px] pb-10">
                   <div className="text-center ml-8">
                     បានឃើញ និងឯកភាព<br/>
                     នាយកសាលា
                   </div>
                   <div className="text-center mr-8">
                     ធ្វើនៅ.................... ថ្ងៃទី...........ខែ...........ឆ្នាំ...........<br/>
                     អ្នកធ្វើកំណត់ហេតុ
                   </div>
                 </div>

                 {images.length > 0 && (
                   <div className="mt-16 break-before-page">
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
               <div className="text-center font-bold text-[17px] leading-tight mb-8 font-khmer">
                 ព្រះរាជាណាចក្រកម្ពុជា<br/>
                 ជាតិ សាសនា ព្រះមហាក្សត្រ<br/>
               </div>

               <div className="flex justify-between items-start mb-8 text-[15px]">
                 <div className="font-bold leading-snug text-left font-khmer">
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
                   {lunarDate}<br/>
                   ធ្វើនៅ.................... ថ្ងៃទី...........ខែ...........ឆ្នាំ...........<br/>
                   អ្នកស្រង់វត្តមាន
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
