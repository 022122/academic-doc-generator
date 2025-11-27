import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Card, CardBody, Divider, ScrollShadow, Spacer, Select, SelectItem, Tabs, Tab } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateRandomData } from './utils/dataGenerator';

import TuitionTemplate from './components/TuitionTemplate';
import TranscriptTemplate from './components/TranscriptTemplate';
import ScheduleTemplate from './components/ScheduleTemplate';
import AdmissionLetterTemplate from './components/AdmissionLetterTemplate';
import EnrollmentCertificateTemplate from './components/EnrollmentCertificateTemplate';
import StudentCardFrontTemplate from './components/StudentCardFrontTemplate';
import StudentCardBackTemplate from './components/StudentCardBackTemplate';

const App = () => {
  const [formData, setFormData] = useState(generateRandomData());

  const [exportMode, setExportMode] = useState("stitched-horizontal"); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [scale, setScale] = useState(0.55); 
  const [activeCanvas, setActiveCanvas] = useState("main"); // "main" or "extra"
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [includeStudentCard, setIncludeStudentCard] = useState(true);
  const panStartRef = useRef({ x: 0, y: 0 });

  const tuitionRef = useRef(null);
  const transcriptRef = useRef(null);
  const scheduleRef = useRef(null);
  const admissionRef = useRef(null);
  const enrollmentRef = useRef(null);
  const containerRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            setFormData(prev => ({ ...prev, universityLogo: event.target.result }));
        };
        reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            setFormData(prev => ({ ...prev, studentPhoto: event.target.result }));
        };
        reader.readAsDataURL(file);
    }
  };

  const regenerateData = () => {
    setFormData(prev => ({
        ...generateRandomData(),
        universityLogo: prev.universityLogo,
        studentPhoto: prev.studentPhoto
    }));
  };

  const exportStitched = async (forceHorizontal = false) => {
    if (!containerRef.current) return;
    setIsGenerating(true);
    
    // Add exporting class to reset transforms
    containerRef.current.classList.add('exporting');
    
    const originalStyle = containerRef.current.style.cssText;

    try {
      // Temporarily enforce styles if horizontal mode
      if (forceHorizontal) {
        containerRef.current.style.cssText = `
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          gap: 0;
          width: max-content;
          justify-content: flex-start;
          align-items: flex-start;
          position: relative;
          background-color: #ffffff;
        `;
      } else {
        // For grid export, ensuring it captures everything by fitting content
        containerRef.current.style.width = "max-content";
        containerRef.current.style.height = "max-content";
        containerRef.current.style.position = "relative";
        containerRef.current.style.backgroundColor = "#ffffff";
      }

      // Small delay to allow style reflow
      await new Promise(resolve => setTimeout(resolve, 300)); // Increased delay slightly

      const canvas = await html2canvas(containerRef.current, {
        backgroundColor: '#ffffff', 
        scale: 2,
        useCORS: true,
        ignoreElements: (element) => element.classList.contains('doc-label'), 
        logging: false,
        // Force no background transparency
        onclone: (document) => {
            const element = document.querySelector('.exporting');
            if (element) {
                element.style.backgroundColor = '#ffffff';
                element.style.backgroundImage = 'none';
                element.style.boxShadow = 'none';
                element.style.backdropFilter = 'none'; // CRITICAL: Remove any frost effect
            }
            // Also ensure all document cards have solid backgrounds
            const cards = document.querySelectorAll('.document-card > div'); // The inner div with shadow
            cards.forEach(card => {
                card.style.boxShadow = 'none';
                card.style.backgroundColor = '#ffffff';
            });
        }
      });
      
      canvas.toBlob((blob) => {
        saveAs(blob, "SheerID_Documents_Combined.png");
        setIsGenerating(false);
        
        // Restore styles and remove class
        containerRef.current.classList.remove('exporting');
        containerRef.current.style.cssText = originalStyle;
      });
    } catch (err) {
      console.error(err);
      alert("Export failed");
      setIsGenerating(false);
      containerRef.current.classList.remove('exporting');
      containerRef.current.style.cssText = originalStyle;
    }
  };

  const exportZipped = async () => {
    setIsGenerating(true);
    try {
      const zip = new JSZip();
      
      const capture = async (ref, name) => {
        if (!ref.current) return;
        const canvas = await html2canvas(ref.current, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true
        });
        return { name, data: canvas.toDataURL('image/png').split(',')[1] };
      };

      const imagesToCapture = [
        capture(hiddenTuitionRef, "Tuition_Statement.png"),
        capture(hiddenTranscriptRef, "Transcript.png"),
        capture(hiddenScheduleRef, "Schedule.png"),
        capture(hiddenAdmissionRef, "Admission_Letter.png"),
        capture(hiddenEnrollmentRef, "Enrollment_Certificate.png")
      ];

      if (includeStudentCard) {
        imagesToCapture.push(
          capture(hiddenCardFrontRef, "Student_ID_Front.png"),
          capture(hiddenCardBackRef, "Student_ID_Back.png")
        );
      }

      const images = await Promise.all(imagesToCapture);

      images.forEach(img => {
        if(img) zip.file(img.name, img.data, {base64: true});
      });

      const content = await zip.generateAsync({type:"blob"});
      const filename = includeStudentCard ? "SheerID_Documents_WithID.zip" : "SheerID_Documents.zip";
      saveAs(content, filename);
      setIsGenerating(false);

    } catch (err) {
      console.error(err);
      alert("Export failed");
      setIsGenerating(false);
    }
  };

  // Hidden refs for export (Always mounted, off-screen)
  // Using a separate set of refs for export ensures that canvas scaling/drag transforms
  // do not affect the generated images.
  const hiddenTuitionRef = useRef(null);
  const hiddenTranscriptRef = useRef(null);
  const hiddenScheduleRef = useRef(null);
  const hiddenAdmissionRef = useRef(null);
  const hiddenEnrollmentRef = useRef(null);
  const hiddenCardFrontRef = useRef(null);
  const hiddenCardBackRef = useRef(null);
  const cardFrontRef = useRef(null);
  const cardBackRef = useRef(null);

  const exportSingle = async (ref, filename) => {
    if (!ref.current) return;
    setIsGenerating(true);
    try {
        const canvas = await html2canvas(ref.current, {
            backgroundColor: '#ffffff',
            scale: 2, // Higher res
            useCORS: true,
            logging: false
        });
        canvas.toBlob((blob) => {
            saveAs(blob, filename);
            setIsGenerating(false);
        });
    } catch (err) {
        console.error(err);
        alert("Export failed");
        setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (exportMode === "stitched") {
      exportStitched(false); 
    } else if (exportMode === "stitched-horizontal") {
      exportStitched(true);
    } else {
      exportZipped();
    }
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.2));

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setScale(prev => Math.max(0.2, Math.min(2, prev + delta)));
  };

  const handlePanStart = (e) => {
    if (e.target.closest('.document-card')) return;
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handlePanMove = (e) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - panStartRef.current.x,
      y: e.clientY - panStartRef.current.y
    });
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      {/* Top Toolbar */}
      <div className="h-14 flex-shrink-0 border-b border-divider bg-content1 z-30 flex items-center px-4 gap-3">
        <span className="font-bold text-primary text-sm">Stitch:</span>
        <Button 
          color="primary" 
          variant="flat"
          size="sm"
          onClick={() => exportStitched(false)}
          isLoading={isGenerating}
        >
          Grid
        </Button>
        <Button 
          color="primary" 
          variant="flat"
          size="sm"
          onClick={() => exportStitched(true)}
          isLoading={isGenerating}
        >
          Horizontal
        </Button>

        <Divider orientation="vertical" className="h-8" />

        <span className="font-bold text-primary text-sm">ZIP:</span>
        <label className="flex items-center gap-1 text-xs cursor-pointer">
          <input 
            type="checkbox" 
            checked={includeStudentCard} 
            onChange={(e) => setIncludeStudentCard(e.target.checked)}
            className="w-3 h-3 rounded"
          />
          +ID Card
        </label>
        <Button 
          color="success" 
          size="sm"
          onClick={exportZipped}
          isLoading={isGenerating}
        >
          Download ZIP
        </Button>

        <Divider orientation="vertical" className="h-8" />

        <span className="font-bold text-foreground/60 text-sm">Single:</span>
        <Button 
          color="default" 
          variant="flat"
          size="sm"
          onClick={() => exportSingle(hiddenAdmissionRef, "Admission_Letter.png")}
          isLoading={isGenerating}
        >
          Admission
        </Button>
        <Button 
          color="default" 
          variant="flat"
          size="sm"
          onClick={() => exportSingle(hiddenEnrollmentRef, "Enrollment_Certificate.png")}
          isLoading={isGenerating}
        >
          Enrollment
        </Button>
        <Button 
          color="default" 
          variant="flat"
          size="sm"
          onClick={() => exportSingle(hiddenCardFrontRef, "Student_ID_Front.png")}
          isLoading={isGenerating}
        >
          ID Front
        </Button>
        <Button 
          color="default" 
          variant="flat"
          size="sm"
          onClick={() => exportSingle(hiddenCardBackRef, "Student_ID_Back.png")}
          isLoading={isGenerating}
        >
          ID Back
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Input Data */}
        <div className="w-80 flex-shrink-0 border-r border-divider bg-content1 z-20">
          <ScrollShadow className="h-full p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary">Input Data</h2>
              <Button 
                color="secondary" 
                variant="flat"
                size="sm"
                onClick={regenerateData}
              >
                Randomize
              </Button>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Images Section */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-foreground mb-1">University Logo</label>
                  <Button 
                    as="label" 
                    variant="flat" 
                    size="sm" 
                    className="w-full cursor-pointer"
                  >
                    Choose File
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </Button>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-foreground mb-1">Student Photo</label>
                  <Button 
                    as="label" 
                    variant="flat" 
                    size="sm" 
                    className="w-full cursor-pointer"
                  >
                    Choose File
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </Button>
                </div>
              </div>

              <Divider className="my-1" />
              <h3 className="text-sm font-semibold text-foreground/70">University Info</h3>
              
              <Input label="University Name" name="universityName" value={formData.universityName} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              <Input label="University Address" name="universityAddress" value={formData.universityAddress} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />

              <Divider className="my-1" />
              <h3 className="text-sm font-semibold text-foreground/70">Student Info</h3>
              
              <Input label="Student Name" name="studentName" value={formData.studentName} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              <Input label="Student ID" name="studentID" value={formData.studentID} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              
              <Divider className="my-1" />
              <h3 className="text-sm font-semibold text-foreground/70">Academic Info</h3>
              
              <Input label="Term" name="term" value={formData.term} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              <Input label="Major" name="major" value={formData.major} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              <Input label="Program" name="program" value={formData.program} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              <Input label="College" name="college" value={formData.college} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              
              <Divider className="my-1" />
              <h3 className="text-sm font-semibold text-foreground/70">Dates</h3>
              
              <Input label="Statement Date" name="statementDate" value={formData.statementDate} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              <Input label="Due Date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              <Input label="Issue Date" name="issueDate" value={formData.issueDate} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              
              <Divider className="my-1" />
              <h3 className="text-sm font-semibold text-foreground/70">Student ID Card</h3>
              
              <Input label="Card Subtitle" name="cardSubtitle" value={formData.cardSubtitle} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              <Input label="Card Issue Date" name="cardIssueDate" value={formData.cardIssueDate} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
              <Input label="Card Valid Until" name="cardValidDate" value={formData.cardValidDate} onChange={handleInputChange} variant="bordered" labelPlacement="outside" size="sm" />
            </div>
          </ScrollShadow>
        </div>

      {/* Hidden Export Containers - Rendered purely for capture */}
      {/* Positioned way off-screen to ensure no visual interference but valid DOM rendering */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', display: 'flex', flexDirection: 'column' }}>
          {/* Core 3 Docs */}
          <div style={{ backgroundColor: 'white', width: '800px', minHeight: '1000px' }}>
            <TuitionTemplate ref={hiddenTuitionRef} data={formData} />
          </div>
          <div style={{ backgroundColor: 'white', width: '800px', minHeight: '1000px' }}>
            <TranscriptTemplate ref={hiddenTranscriptRef} data={formData} />
          </div>
          <div style={{ backgroundColor: 'white', width: '800px', minHeight: '1000px' }}>
            <ScheduleTemplate ref={hiddenScheduleRef} data={formData} />
          </div>
          
          {/* Extra 2 Docs */}
          <div style={{ backgroundColor: 'white', width: '800px', minHeight: '1000px' }}>
            <AdmissionLetterTemplate ref={hiddenAdmissionRef} data={formData} />
          </div>
          <div style={{ backgroundColor: 'white', width: '800px', minHeight: '1000px' }}>
            <EnrollmentCertificateTemplate ref={hiddenEnrollmentRef} data={formData} />
          </div>
          
          {/* Student ID Card */}
          <div style={{ backgroundColor: 'white', width: '750px', height: '480px' }}>
            <StudentCardFrontTemplate ref={hiddenCardFrontRef} data={formData} />
          </div>
          <div style={{ backgroundColor: 'white', width: '750px', height: '480px' }}>
            <StudentCardBackTemplate ref={hiddenCardBackRef} data={formData} />
          </div>
      </div>

      {/* Main Preview Area - Infinite Canvas Style */}
      <div 
        className="flex-grow overflow-hidden bg-zinc-900 relative cursor-grab active:cursor-grabbing flex flex-col items-center justify-center"
        onWheel={handleWheel}
        onMouseDown={handlePanStart}
        onMouseMove={handlePanMove}
        onMouseUp={handlePanEnd}
        onMouseLeave={handlePanEnd}
      >
        
        {/* Canvas Switcher Tabs - Floating at Top */}
        <div className="absolute top-6 z-40">
            <Tabs 
                aria-label="Canvas Selection" 
                color="primary" 
                variant="bordered"
                selectedKey={activeCanvas}
                onSelectionChange={setActiveCanvas}
                classNames={{
                    tabList: "bg-zinc-800/80 backdrop-blur-md border border-white/10 p-1 rounded-lg",
                    cursor: "bg-primary",
                    tab: "h-10 px-6 text-sm",
                    tabContent: "group-data-[selected=true]:text-white text-zinc-400 font-medium"
                }}
            >
                <Tab key="main" title="Standard Documents (3)" />
                <Tab key="extra" title="Extra Documents (2)" />
                <Tab key="card" title="Student ID Card" />
            </Tabs>
        </div>

        {/* Dot Pattern Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{
                 backgroundImage: 'radial-gradient(#555 1px, transparent 1px)',
                 backgroundSize: '20px 20px'
             }}
        />
        
        {/* Zoom Controls */}
        <div className="absolute bottom-8 right-8 flex gap-2 z-30">
            <Button isIconOnly color="secondary" variant="flat" onClick={handleZoomOut} aria-label="Zoom Out">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                </svg>
            </Button>
            <div className="bg-zinc-800 text-white px-3 py-2 rounded-lg flex items-center font-mono text-sm">
                {Math.round(scale * 100)}%
            </div>
            <Button isIconOnly color="secondary" variant="flat" onClick={handleZoomIn} aria-label="Zoom In">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </Button>
        </div>
        
        {/* Canvas Container - Scaled to fit view */}
        <div 
          className="relative w-full h-full flex items-center justify-center"
          style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }}
        >
            <AnimatePresence mode="wait">
                {activeCanvas === "main" && (
                    <motion.div 
                        key="main-canvas"
                        ref={containerRef} 
                        className="absolute flex flex-row gap-10 p-20 origin-center"
                        initial={{ opacity: 0, scale: scale * 0.9 }}
                        animate={{ opacity: 1, scale: scale }}
                        exit={{ opacity: 0, scale: scale * 0.9 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            width: 'max-content',
                            height: 'max-content',
                        }}
                    >
                        <motion.div 
                            drag 
                            dragMomentum={false}
                            className="relative group document-card"
                        >
                            <div className="absolute -top-8 left-0 bg-zinc-800 text-white px-3 py-1 rounded-t text-sm doc-label shadow-lg">Tuition Statement</div>
                            <div className="shadow-2xl transition-shadow hover:shadow-blue-500/20">
                                <TuitionTemplate ref={tuitionRef} data={formData} />
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            drag 
                            dragMomentum={false}
                            className="relative group document-card"
                        >
                            <div className="absolute -top-8 left-0 bg-zinc-800 text-white px-3 py-1 rounded-t text-sm doc-label shadow-lg">Transcript</div>
                            <div className="shadow-2xl transition-shadow hover:shadow-blue-500/20">
                                <TranscriptTemplate ref={transcriptRef} data={formData} />
                            </div>
                        </motion.div>

                        <motion.div 
                            drag 
                            dragMomentum={false}
                            className="relative group document-card"
                        >
                            <div className="absolute -top-8 left-0 bg-zinc-800 text-white px-3 py-1 rounded-t text-sm doc-label shadow-lg">Course Schedule</div>
                            <div className="shadow-2xl transition-shadow hover:shadow-blue-500/20">
                                <ScheduleTemplate ref={scheduleRef} data={formData} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
                {activeCanvas === "extra" && (
                    <motion.div 
                        key="extra-canvas"
                        className="absolute flex flex-row gap-10 p-20 origin-center"
                        initial={{ opacity: 0, scale: scale * 0.9 }}
                        animate={{ opacity: 1, scale: scale }}
                        exit={{ opacity: 0, scale: scale * 0.9 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            width: 'max-content',
                            height: 'max-content',
                        }}
                    >
                        <motion.div 
                            drag 
                            dragMomentum={false}
                            className="relative group document-card"
                        >
                            <div className="absolute -top-8 left-0 bg-zinc-800 text-white px-3 py-1 rounded-t text-sm doc-label shadow-lg">Admission Letter</div>
                            <div className="shadow-2xl transition-shadow hover:shadow-blue-500/20">
                                <AdmissionLetterTemplate ref={admissionRef} data={formData} />
                            </div>
                        </motion.div>

                        <motion.div 
                            drag 
                            dragMomentum={false}
                            className="relative group document-card"
                        >
                            <div className="absolute -top-8 left-0 bg-zinc-800 text-white px-3 py-1 rounded-t text-sm doc-label shadow-lg">Enrollment Cert</div>
                            <div className="shadow-2xl transition-shadow hover:shadow-blue-500/20">
                                <EnrollmentCertificateTemplate ref={enrollmentRef} data={formData} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
                {activeCanvas === "card" && (
                    <motion.div 
                        key="card-canvas"
                        className="absolute flex flex-row gap-10 p-20 origin-center"
                        initial={{ opacity: 0, scale: scale * 0.9 }}
                        animate={{ opacity: 1, scale: scale }}
                        exit={{ opacity: 0, scale: scale * 0.9 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            width: 'max-content',
                            height: 'max-content',
                        }}
                    >
                        <motion.div 
                            drag 
                            dragMomentum={false}
                            className="relative group document-card"
                        >
                            <div className="absolute -top-8 left-0 bg-zinc-800 text-white px-3 py-1 rounded-t text-sm doc-label shadow-lg">Student ID (Front)</div>
                            <div className="shadow-2xl transition-shadow hover:shadow-blue-500/20">
                                <StudentCardFrontTemplate ref={cardFrontRef} data={formData} />
                            </div>
                        </motion.div>

                        <motion.div 
                            drag 
                            dragMomentum={false}
                            className="relative group document-card"
                        >
                            <div className="absolute -top-8 left-0 bg-zinc-800 text-white px-3 py-1 rounded-t text-sm doc-label shadow-lg">Student ID (Back)</div>
                            <div className="shadow-2xl transition-shadow hover:shadow-blue-500/20">
                                <StudentCardBackTemplate ref={cardBackRef} data={formData} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
      </div>
    </div>
  );
};

export default App;
