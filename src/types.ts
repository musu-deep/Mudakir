export type DhikrCategory =
  | "ghiras"       // غراس الجنة والذكر المضاعف
  | "morning"      // أذكار الصباح
  | "evening"      // أذكار المساء
  | "post_prayer"  // أذكار الصلاة
  | "sleep"        // أذكار النوم
  | "jawami"       // أدعية جوامع الكلم
  | "custom";      // أذكاري الخاصة

export interface DhikrItem {
  id: string;
  text: string;
  category: DhikrCategory;
  defaultTarget: number;
  virtue?: string;         // الفضل والحديث
  reference?: string;      // المصدر والحديث
  meaning?: string;        // الشرح المختصر
  rewardDescription?: string; // وصف الجزاء الأخروي (مثل: غُرست له نخلة في الجنة)
  isFavorite?: boolean;
}

export interface UserProgress {
  totalCount: number;
  todayCount: number;
  lastActiveDate: string;  // YYYY-MM-DD
  dailyStreak: number;
  treesPlanted: number;
  categoryCounts: Record<DhikrCategory, number>;
  dhikrCounts: Record<string, number>; // dhikrId -> total count
  favorites: string[];     // array of dhikrIds
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  requiredCount: number;
  currentCount: number;
}

export interface CustomDhikr {
  id: string;
  text: string;
  target: number;
  categoryName?: string;
  virtue?: string;
}

export interface AudioSettings {
  soundEnabled: boolean;
  volume: number; // 0 to 1
  soundType: "bead" | "soft_click" | "tone" | "silent";
  hapticEnabled: boolean;
}
