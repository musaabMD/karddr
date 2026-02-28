"use client";

import { useState } from "react";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@workos-inc/authkit-nextjs/components";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"] });

const EXAM_TAGS = [
  { key: "usmle1", label: "USMLE Step 1" },
  { key: "usmle2", label: "USMLE Step 2 CK" },
  { key: "comlex", label: "COMLEX" },
  { key: "pance", label: "PANCE" },
  { key: "nclex", label: "NCLEX-RN" },
];

const CLINICAL_TAGS = [
  { key: "icu", label: "ICU" },
  { key: "emergency", label: "Emergency" },
  { key: "cardiology", label: "Cardiology" },
  { key: "neurology", label: "Neurology" },
  { key: "pediatrics", label: "Pediatrics" },
  { key: "surgery", label: "Surgery" },
];

const EXAM_SECONDARY = ["Subjects", "Topics", "Review", "Mock Exams", "Notes"];
const CLINICAL_SECONDARY = ["Sections", "Topics", "Bookmarks"];

const EXAM_CONTENT: Record<string, Record<string, string[]>> = {
  usmle1: {
    Subjects: ["Pathology", "Pharmacology", "Biochemistry", "Physiology", "Microbiology", "Anatomy", "Behavioral Science", "Immunology", "Genetics", "Biostatistics"],
    Topics: ["Inflammation & Repair", "Neoplasia", "Hemodynamic Disorders", "Autonomic Drugs", "Antimicrobials", "Amino Acid Metabolism", "Lipid Metabolism", "Cell Injury", "Immunodeficiencies", "Genetic Disorders", "CNS Pharmacology", "Renal Physiology", "Cardiac Physiology"],
    Review: ["High-Yield Pathology", "Rapid Pharmacology Review", "Biochemistry Mnemonics", "Physiology Key Concepts", "Micro Quick Hits", "Anatomy Essentials"],
    "Mock Exams": ["Block 1 — 40 Questions", "Block 2 — 40 Questions", "Block 3 — 40 Questions", "Full-Length Exam (280 Q)", "Timed Mini-Test (20 Q)", "Weak Areas Focus"],
    Notes: ["My Pathology Notes", "Pharm Drug Table", "Sketchy Micro Summary", "Board Review Session 1", "First Aid Annotations"],
  },
  usmle2: {
    Subjects: ["Internal Medicine", "Surgery", "Pediatrics", "OB/GYN", "Psychiatry", "Emergency Medicine", "Preventive Medicine", "Ethics & Law"],
    Topics: ["Acute Coronary Syndrome", "Heart Failure Management", "Pneumonia — CAP vs HAP", "DKA Protocol", "Sepsis Guidelines", "Acute Abdomen", "Trauma — ATLS", "Preeclampsia", "Ectopic Pregnancy"],
    Review: ["IM Rapid Review", "Surgery High-Yield", "Peds Milestones", "OB Emergencies", "Psych Medications"],
    "Mock Exams": ["CCS Case — Chest Pain", "CCS Case — Abdominal Pain", "Block 1 — 44 Questions", "Full-Length Exam"],
    Notes: ["IM Ward Notes", "Surgery Shelf Prep", "Step 2 Weak Points"],
  },
  comlex: {
    Subjects: ["OMM", "Cardiovascular", "Pulmonary", "GI & Hepatology", "Renal", "Neuroscience", "MSK"],
    Topics: ["HVLA Techniques", "Muscle Energy", "Counterstrain", "Myofascial Release", "Chapman Points", "Cranial Osteopathy", "Rib Mechanics"],
    Review: ["OMM Quick Review", "Viscerosomatic Reflexes", "Spinal Mechanics"],
    "Mock Exams": ["COMLEX Level 1 Practice", "OMM Focused Block"],
    Notes: ["OMM Table Notes", "COMLEX Strategy"],
  },
  pance: {
    Subjects: ["Cardiology", "Pulmonary", "GI", "Renal", "Endocrine", "Neurology", "Dermatology", "MSK"],
    Topics: ["Hypertension", "Valvular Disease", "Arrhythmias", "Asthma", "COPD", "Pulmonary Embolism"],
    Review: ["Cardio Quick Hits", "Pulm Essentials", "GI Review"],
    "Mock Exams": ["PANCE Practice Block 1", "Timed 60-Question Set"],
    Notes: ["Clinical Rotations Notes", "PANCE Prep Highlights"],
  },
  nclex: {
    Subjects: ["Medical-Surgical", "Pharmacology", "Maternal-Newborn", "Pediatric Nursing", "Mental Health", "Community Health"],
    Topics: ["Fluid & Electrolytes", "Cardiac Nursing", "Respiratory Nursing", "Drug Calculations", "IV Therapy", "Pain Management"],
    Review: ["Priority & Delegation", "Lab Values Review", "Medication Safety"],
    "Mock Exams": ["CAT Simulation — 75 Q", "CAT Simulation — 145 Q", "Pharmacology Focus"],
    Notes: ["NCLEX Strategy Notes", "Saunders Key Points"],
  },
};

const CLINICAL_CONTENT: Record<string, Record<string, string[]>> = {
  icu: {
    Sections: ["Ventilator Management", "Hemodynamic Monitoring", "Sedation & Analgesia", "Nutrition in ICU", "Fluid Resuscitation", "Renal Replacement Therapy", "Blood Gas Interpretation", "Central Line Placement"],
    Topics: ["Sepsis Bundle — Hour 1", "ARDS — Berlin Criteria", "Cardiac Arrest — ACLS", "Status Epilepticus", "Massive Transfusion Protocol", "Tension Pneumothorax", "DKA in ICU", "Acute Liver Failure", "Intracranial Hypertension", "Post-Cardiac Arrest Care"],
    Bookmarks: ["Sepsis Bundle", "Ventilator Settings Cheat Sheet", "Vasopressor Table"],
  },
  emergency: {
    Sections: ["Primary Survey — ABCDE", "Triage Protocols", "Resuscitation Bay", "Trauma Assessment", "Toxicology Screening", "Rapid Sequence Intubation"],
    Topics: ["Chest Pain Workup", "Stroke — Door to Needle", "Anaphylaxis Management", "Toxicology — Overdose", "Hemorrhagic Shock", "Head Injury — GCS", "Burns — Rule of Nines", "Spinal Cord Injury"],
    Bookmarks: ["ATLS Checklist", "GCS Quick Ref"],
  },
  cardiology: {
    Sections: ["ECG Interpretation", "Echocardiography Basics", "Cardiac Catheterization", "Electrophysiology", "Heart Failure Clinic", "Cardiac Rehabilitation"],
    Topics: ["STEMI Management", "NSTEMI / Unstable Angina", "Aortic Dissection", "Cardiac Tamponade", "PE — Wells Score", "Heart Failure — HFrEF vs HFpEF", "Atrial Fibrillation", "Valvular Heart Disease", "Hypertension Guidelines", "Infective Endocarditis"],
    Bookmarks: ["STEMI Protocol", "AF Rate vs Rhythm Control"],
  },
  neurology: {
    Sections: ["Neurological Examination", "Lumbar Puncture", "EEG Interpretation", "Neuroimaging", "Stroke Unit Protocols", "Neuro-ICU"],
    Topics: ["Ischemic Stroke — Thrombolysis", "Hemorrhagic Stroke", "SAH — Hunt & Hess", "TIA Workup", "Seizures & Epilepsy", "Multiple Sclerosis", "Guillain-Barré Syndrome", "Meningitis — Empiric Tx", "Myasthenia Gravis", "Parkinson Disease"],
    Bookmarks: ["NIH Stroke Scale", "Seizure First Aid"],
  },
  pediatrics: {
    Sections: ["Growth & Development", "Immunization Schedule", "Neonatal Assessment", "PALS Protocols", "Pediatric Dosing", "Child Safeguarding"],
    Topics: ["APGAR Scoring", "Neonatal Jaundice", "Respiratory Distress", "Congenital Heart Disease", "Febrile Seizures", "Croup vs Epiglottitis", "Kawasaki Disease", "Pyloric Stenosis", "Intussusception", "Bronchiolitis"],
    Bookmarks: ["APGAR Chart", "Peds Drug Doses"],
  },
  surgery: {
    Sections: ["Pre-Op Assessment", "Surgical Safety Checklist", "Wound Management", "Post-Op Complications", "Fluid Management", "Surgical Nutrition"],
    Topics: ["Acute Appendicitis", "Cholecystitis — Tokyo Guidelines", "Bowel Obstruction", "Hernia Repair", "Peritonitis", "AAA Screening", "Carotid Stenosis", "DVT Management", "Compartment Syndrome", "Necrotizing Fasciitis"],
    Bookmarks: ["WHO Surgical Checklist", "ASA Classification"],
  },
};

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ background: "#FDE68A", borderRadius: 2, padding: "0 1px" }}>
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function DrKard() {
  const { user, signOut } = useAuth();
  const [mode, setMode] = useState<"exams" | "clinical">("exams");
  const [activeTag, setActiveTag] = useState("usmle1");
  const [activeSecondary, setActiveSecondary] = useState("Subjects");
  const [searchQuery, setSearchQuery] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [sheetSearch, setSheetSearch] = useState("");
  const [bookmarkedKeys, setBookmarkedKeys] = useState<Set<string>>(new Set());
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Get user initials for avatar
  const userInitials = user
    ? (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")
    : "";

  const handleSignIn = () => {
    window.location.href = "/auth/sign-in";
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const tags = mode === "exams" ? EXAM_TAGS : CLINICAL_TAGS;
  const secondaryTabs = mode === "exams" ? EXAM_SECONDARY : CLINICAL_SECONDARY;
  const currentTag = tags.find((t) => t.key === activeTag) ?? tags[0];
  const contentMap = mode === "exams" ? EXAM_CONTENT : CLINICAL_CONTENT;
  const items: string[] = (contentMap[currentTag.key] ?? {})[activeSecondary] ?? [];

  const q = searchQuery.toLowerCase().trim();
  const filtered = q ? items.filter((i) => i.toLowerCase().includes(q)) : items;

  const sq = sheetSearch.toLowerCase().trim();
  const filteredExamTags = sq ? EXAM_TAGS.filter((t) => t.label.toLowerCase().includes(sq)) : EXAM_TAGS;
  const filteredClinicalTags = sq ? CLINICAL_TAGS.filter((t) => t.label.toLowerCase().includes(sq)) : CLINICAL_TAGS;
  const bookmarkedExam = EXAM_TAGS.filter((t) => bookmarkedKeys.has(t.key));
  const bookmarkedClinical = CLINICAL_TAGS.filter((t) => bookmarkedKeys.has(t.key));
  const hasBookmarks = bookmarkedExam.length > 0 || bookmarkedClinical.length > 0;

  function handleModeSwitch(newMode: "exams" | "clinical") {
    setMode(newMode);
    setActiveTag(newMode === "exams" ? "usmle1" : "icu");
    setActiveSecondary(newMode === "exams" ? "Subjects" : "Sections");
    setSearchQuery("");
    setModeDropdownOpen(false);
  }

  function handleTagSelect(tagKey: string, tagMode: "exams" | "clinical") {
    setMode(tagMode);
    setActiveTag(tagKey);
    setActiveSecondary(tagMode === "exams" ? "Subjects" : "Sections");
    setPickerOpen(false);
    setSheetSearch("");
    setSearchQuery("");
  }

  function toggleBookmark(key: string) {
    setBookmarkedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function closeSheet() {
    setPickerOpen(false);
    setSheetSearch("");
  }

  return (
    <div className={dmSans.className} style={{ minHeight: "100vh", background: "#FFFFFF" }}>
      <style>{`
        .dk-sw { cursor: pointer; border: none; outline: none; transition: all 0.18s; }
        .dk-pi { cursor: pointer; transition: background 0.1s; }
        .dk-pi:hover { background: #F4F4F5; }
        .dk-card-row { transition: background 0.12s, border-color 0.12s; cursor: pointer; }
        .dk-card-row:hover { background: #E4E4E7 !important; border-color: #D4D4D8 !important; }
        .dk-chip-btn { cursor: pointer; border: none; outline: none; transition: all 0.15s; }
        .dk-chip-btn:hover { background: #EBEBED !important; }
        .dk-bm-btn { cursor: pointer; border: none; background: none; outline: none; transition: transform 0.15s; line-height: 1; }
        .dk-bm-btn:hover { transform: scale(1.2); }
        .dk-mode-btn { cursor: pointer; border: none; outline: none; transition: background 0.15s; font-family: inherit; }
        .dk-mode-btn:hover { background: #F4F4F5 !important; }
        .dk-dropdown-item { cursor: pointer; border: none; outline: none; transition: background 0.12s; font-family: inherit; width: 100%; text-align: left; }
        .dk-dropdown-item:hover { background: #F4F4F5 !important; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
        .dk-a { animation: fadeIn 0.18s ease forwards; }
        @keyframes sidebarIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        .dk-sheet { animation: sidebarIn 0.26s cubic-bezier(0.32,0.72,0,1) forwards; }
        @keyframes fadeOverlay { from { opacity:0; } to { opacity:1; } }
        .dk-overlay { animation: fadeOverlay 0.2s ease forwards; }
        @keyframes dropdownIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        .dk-dropdown { animation: dropdownIn 0.14s ease forwards; }

        .dk-tabs [data-slot="tabs-trigger"] {
          color: #A1A1AA !important;
          font-size: 14px !important;
          font-weight: 600 !important;
        }
        .dk-tabs [data-slot="tabs-trigger"]:hover:not([data-state="active"]) {
          color: #52525B !important;
        }
        .dk-tabs [data-slot="tabs-trigger"][data-state="active"] {
          color: #18181B !important;
          font-weight: 700 !important;
        }
        .dk-tabs [data-slot="tabs-trigger"][data-state="active"]::after {
          background-color: #18181B !important;
        }

        .dk-search-input:focus { outline: none; }
        .dk-search-input::placeholder { color: #A1A1AA; }
        .dk-sheet-search:focus { outline: none; }
        .dk-sheet-search::placeholder { color: #A1A1AA; }
      `}</style>

      {/* ── BOTTOM SHEET OVERLAY ── */}
      {pickerOpen && (
        <>
          <div
            className="dk-overlay"
            onClick={closeSheet}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(3px)",
              zIndex: 200,
            }}
          />
          <div
            className="dk-sheet"
            style={{
              position: "fixed", top: 0, left: 0, bottom: 0,
              width: 300,
              background: "#FFFFFF",
              borderRadius: "0 18px 18px 0",
              boxShadow: "4px 0 32px rgba(0,0,0,0.12)",
              zIndex: 201,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Sheet header */}
            <div style={{ padding: "20px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: "#18181B" }}>Choose Resource</span>
              <button
                onClick={closeSheet}
                style={{ background: "#F4F4F5", border: "1px solid #E4E4E7", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#71717A", fontSize: 13, fontWeight: 600 }}
              >
                ✕
              </button>
            </div>

            {/* Search bar */}
            <div style={{ padding: "0 20px 14px" }}>
              <div style={{ background: "#F4F4F5", border: "1px solid #E4E4E7", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  className="dk-sheet-search"
                  placeholder="Search resources…"
                  value={sheetSearch}
                  onChange={(e) => setSheetSearch(e.target.value)}
                  style={{ flex: 1, border: "none", background: "none", fontSize: 14, color: "#18181B", fontFamily: "inherit" }}
                  autoFocus
                />
                {sheetSearch && (
                  <button onClick={() => setSheetSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#A1A1AA", fontSize: 13, padding: 0, lineHeight: 1 }}>✕</button>
                )}
              </div>
            </div>

            {/* Scrollable list */}
            <div style={{ overflowY: "auto", flex: 1, padding: "0 20px 32px" }}>

              {/* Bookmarks section */}
              {!sq && hasBookmarks && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#A1A1AA", marginBottom: 8 }}>Bookmarked</div>
                  {[...bookmarkedExam, ...bookmarkedClinical].map((t) => {
                    const isExam = bookmarkedExam.includes(t);
                    const isActive = activeTag === t.key && mode === (isExam ? "exams" : "clinical");
                    return (
                      <SheetRow
                        key={t.key}
                        label={t.label}
                        isActive={isActive}
                        isBookmarked
                        onSelect={() => handleTagSelect(t.key, isExam ? "exams" : "clinical")}
                        onBookmark={() => toggleBookmark(t.key)}
                      />
                    );
                  })}
                  <div style={{ height: 1, background: "#E4E4E7", margin: "12px 0 16px" }} />
                </div>
              )}

              {/* Exam Prep */}
              {filteredExamTags.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#A1A1AA", marginBottom: 8 }}>Exam Prep</div>
                  {filteredExamTags.map((t) => (
                    <SheetRow
                      key={t.key}
                      label={t.label}
                      isActive={activeTag === t.key && mode === "exams"}
                      isBookmarked={bookmarkedKeys.has(t.key)}
                      onSelect={() => handleTagSelect(t.key, "exams")}
                      onBookmark={() => toggleBookmark(t.key)}
                    />
                  ))}
                </div>
              )}

              {/* Library (was Clinical) */}
              {filteredClinicalTags.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#A1A1AA", marginBottom: 8 }}>Library</div>
                  {filteredClinicalTags.map((t) => (
                    <SheetRow
                      key={t.key}
                      label={t.label}
                      isActive={activeTag === t.key && mode === "clinical"}
                      isBookmarked={bookmarkedKeys.has(t.key)}
                      onSelect={() => handleTagSelect(t.key, "clinical")}
                      onBookmark={() => toggleBookmark(t.key)}
                    />
                  ))}
                </div>
              )}

              {filteredExamTags.length === 0 && filteredClinicalTags.length === 0 && (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#A1A1AA", fontSize: 14 }}>No results for &quot;{sheetSearch}&quot;</div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── HEADER ── */}
      <header style={{
        padding: "14px 20px",
        maxWidth: 680,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#FFFFFF",
      }}>
        {/* Left: App name + mode dropdown */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 1 }}>
          <span
            className={instrumentSerif.className}
            style={{ fontSize: 21, fontWeight: 400, color: "#18181B", letterSpacing: "-0.02em", lineHeight: 1 }}
          >
            DrKard
          </span>
          <button
            className="dk-mode-btn"
            onClick={() => setModeDropdownOpen(!modeDropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "none",
              borderRadius: 8,
              padding: "5px 8px",
              fontSize: 15,
              fontWeight: 500,
              color: "#71717A",
            }}
          >
            {mode === "exams" ? "Exam Prep" : "Library"}
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ transition: "transform 0.15s", transform: modeDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Mode dropdown */}
          {modeDropdownOpen && (
            <>
              <div
                onClick={() => setModeDropdownOpen(false)}
                style={{ position: "fixed", inset: 0, zIndex: 98 }}
              />
              <div
                className="dk-dropdown"
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  background: "#FFFFFF",
                  border: "1px solid #E4E4E7",
                  borderRadius: 12,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
                  overflow: "hidden",
                  zIndex: 99,
                  minWidth: 168,
                }}
              >
                {([
                  { value: "exams" as const, label: "Exam Prep" },
                  { value: "clinical" as const, label: "Library" },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    className="dk-dropdown-item"
                    onClick={() => handleModeSwitch(opt.value)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "11px 14px",
                      background: mode === opt.value ? "#F4F4F5" : "transparent",
                      border: "none",
                      fontSize: 14,
                      fontWeight: mode === opt.value ? 600 : 400,
                      color: "#18181B",
                    }}
                  >
                    {opt.label}
                    {mode === opt.value && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: user avatar or sign in button */}
        {user ? (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "#18181B",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 600, color: "#FFF", cursor: "pointer", flexShrink: 0,
                border: "none",
              }}
            >
              {userInitials || "U"}
            </button>
            {userMenuOpen && (
              <>
                <div
                  onClick={() => setUserMenuOpen(false)}
                  style={{ position: "fixed", inset: 0, zIndex: 98 }}
                />
                <div
                  className="dk-dropdown"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    background: "#FFFFFF",
                    border: "1px solid #E4E4E7",
                    borderRadius: 12,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
                    overflow: "hidden",
                    zIndex: 99,
                    minWidth: 180,
                  }}
                >
                  <div style={{ padding: "12px 14px", borderBottom: "1px solid #E4E4E7" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#18181B" }}>
                      {user.firstName} {user.lastName}
                    </div>
                    <div style={{ fontSize: 12, color: "#71717A", marginTop: 2 }}>
                      {user.email}
                    </div>
                  </div>
                  <button
                    className="dk-dropdown-item"
                    onClick={() => { setUserMenuOpen(false); handleSignOut(); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "11px 14px",
                      background: "transparent",
                      border: "none",
                      fontSize: 14,
                      fontWeight: 400,
                      color: "#DC2626",
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            style={{
              background: "#18181B",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Sign in
          </button>
        )}
      </header>

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px 120px" }}>
        {/* ── RESOURCE CHIP ── */}
        <div style={{ textAlign: "center", paddingTop: 36, paddingBottom: 28 }}>
          <button
            className="dk-chip-btn"
            onClick={() => setPickerOpen(true)}
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#18181B",
              background: "#F4F4F5",
              border: "1.5px solid #E3E3E6",
              borderRadius: 20,
              padding: "9px 18px 9px 20px",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontFamily: "inherit",
            }}
          >
            {currentTag.label}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: 0.45 }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* ── SECONDARY TABS ── */}
        <div className="dk-tabs">
          <Tabs
            value={activeSecondary}
            onValueChange={(v) => { setActiveSecondary(v); setSearchQuery(""); }}
          >
            <div style={{ display: "flex", justifyContent: "center", borderBottom: "1px solid #E4E4E7" }}>
              <TabsList
                variant="line"
                className="h-auto rounded-none p-0 gap-0 bg-transparent border-b-0 w-auto"
              >
                {secondaryTabs.map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="flex-none rounded-none h-10 px-4 data-[state=active]:shadow-none"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </div>

        {/* ── LIST ── */}
        <div className="dk-a" key={activeTag + activeSecondary + q} style={{ marginTop: 16 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px", color: "#A1A1AA" }}>
              <div style={{ fontSize: 18, marginBottom: 6, fontWeight: 600, color: "#18181B" }}>No results</div>
              <div style={{ fontSize: 13 }}>Try a different search term</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map((item) => (
                <div
                  key={item}
                  className="dk-card-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#F4F4F5",
                    border: "1px solid #E3E3E6",
                    borderRadius: 14,
                    padding: "15px 18px",
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 400, color: "#18181B", lineHeight: 1.45 }}>
                    <Highlight text={item} query={q} />
                  </span>
                  <span style={{ fontSize: 15, color: "#A1A1AA", flexShrink: 0, marginLeft: 12 }}>→</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* ── FLOATING SEARCH ── */}
      <div style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 40px)",
        maxWidth: 640,
        zIndex: 50,
      }}>
        <div style={{
          background: "#FFFFFF",
          borderRadius: 14,
          border: "1.5px solid #E3E3E6",
          boxShadow: "0 4px 28px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
          padding: "11px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="dk-search-input"
            placeholder="Search topics, conditions, drugs…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, border: "none", background: "none", fontSize: 14, color: "#18181B", fontFamily: "inherit" }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ fontSize: 13, color: "#A1A1AA", background: "none", border: "none", cursor: "pointer", padding: "0 2px", lineHeight: 1 }}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sheet row component ──
function SheetRow({
  label, isActive, isBookmarked, onSelect, onBookmark,
}: {
  label: string;
  isActive: boolean;
  isBookmarked: boolean;
  onSelect: () => void;
  onBookmark: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "11px 0",
        borderBottom: "1px solid #F4F4F5",
        gap: 10,
        cursor: "pointer",
      }}
    >
      <div
        onClick={onSelect}
        style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}
      >
        {isActive && (
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#18181B", flexShrink: 0 }} />
        )}
        <span style={{ fontSize: 15, fontWeight: isActive ? 700 : 500, color: isActive ? "#18181B" : "#3F3F46", lineHeight: 1.4 }}>
          {label}
        </span>
      </div>
      <button
        className="dk-bm-btn"
        onClick={(e) => { e.stopPropagation(); onBookmark(); }}
        style={{ fontSize: 18, color: isBookmarked ? "#F59E0B" : "#D4D4D8", flexShrink: 0 }}
        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
      >
        {isBookmarked ? "★" : "☆"}
      </button>
    </div>
  );
}
