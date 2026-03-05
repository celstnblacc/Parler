// Mock the Tauri IPC bridge — not available in jsdom/happy-dom.
// Each test file vi.mock('@/bindings') to control command return values.
vi.mock("@/bindings", () => ({
  commands: {
    fetchPostProcessModels: vi.fn(),
    getAvailableMicrophones: vi.fn(),
    getAvailableOutputDevices: vi.fn(),
  },
}));
