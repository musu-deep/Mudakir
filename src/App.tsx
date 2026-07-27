/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Header } from "./components/Header";
import { SmartMisbaha } from "./components/SmartMisbaha";
import { GhirasGarden } from "./components/GhirasGarden";
import { AdhkarLibrary } from "./components/AdhkarLibrary";
import { AITadabburModal } from "./components/AITadabburModal";
import { CardPosterGenerator } from "./components/CardPosterGenerator";
import { CustomDhikrModal } from "./components/CustomDhikrModal";
import { DhikrItem, UserProgress, AudioSettings } from "./types";
import { INITIAL_ADHKAR } from "./data/adhkar";
import {
  loadUserProgress,
  loadAudioSettings,
  loadCustomAdhkar,
  toggleFavorite
} from "./utils/storage";

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress());
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(loadAudioSettings());
  const [activeTab, setActiveTab] = useState<string>("misbaha");

  // Load Athkar dataset (Initial + Custom)
  const [allAdhkar, setAllAdhkar] = useState<DhikrItem[]>(() => {
    const customList = loadCustomAdhkar().map((c) => ({
      id: c.id,
      text: c.text,
      category: "custom" as const,
      defaultTarget: c.target,
      virtue: c.virtue,
      rewardDescription: "ذِكْرٌ خاصٌ مضافٌ بحسابك",
    }));
    return [...INITIAL_ADHKAR, ...customList];
  });

  const [selectedDhikr, setSelectedDhikr] = useState<DhikrItem>(allAdhkar[0]);

  // Modal States
  const [tadabburText, setTadabburText] = useState<string | null>(null);
  const [cardDhikrItem, setCardDhikrItem] = useState<DhikrItem | null>(null);
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);

  // Sync favorites or progress changes
  const handleToggleFavorite = (dhikrId: string) => {
    const updatedProgress = toggleFavorite(dhikrId);
    setProgress(updatedProgress);
  };

  const handleCustomDhikrAdded = (newItem: DhikrItem) => {
    setAllAdhkar((prev) => [newItem, ...prev]);
    setSelectedDhikr(newItem);
    setActiveTab("misbaha");
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-[#2D3436] font-sans selection:bg-[#2D5A27]/20 selection:text-[#2D5A27] flex flex-col dir-rtl text-right">
      
      {/* Top Navigation & Stats Header */}
      <Header
        progress={progress}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        audioSettings={audioSettings}
        setAudioSettings={setAudioSettings}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Tab 1: Smart Misbaha Counter */}
        {activeTab === "misbaha" && (
          <SmartMisbaha
            allAdhkar={allAdhkar}
            selectedDhikr={selectedDhikr}
            setSelectedDhikr={setSelectedDhikr}
            audioSettings={audioSettings}
            onUpdateProgress={setProgress}
            onOpenTadabbur={(text) => setTadabburText(text)}
            onOpenCardGenerator={(item) => setCardDhikrItem(item)}
          />
        )}

        {/* Tab 2: Ghiras Jannah Garden & Stats */}
        {activeTab === "garden" && (
          <GhirasGarden
            progress={progress}
            onOpenCardGenerator={() => setCardDhikrItem(selectedDhikr)}
          />
        )}

        {/* Tab 3: Adhkar Library & Search */}
        {activeTab === "library" && (
          <AdhkarLibrary
            allAdhkar={allAdhkar}
            customAdhkar={[]}
            favorites={progress.favorites}
            onSelectDhikrForMisbaha={(item) => {
              setSelectedDhikr(item);
              setActiveTab("misbaha");
            }}
            onOpenTadabbur={(text) => setTadabburText(text)}
            onOpenCardGenerator={(item) => setCardDhikrItem(item)}
            onOpenAddCustomModal={() => setShowAddCustomModal(true)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* Tab 4: AI Dhikr Tadabbur Guide */}
        {activeTab === "ai_guide" && (
          <AITadabburModal
            initialText={selectedDhikr.text}
            isEmbeddedView={true}
          />
        )}

        {/* Tab 5: Dhikr Poster & Card Generator */}
        {activeTab === "posters" && (
          <CardPosterGenerator
            dhikrItem={selectedDhikr}
            isEmbeddedView={true}
          />
        )}

      </main>

      {/* Modals */}

      {/* AI Tadabbur Popup */}
      {tadabburText && (
        <AITadabburModal
          initialText={tadabburText}
          onClose={() => setTadabburText(null)}
        />
      )}

      {/* Card Poster Popup */}
      {cardDhikrItem && (
        <CardPosterGenerator
          dhikrItem={cardDhikrItem}
          onClose={() => setCardDhikrItem(null)}
        />
      )}

      {/* Add Custom Dhikr Popup */}
      {showAddCustomModal && (
        <CustomDhikrModal
          onClose={() => setShowAddCustomModal(false)}
          onDhikrAdded={handleCustomDhikrAdded}
        />
      )}

      {/* Footer Footer */}
      <footer className="bg-[#F9F7F2] border-t border-[#EAE3D5] py-6 text-center text-xs text-[#2D5A27]/70">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-serif font-bold text-[#2D5A27] text-sm">
            غِرَاسُ الجَنَّةِ • تمكين الذاكرين وتيسير أذكار اليوم والليلة
          </p>
          <p className="opacity-80">«وَالذَّاكِرِينَ اللَّهَ كَثِيرًا وَالذَّاكِرَاتِ أَعَدَّ اللَّهُ لَهُم مَّغْفِرَةً وَأَجْرًا عَظِيمًا»</p>
        </div>
      </footer>

    </div>
  );
}
