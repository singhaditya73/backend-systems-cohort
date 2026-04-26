"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Task = {
  _id: string;
  title: string;
  description?: string;
  status?: "todo" | "in-progress" | "done";
};

export default function TasksPage() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [taskId, setTaskId] = useState("");
  const [task, setTask] = useState<Task | null>(null);

  const [status, setStatus] = useState<Task["status"]>("todo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) {
      router.push("/login");
      return;
    }
    setToken(stored);
  }, [router]);

  function resetMessages() {
    setError(null);
    setMessage(null);
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    resetMessages();
    setLoading(true);

    try {
      const res = await fetch("/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to create task");
        return;
      }

      setMessage("Task created");
      setTask(data.task);
      setTaskId(data.task?._id || "");
      setTitle("");
      setDescription("");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleFetchById() {
    if (!token || !taskId) return;
    resetMessages();
    setLoading(true);

    try {
      const res = await fetch(`/api/task/${taskId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to fetch task");
        return;
      }

      setTask(data.task);
      setMessage("Task fetched");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (!token || !taskId) return;
    resetMessages();
    setLoading(true);

    try {
      const res = await fetch(`/api/task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: task?.title,
          description: task?.description,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to update task");
        return;
      }

      setTask(data.task);
      setMessage("Task updated");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!token || !taskId) return;
    resetMessages();
    setLoading(true);

    try {
      const res = await fetch(`/api/task/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to delete task");
        return;
      }

      setMessage("Task deleted");
      setTask(null);
      setTaskId("");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
      <div className="mx-auto w-full max-w-3xl">
        <header className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 px-6 py-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <h1>Tasks</h1>
          <button onClick={handleLogout}>Logout</button>
        </header>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <h2>Create Task</h2>
          <form onSubmit={handleCreate} className="mt-4 grid gap-4">
            <label>
              Title
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950"
              />
            </label>

            <label>
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </form>
        </section>

        <section className="mt-10 rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <h2>Manage Task by ID</h2>

          <label style={{ display: "block", marginBottom: 8 }}>
            Task ID
            <input
              type="text"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              placeholder="Paste a task _id here"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>

          <div className="mt-2 flex flex-wrap gap-3">
            <button onClick={handleFetchById} disabled={loading || !taskId}>
              Fetch
            </button>
            <button onClick={handleUpdate} disabled={loading || !taskId}>
              Update
            </button>
            <button onClick={handleDelete} disabled={loading || !taskId}>
              Delete
            </button>
          </div>

          {task && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h3>Current Task</h3>
              <p>
                <strong>ID:</strong> {task._id}
              </p>
              <label>
                Title
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) =>
                    setTask((prev) =>
                      prev ? { ...prev, title: e.target.value } : prev,
                    )
                  }
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>

              <label style={{ display: "block", marginTop: 8 }}>
                Description
                <textarea
                  value={task.description || ""}
                  onChange={(e) =>
                    setTask((prev) =>
                      prev ? { ...prev, description: e.target.value } : prev,
                    )
                  }
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950"
                />
              </label>

              <label style={{ display: "block", marginTop: 8 }}>
                Status
                <select
                  value={status || "todo"}
                  onChange={(e) => setStatus(e.target.value as Task["status"])}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="todo">todo</option>
                  <option value="in-progress">in-progress</option>
                  <option value="done">done</option>
                </select>
              </label>
            </div>
          )}
        </section>

        {error && (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            Error: {error}
          </p>
        )}
        {message && (
          <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
