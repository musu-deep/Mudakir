export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type InstallPromptListener = (event: BeforeInstallPromptEvent | null) => void;

let capturedPrompt: BeforeInstallPromptEvent | null = null;
let captureStarted = false;
const listeners = new Set<InstallPromptListener>();

function notifyListeners() {
  listeners.forEach((listener) => listener(capturedPrompt));
}

export function capturePwaInstallPrompt() {
  if (captureStarted || typeof window === "undefined") return;
  captureStarted = true;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    capturedPrompt = event as BeforeInstallPromptEvent;
    notifyListeners();
  });

  window.addEventListener("appinstalled", () => {
    capturedPrompt = null;
    notifyListeners();
  });
}

export function getCapturedPwaInstallPrompt() {
  return capturedPrompt;
}

export function subscribeToPwaInstallPrompt(listener: InstallPromptListener) {
  listeners.add(listener);
  listener(capturedPrompt);
  return () => {
    listeners.delete(listener);
  };
}

export async function showNativePwaInstallPrompt() {
  const prompt = capturedPrompt;
  if (!prompt) return "unavailable" as const;

  await prompt.prompt();
  const { outcome } = await prompt.userChoice;
  capturedPrompt = null;
  notifyListeners();
  return outcome;
}

export function isPwaRunningStandalone() {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const iosNavigator = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || iosNavigator.standalone === true;
}
