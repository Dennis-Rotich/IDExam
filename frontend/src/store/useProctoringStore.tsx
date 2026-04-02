import { create } from 'zustand';
// import { io, Socket } from 'socket.io-client'; // Install socket.io-client later

interface ProctoringState {
  activeSessions: any[];
  isConnected: boolean;
  // socket: Socket | null;
  connectToExamStream: (examId: string) => void;
  disconnectStream: () => void;
  sendMessageToStudent: (sessionId: string, message: string) => void;
}

export const useProctoringStore = create<ProctoringState>((set) => ({
  activeSessions: [],
  isConnected: false,
  // socket: null,

  connectToExamStream: () => {
    // TODO: Wire this up when the Express backend is ready
    /*
    const newSocket = io('http://localhost:5000/proctoring', {
      query: { examId, instructorId: 'user_123' }
    });

    newSocket.on('connect', () => set({ isConnected: true, socket: newSocket }));
    
    newSocket.on('session_update', (data) => {
      // Your colleague's Express server pushes updates here
      set({ activeSessions: data.sessions });
    });
    */
  },

  disconnectStream: () => {
    // const { socket } = get();
    // if (socket) socket.disconnect();
    set({ isConnected: false });
  },

  sendMessageToStudent: (sessionId, message) => {
    // const { socket } = get();
    // socket?.emit('instructor_message', { sessionId, message });
    console.log(`Sending "${message}" to ${sessionId}`);
  }
}));