import { useState, useEffect, useRef } from "react";

const COLLAPSE_THRESHOLD = 120;

const DUE_DATE_DEFAULT = new Date("2026-03-01T18:00:00Z");

function formatDueDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  }) + " at " + date.toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", timeZone: "UTC", timeZoneName: "short",
  });
}

function getTimeRemaining(now, dueDate) {
  const diff = dueDate - now;
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
  if (mins < 60) return `Due in ${mins} minute${mins !== 1 ? "s" : ""}`;
  if (hrs < 24) return `Due in ${hrs} hour${hrs !== 1 ? "s" : ""}`;
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} day${days !== 1 ? "s" : ""}`;
}

function isOverdue(now, dueDate) {
  return dueDate - now < 0;
}

const PRIORITY_CLASS = {
  Low: "priority-low",
  Medium: "priority-medium",
  High: "priority-high",
};

export default function TodoCard({
  title: initialTitle = "Redesign the onboarding flow for mobile users",
  description: initialDescription = "Update wireframes, review Q1 user feedback, and coordinate with the design team to finalize the new layout. This involves multiple stakeholders and requires sign-off from the product team before implementation can begin.",
  priority: initialPriority = "High",
  tags: initialTags = ["UX Design", "Mobile", "Onboarding"],
}) {
  // ── Core state ───────────────────────────────────────────
  const [title, setTitle]             = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [priority, setPriority]       = useState(initialPriority);
  const [tags]                        = useState(initialTags);
  const [dueDate, setDueDate]         = useState(DUE_DATE_DEFAULT);
  const [status, setStatus]           = useState("Pending");

  // ── UI state ─────────────────────────────────────────────
  const [isEditing, setIsEditing]     = useState(false);
  const [expanded, setExpanded]       = useState(false);
  const [timeLabel, setTimeLabel]     = useState(() => getTimeRemaining(new Date(), DUE_DATE_DEFAULT));
  const [overdue, setOverdue]         = useState(() => isOverdue(new Date(), DUE_DATE_DEFAULT));

  // ── Edit form draft state ────────────────────────────────
  const [draftTitle, setDraftTitle]           = useState(title);
  const [draftDescription, setDraftDescription] = useState(description);
  const [draftPriority, setDraftPriority]     = useState(priority);
  const [draftDueDate, setDraftDueDate]       = useState(
    DUE_DATE_DEFAULT.toISOString().slice(0, 16)
  );

  // ── Refs ─────────────────────────────────────────────────
  const editButtonRef = useRef(null);
  const firstInputRef = useRef(null);

  const done       = status === "Done";
  const inProgress = status === "In Progress";
  const shouldCollapse = description.length > COLLAPSE_THRESHOLD;

  // ── Time ticker ──────────────────────────────────────────
  useEffect(() => {
    if (done) return;
    const tick = () => {
      const now = new Date();
      setTimeLabel(getTimeRemaining(now, dueDate));
      setOverdue(isOverdue(now, dueDate));
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [done, dueDate]);

  // ── Focus first input when edit opens ───────────────────
  useEffect(() => {
    if (isEditing && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isEditing]);

  // ── Checkbox ↔ status sync ───────────────────────────────
  const handleCheckbox = (e) => {
    setStatus(e.target.checked ? "Done" : "Pending");
  };

  const handleStatusControl = (e) => {
    setStatus(e.target.value);
  };

  // ── Edit handlers ────────────────────────────────────────
  const openEdit = () => {
    setDraftTitle(title);
    setDraftDescription(description);
    setDraftPriority(priority);
    setDraftDueDate(dueDate.toISOString().slice(0, 16));
    setIsEditing(true);
  };

  const handleSave = () => {
    setTitle(draftTitle.trim() || title);
    setDescription(draftDescription.trim() || description);
    setPriority(draftPriority);
    setDueDate(new Date(draftDueDate));
    setIsEditing(false);
    setTimeout(() => editButtonRef.current?.focus(), 0);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTimeout(() => editButtonRef.current?.focus(), 0);
  };

  const handleDelete = () => alert("Delete clicked");

  // ── Displayed description ────────────────────────────────
  const displayedDescription =
    shouldCollapse && !expanded
      ? description.slice(0, COLLAPSE_THRESHOLD) + "…"
      : description;

  return (
    <article
      data-testid="test-todo-card"
      className={[
        "todo-card",
        PRIORITY_CLASS[priority],
        done ? "state-done" : "",
        inProgress ? "state-in-progress" : "",
        overdue && !done ? "state-overdue" : "",
      ].filter(Boolean).join(" ")}
      aria-label="Todo task card"
    >
      {/* ── Priority indicator ── */}
      <div
        data-testid="test-todo-priority-indicator"
        className={`todo-priority-indicator ${PRIORITY_CLASS[priority]}`}
        aria-label={`Priority: ${priority}`}
      />

      {/* ── Header ── */}
      <div className="todo-card-header">
        <div className="todo-checkbox-wrap">
          <input
            type="checkbox"
            id="todo-complete-toggle"
            data-testid="test-todo-complete-toggle"
            checked={done}
            onChange={handleCheckbox}
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
        </div>
      </div>

      {/* ── Meta ── */}
      <div className="todo-meta-row">
        <span
          data-testid="test-todo-priority"
          className={`todo-badge ${PRIORITY_CLASS[priority]}`}
          aria-label={`Priority: ${priority}`}
        >
          {priority} priority
        </span>
        <span
          data-testid="test-todo-status"
          className={`todo-badge status-${status.toLowerCase().replace(" ", "-")}`}
          aria-live="polite"
        >
          {status}
        </span>
      </div>

      {/* ── Status control ── */}
      <div className="todo-status-control-row">
        <label htmlFor="todo-status-control" className="todo-date-label">
          Status
        </label>
        <select
          id="todo-status-control"
          data-testid="test-todo-status-control"
          className="todo-status-select"
          value={status}
          onChange={handleStatusControl}
          aria-label="Change task status"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <hr className="todo-divider" />

      {/* ── Collapsible description ── */}
      <div>
        <p
          data-testid="test-todo-description"
          className="todo-description"
        >
          {displayedDescription}
        </p>
        {shouldCollapse && (
          <button
            data-testid="test-todo-expand-toggle"
            className="todo-expand-btn"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            aria-controls="todo-collapsible-section"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
        <div
          id="todo-collapsible-section"
          data-testid="test-todo-collapsible-section"
          hidden={shouldCollapse && !expanded}
        />
      </div>

      <hr className="todo-divider" />

      {/* ── Dates ── */}
      <div className="todo-dates-row">
        <div className="todo-date-line">
          <span className="todo-date-label">Due date</span>
          <time data-testid="test-todo-due-date" dateTime={dueDate.toISOString()}>
            {formatDueDate(dueDate)}
          </time>
        </div>
        <div className="todo-date-line">
          <span className="todo-date-label">Time left</span>
          {done ? (
            <span
              data-testid="test-todo-time-remaining"
              className="todo-time-remaining time-ok"
              aria-live="polite"
            >
              Completed
            </span>
          ) : (
            <span
              data-testid="test-todo-time-remaining"
              className={`todo-time-remaining ${overdue ? "time-overdue" : "time-ok"}`}
              aria-live="polite"
            >
              {timeLabel}
            </span>
          )}
        </div>
      </div>

      {/* ── Overdue indicator ── */}
      {overdue && !done && (
        <div
          data-testid="test-todo-overdue-indicator"
          className="todo-overdue-indicator"
          role="alert"
          aria-live="polite"
        >
          ⚠ This task is overdue
        </div>
      )}

      <hr className="todo-divider" />

      {/* ── Tags ── */}
      <ul data-testid="test-todo-tags" className="todo-tags-row" aria-label="Tags">
        {tags.map((tag) => (
          <li key={tag} data-testid="test-todo-tag" className="todo-tag">
            {tag}
          </li>
        ))}
      </ul>

      {/* ── Actions ── */}
      <div className="todo-actions-row">
        <button
          data-testid="test-todo-edit-button"
          className="todo-btn todo-btn-edit"
          onClick={openEdit}
          aria-label="Edit task"
          ref={editButtonRef}
        >
          Edit
        </button>
        <button
          data-testid="test-todo-delete-button"
          className="todo-btn todo-btn-delete"
          onClick={handleDelete}
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>

      {/* ── Edit form (shown as overlay inside card) ── */}
      {isEditing && (
        <div
          data-testid="test-todo-edit-form"
          className="todo-edit-form"
          role="dialog"
          aria-label="Edit task form"
          aria-modal="true"
        >
          <h3 className="todo-edit-heading">Edit Task</h3>

          <div className="todo-field">
            <label htmlFor="edit-title" className="todo-field-label">Title</label>
            <input
              id="edit-title"
              data-testid="test-todo-edit-title-input"
              type="text"
              className="todo-field-input"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              ref={firstInputRef}
            />
          </div>

          <div className="todo-field">
            <label htmlFor="edit-description" className="todo-field-label">Description</label>
            <textarea
              id="edit-description"
              data-testid="test-todo-edit-description-input"
              className="todo-field-input todo-field-textarea"
              value={draftDescription}
              onChange={(e) => setDraftDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="todo-field">
            <label htmlFor="edit-priority" className="todo-field-label">Priority</label>
            <select
              id="edit-priority"
              data-testid="test-todo-edit-priority-select"
              className="todo-field-input"
              value={draftPriority}
              onChange={(e) => setDraftPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="todo-field">
            <label htmlFor="edit-due-date" className="todo-field-label">Due date</label>
            <input
              id="edit-due-date"
              data-testid="test-todo-edit-due-date-input"
              type="datetime-local"
              className="todo-field-input"
              value={draftDueDate}
              onChange={(e) => setDraftDueDate(e.target.value)}
            />
          </div>

          <div className="todo-edit-actions">
            <button
              data-testid="test-todo-cancel-button"
              className="todo-btn todo-btn-delete"
              onClick={handleCancel}
              aria-label="Cancel editing"
            >
              Cancel
            </button>
            <button
              data-testid="test-todo-save-button"
              className="todo-btn todo-btn-save"
              onClick={handleSave}
              aria-label="Save changes"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </article>
  );
}