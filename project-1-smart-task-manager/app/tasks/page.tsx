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
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Tasks</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <section style={{ marginTop: 24 }}>
        <h2>Create Task</h2>
        <form onSubmit={handleCreate} style={{ display: "grid", gap: 12 }}>
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: "100%", padding: 8 }}
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", padding: 8, minHeight: 80 }}
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Manage Task by ID</h2>

        <label style={{ display: "block", marginBottom: 8 }}>
          Task ID
          <input
            type="text"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            placeholder="Paste a task _id here"
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
          <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd" }}>
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
                style={{ width: "100%", padding: 8 }}
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
                style={{ width: "100%", padding: 8, minHeight: 80 }}
              />
            </label>

            <label style={{ display: "block", marginTop: 8 }}>
              Status
              <select
                value={status || "todo"}
                onChange={(e) =>
                  setStatus(e.target.value as Task["status"])
                }
                style={{ width: "100%", padding: 8 }}
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
        <p style={{ color: "crimson", marginTop: 16 }}>Error: {error}</p>
      )}
      {message && (
        <p style={{ color: "green", marginTop: 16 }}>{message}</p>
      )}
    </main>
  );
}
