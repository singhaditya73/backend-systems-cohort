import { create } from "zustand";

export type Task = {
  _id: string;
  title: string;
  description?: string;
  status?: "todo" | "in-progress" | "done";
  userId?: string;
};

type TaskState = {
  token: string | null;
  tasks: Task[];
  selectedTask: Task | null;
  setToken: (token: string | null) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  setSelectedTask: (task: Task | null) => void;
  updateTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  clearAll: () => void;
};

export const useTaskStore = create<TaskState>((set) => ({
  token: null,
  tasks: [],
  selectedTask: null,

  setToken: (token) => set({ token }),
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  setSelectedTask: (task) => set({ selectedTask: task }),
  updateTask: (task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === task._id ? task : t)),
      selectedTask:
        state.selectedTask?._id === task._id ? task : state.selectedTask,
    })),
  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== taskId),
      selectedTask:
        state.selectedTask?._id === taskId ? null : state.selectedTask,
    })),
  clearAll: () => set({ token: null, tasks: [], selectedTask: null }),
}));
