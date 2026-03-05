import "@testing-library/jest-dom";

// Mock the Tauri IPC bridge — not available in jsdom/happy-dom.
// Each test file may call vi.mocked(commands.*).mockResolvedValue() to control return values.
vi.mock("@/bindings", () => ({
  commands: {
    fetchPostProcessModels: vi.fn(),
    getAvailableMicrophones: vi.fn(),
    getAvailableOutputDevices: vi.fn(),
  },
}));

// react-i18next: return the key as-is so tests assert on stable i18n keys,
// not on translated strings that change when copy changes.
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: "en" } }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}));
