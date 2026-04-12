import { useState, useEffect } from "react";

const DUE_DATE = new Date("2026-03-01T18:00:00Z");

function getTimeRemaining(now) {
  const diff = DUE_DATE - now;
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60_000);
  const hrs = Math.round(abs / 3_600_000);
  const days = Math.round(abs / 86_400_000);

  if (diff < 0) {
    if (mins < 60) return `Overdue by ${mins} minute${mins !== 1 ? "s" : ""}`;
    if (hrs < 24) return `Overdue by ${hrs} hour${hrs !== 1 ? "s" : ""}`;
    return `Overdue by ${days} day${days !== 1 ? "s" : ""}`;
  }
  if (mins < 5) return "Due now!";
  if (hrs < 2) return `Due in ${mins} minute${mins !== 1 ? "s" : ""}`;
  if (hrs < 24) return `Due in ${hrs} hour${hrs !== 1 ? "s" : ""}`;
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} day${days !== 1 ? "s" : ""}`;
}

function getTimeClass(now) {
  const diff = DUE_DATE - now;
  if (diff < 0) return "time-overdue";
  if (diff < 7_200_000) return "time-soon";
  return "time-ok";
}

const PRIORITY_CLASS = {
  Low: "priority-low",
  Medium: "priority-medium",
  High: "priority-high",
};

export default function TodoCard({
  title = "Redesign the onboarding flow for mobile users",
  description = "Update wireframes, review Q1 user feedback, and coordinate with the design team to finalize the new layout.",
  priority = "High",
  tags = ["UX Design", "Mobile", "Onboarding"],
}) {
  const [done, setDone] = useState(false);
  const [timeLabel, setTimeLabel] = useState(() => getTimeRemaining(new Date()));
  const [timeClass, setTimeClass] = useState(() => getTimeClass(new Date()));

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimeLabel(getTimeRemaining(now));
      setTimeClass(getTimeClass(now));
    };
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <article
      data-testid="test-todo-card"
      className="todo-card"
      aria-label="Todo task card"
    >
      {/* Header */}
      <div className="todo-card-header">
        <div className="todo-checkbox-wrap">
          <input
            type="checkbox"
            id="todo-complete-toggle"
            data-testid="test-todo-complete-toggle"
            checked={done}
            onChange={(e) => setDone(e.target.checked)}
            aria-label="Mark task as complete"
            className="todo-checkbox"
          />
        </div>
        <div className="todo-header-content">
          <h2
            data-testid="test-todo-title"
            className={`todo-title${done ? " is-done" : ""}`}
          >
            {title}
          </h2>
          <p data-testid="test-todo-description" className="todo-description">
            {description}
          </p>
        </div>
      </div>

      {/* Meta */}
      <div className="todo-meta-row">
        <span
          data-testid="test-todo-priority"
          className={`todo-badge ${PRIORITY_CLASS[priority] ?? "priority-low"}`}
          aria-label={`Priority: ${priority}`}
        >
          {priority} priority
        </span>
        <span
          data-testid="test-todo-status"
          className={`todo-badge ${done ? "status-done" : "status-pending"}`}
          aria-live="polite"
        >
          {done ? "Done" : "Pending"}
        </span>
      </div>

      <hr className="todo-divider" />

      {/* Dates */}
      <div className="todo-dates-row">
        <div className="todo-date-line">
          <span className="todo-date-label">Due date</span>
          <time data-testid="test-todo-due-date" dateTime={DUE_DATE.toISOString()}>
            July 25, 2026 at 6:00 PM UTC
          </time>
        </div>
        <div className="todo-date-line">
          <span className="todo-date-label">Time left</span>
          <span
            data-testid="test-todo-time-remaining"
            className={`todo-time-remaining ${timeClass}`}
            aria-live="polite"
          >
            {timeLabel}
          </span>
        </div>
      </div>

      <hr className="todo-divider" />

      {/* Tags */}
      <ul data-testid="test-todo-tags" className="todo-tags-row" aria-label="Tags">
        {tags.map((tag) => (
          <li key={tag} data-testid="test-todo-tag" className="todo-tag">
            {tag}
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="todo-actions-row">
        <button
          data-testid="test-todo-edit-button"
          className="todo-btn todo-btn-edit"
          onClick={() => console.log("edit clicked")}
          aria-label="Edit task"
        >
          Edit
        </button>
        <button
          data-testid="test-todo-delete-button"
          className="todo-btn todo-btn-delete"
          onClick={() => alert("Delete clicked")}
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </article>
  );
}