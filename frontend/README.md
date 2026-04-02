# tAhIni | IDExam Engine (Frontend)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Zustand](https://img.shields.io/badge/Zustand-State_Management-764ABC?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-B33030?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**tAhIni** is a next-generation "Exam Operating System" designed to replace static LMS forms with a robust, IDE-grade assessment environment.

This repository houses the **IDExam Engine**—the frontend interface that provides students with a VS Code-like experience, real-time cloud synchronization, and "Black Box" execution feedback.

## Key Features

* **IDE-Grade Editor:** Fully integrated **Monaco Editor** (VS Code core) with syntax highlighting, line numbers, and minimap support.
* **The Sync Engine:** A custom "Invisible Hand" hook (`useAutoSave`) that debounces user keystrokes (1000ms) to prevent API flooding while ensuring zero data loss.
* **Resizable Architecture:** Built with `react-resizable-panels`, allowing users to customize their workspace (Question vs. Editor vs. Console) just like a real IDE.
* **"Alive" Loading States:** Replaces boring spinners with **Shimmer/Pulse Skeletons**, maintaining layout stability during data hydration.
* **Student Console:** A dedicated "Black Box" terminal that sanitizes execution output—showing pass/fail status without revealing hidden test cases.
* **Performance First:** State management via **Zustand** with strict selector subscriptions to prevent unnecessary re-renders.

---

## Architecture

The application follows a strict **unidirectional data flow** to ensure stability during high-stress exams.

### 1. The Brain: `useExamStore` (Zustand)
The single source of truth. It manages:
* **Question Indexing:** Tracks the active question via array index (not object reference) to prevent desync.
* **Code State:** Uses immutable array updates to track student code per question.
* **Save Status:** Tracks `idle | saving | saved | error` states for UI feedback.

### 2. The Nervous System: `useAutoSave` Hook
This hook sits between the Store and the API.
1.  **Listens** for changes in the `code` string.
2.  **Debounces** the input (waits for the user to stop typing for 1s).
3.  **Executes** the API call.
4.  **Updates** the `saveStatus` in the store, which triggers the UI indicator.

### 3. The Skeleton: `LoadingExam`
To prevent layout shifts (CLS), the app calculates the exact geometry of the IDE panels before data arrives, rendering a "Ghost UI" with shimmer effects until the backend responds.

---

## 📂 Project Structure

```bash
src/
├── components/
│   ├── Editor/           # Monaco Wrapper & Terminal Logic
│   │   ├── MonacoInstance.tsx
│   │   └── Terminal.tsx
│   ├── Layout/           # Shared UI Shell
│   │   ├── AutoSaveIndicator.tsx  # <--- The Sync UI
│   │   └── Navbar.tsx
│   ├── Student/          # Student-Specific Views
│   │   └── StudentConsole.tsx     # The "Black Box" output
│   └── ui/               # Shadcn/Radix Primitives
├── data/    
│   ├── dummyData.ts             # Mock Data & Seeds
│   └── questions.ts 
├── hooks/                # Custom Logic
│   └── useAutoSave.ts    # <--- The Sync Engine Logic
│   ├── useExamTimer.ts
│   ├── useTestRunner.tsx
├── lib/
│   ├── utils.ts
├── pages/
│   ├── Instructor/          # instructor pages
│   ├── Loading/             # skeleton screens
│   ├── Student/             # student pages
│   └── Landing.tsx          # landing page
├── store/
│   └── useExamStore.tsx  # Global State (Zustand)
└── types/                # Shared Interfaces
│   └── examSession.tsx
```


### Getting Started
#### Prerequisites
  Node.js 18+
  npm or pnpm

#### Installation
#### 1. Clone the repository
```bash
git clone [https://github.com/yourusername/tahini-frontend.git](https://github.com/yourusername/tahini-frontend.git)
cd tahini-frontend
```

#### 2. Install dependencies
```bash
npm install
# or
pnpm install
```

#### 3. Run the development server
```bash
    npm run dev
```

#### 4. Open locally
  Navigate to http://localhost:5173.

### Configuration
#### Customizing the Sync Engine
You can adjust the debounce timer in ``src/hooks/useAutoSave.ts``:
```typescript
// Change the delay (in ms)
const debouncedSave = useCallback(
  debounce((code, id) => saveToBackend(code, id), 1500), // currently 1.5s
  []
);
```

#### Mock Data Mode
Currently, ExamPage.tsx simulates an API fetch. To connect to a real backend, uncomment the fetch logic in the useEffect hook and remove the setTimeout simulation.


### Future Roadmap
  [ ] WebSocket Integration: Replace polling with Socket.io for real-time instructor proctoring.

  [ ] Diff View: Add a "Diff Editor" mode to show students exactly where their output diverged from the expected result.

  [ ] Multi-Language Support: Extend Monaco configuration for Python, C++, and Go.

  [ ] Offline Mode: Implement localStorage fallback if the internet connection drops completely.


## 🤝 Contributing

  1. Fork the Project
  2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
  3. Commit your Changes (git commit -m 'feat(scope): Add some AmazingFeature')
  4. Push to the Branch (git push origin feature/AmazingFeature)
  5. Open a Pull Request

### Built by Isaiah Juma

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.