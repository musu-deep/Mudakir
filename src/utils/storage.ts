import { UserProgress, CustomDhikr, AudioSettings, DhikrCategory } from "../types";

const PROGRESS_KEY = "ghiras_user_progress_v1";
const CUSTOM_ADHKAR_KEY = "ghiras_custom_adhkar_v1";
const AUDIO_SETTINGS_KEY = "ghiras_audio_settings_v1";

export const DEFAULT_USER_PROGRESS: UserProgress = {
  totalCount: 0,
  todayCount: 0,
  lastActiveDate: new Date().toISOString().split("T")[0],
  dailyStreak: 0,
  treesPlanted: 0,
  categoryCounts: {
    ghiras: 0,
    morning: 0,
    evening: 0,
    post_prayer: 0,
    sleep: 0,
    jawami: 0,
    custom: 0,
  },
  dhikrCounts: {},
  favorites: [
    "ghiras-subhanallah-doubled",
    "ghiras-juwayriya",
    "ghiras-palm-tree",
    "morning-sayyid-alistighfar",
  ],
};

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  soundEnabled: true,
  volume: 0.8,
  soundType: "bead",
  hapticEnabled: true,
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return DEFAULT_USER_PROGRESS;
    const progress: UserProgress = JSON.parse(raw);

    // Calculate streak and today count reset if date changed
    const todayStr = new Date().toISOString().split("T")[0];
    if (progress.lastActiveDate !== todayStr) {
      const lastDate = new Date(progress.lastActiveDate);
      const currentDate = new Date(todayStr);
      const diffDays = Math.round(
        (currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24)
      );

      if (diffDays === 1) {
        // Consecutive day - maintain streak!
      } else if (diffDays > 1) {
        // Streak broken
        progress.dailyStreak = 0;
      }
      progress.todayCount = 0;
      progress.lastActiveDate = todayStr;
      saveUserProgress(progress);
    }

    return progress;
  } catch (e) {
    console.error("Error loading progress:", e);
    return DEFAULT_USER_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Error saving progress:", e);
  }
}

export function recordTasbeehCount(dhikrId: string, category: DhikrCategory, increment = 1): { progress: UserProgress; newlyPlantedTree: boolean } {
  const progress = loadUserProgress();
  const todayStr = new Date().toISOString().split("T")[0];

  // Check streak update
  if (progress.lastActiveDate !== todayStr) {
    progress.todayCount = 0;
    progress.lastActiveDate = todayStr;
  }

  if (progress.dailyStreak === 0 || progress.todayCount === 0) {
    progress.dailyStreak += 1;
  }

  const previousTotal = progress.totalCount;
  progress.totalCount += increment;
  progress.todayCount += increment;

  // Category tally
  progress.categoryCounts[category] = (progress.categoryCounts[category] || 0) + increment;

  // Specific dhikr tally
  progress.dhikrCounts[dhikrId] = (progress.dhikrCounts[dhikrId] || 0) + increment;

  // Every 100 tasbeehat or doubled dhikr count plants 1 Jannah tree!
  const previousTrees = Math.floor(previousTotal / 100);
  const currentTrees = Math.floor(progress.totalCount / 100);
  const newlyPlantedTree = currentTrees > previousTrees;
  progress.treesPlanted = currentTrees;

  saveUserProgress(progress);
  return { progress, newlyPlantedTree };
}

export function toggleFavorite(dhikrId: string): UserProgress {
  const progress = loadUserProgress();
  const index = progress.favorites.indexOf(dhikrId);
  if (index >= 0) {
    progress.favorites.splice(index, 1);
  } else {
    progress.favorites.push(dhikrId);
  }
  saveUserProgress(progress);
  return progress;
}

export function loadCustomAdhkar(): CustomDhikr[] {
  try {
    const raw = localStorage.getItem(CUSTOM_ADHKAR_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomDhikr(dhikr: CustomDhikr): CustomDhikr[] {
  const list = loadCustomAdhkar();
  list.unshift(dhikr);
  localStorage.setItem(CUSTOM_ADHKAR_KEY, JSON.stringify(list));
  return list;
}

export function deleteCustomDhikr(id: string): CustomDhikr[] {
  const list = loadCustomAdhkar().filter((d) => d.id !== id);
  localStorage.setItem(CUSTOM_ADHKAR_KEY, JSON.stringify(list));
  return list;
}

export function loadAudioSettings(): AudioSettings {
  try {
    const raw = localStorage.getItem(AUDIO_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_AUDIO_SETTINGS;
  } catch {
    return DEFAULT_AUDIO_SETTINGS;
  }
}

export function saveAudioSettings(settings: AudioSettings): void {
  localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(settings));
}
