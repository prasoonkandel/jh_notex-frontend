import { Crepe } from "@milkdown/crepe";
import { $prose } from "@milkdown/kit/utils";
import { Plugin } from "@milkdown/kit/prose/state";
import { editorViewCtx } from "@milkdown/kit/core";

import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

const titleInput = document.getElementById("note-title");
const titleHeading = document.getElementById("document-title-heading");
const titleError = document.getElementById("title-error");

const editorContainer = document.getElementById("note-editor");
const noteDocument = document.getElementById("note-document");

const saveButton = document.getElementById("save-button");
const copyButton = document.getElementById("copy-button");
const saveStatus = document.getElementById("save-status");
const editorActions = document.getElementById("editor-actions");

const noteError = document.getElementById("note-error");
const noteErrorTitle = document.getElementById("note-error-title");
const noteErrorDescription = document.getElementById("note-error-description");

const errorBackLink = document.getElementById("error-back-link");
const errorBackText = document.getElementById("error-back-text");
const retryButton = document.getElementById("retry-note");

const params = new URLSearchParams(window.location.search);
const rawId = params.get("id");

const noteId = rawId !== null && /^\d+$/.test(rawId) ? Number(rawId) : NaN;

const NOTES_API = API_ENDPOINTS.notes;
let crepe = null;

let ready = false;
let saving = false;
let copying = false;

let savedTitle = "";
let savedContent = "";
let saveErrorMessage = "";

function redirectToLogin() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("username");
  window.location.replace("/login/");
}

function setStatus(message, state = "normal") {
  saveStatus.textContent = message;
  saveStatus.dataset.state = state;
}

function setTitleError(message = "") {
  titleError.textContent = message;
  titleError.hidden = !message;
  titleInput.setAttribute("aria-invalid", String(Boolean(message)));
}

function getTitle() {
  return titleInput.value.trim();
}

function setDocumentTitle(title) {
  document.title = `${title} | JingHua Notex`;
  titleHeading.setAttribute("aria-label", title || "Note title");
}

async function apiRequest(url, options = {}) {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    const error = new Error("Please sign in to access your notes.");
    error.status = 401;
    throw error;
  }

  const response = await fetch(url, {
    ...options,

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    let message = `Request failed (HTTP ${response.status})`;

    if (response.status === 401) {
      message = "Your session has expired. Please sign in again.";
    } else if (response.status === 403) {
      message = "You do not have permission to access this note.";
    } else if (response.status === 404) {
      message = "Note not found.";
    } else if (typeof data?.detail === "string") {
      message = data.detail;
    }

    const error = new Error(message);
    error.status = response.status;

    throw error;
  }

  return data;
}
function convertH1ToH2(transaction, documentNode) {
  let changed = false;

  documentNode.descendants((node, position) => {
    if (node.type.name === "heading" && node.attrs.level === 1) {
      transaction.setNodeMarkup(position, undefined, {
        ...node.attrs,
        level: 2,
      });

      changed = true;
    }
  });

  return changed ? transaction : null;
}

function updateCodeBlockClasses(view) {
  editorContainer
    .querySelectorAll(".milkdown-code-block")
    .forEach((element) => {
      const position = view.posAtDOM(element, 0);
      const node = view.state.doc.nodeAt(position);
      const isLatex = node?.attrs.language?.toLowerCase() === "latex";

      element.classList.toggle("latex-code-block", isLatex);
    });
}

function preserveScrollDuringToolbarAction(event) {
  const target = event.target;

  if (!(target instanceof Element) || !target.closest(".milkdown-toolbar")) {
    return;
  }

  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  window.requestAnimationFrame(() => {
    window.scrollTo(scrollX, scrollY);
  });
}

const preventH1Plugin = $prose(() => {
  return new Plugin({
    view: () => ({
      update: updateCodeBlockClasses,
    }),
    appendTransaction(transactions, oldState, newState) {
      if (!transactions.some((transaction) => transaction.docChanged)) {
        return null;
      }

      return convertH1ToH2(newState.tr, newState.doc);
    },
  });
});

function normalizeExistingHeadings() {
  crepe.editor.action((ctx) => {
    const view = ctx.get(editorViewCtx);

    const transaction = convertH1ToH2(view.state.tr, view.state.doc);

    if (transaction) {
      view.dispatch(transaction);
    }
  });
}

function hasUnsavedChanges() {
  if (!ready || !crepe) {
    return false;
  }

  return getTitle() !== savedTitle || crepe.getMarkdown() !== savedContent;
}

function getNoteMarkdown() {
  const title = getTitle();
  const content = crepe.getMarkdown().trim();

  return [title ? `# ${title}` : "", content].filter(Boolean).join("\n\n");
}

async function copyNoteAsMarkdown() {
  if (!ready || !crepe || copying) {
    return;
  }

  if (!navigator.clipboard?.writeText) {
    setStatus("Copy is not supported in this browser", "error");
    return;
  }

  copying = true;
  copyButton.disabled = true;

  try {
    await navigator.clipboard.writeText(getNoteMarkdown());
    copyButton.querySelector("span").textContent = "Copied!";
    setStatus("Copied as Markdown", "success");

    window.setTimeout(() => {
      copyButton.querySelector("span").textContent = "Copy Markdown";
      copying = false;
      updateSaveState();
    }, 1400);
  } catch (error) {
    console.error("Failed to copy note:", error);
    copying = false;
    copyButton.disabled = false;
    setStatus("Copy failed. Please try again.", "error");
  }
}

function updateSaveState() {
  if (!ready || !crepe) {
    saveButton.disabled = true;
    copyButton.disabled = true;
    return;
  }

  copyButton.disabled = copying;

  const title = getTitle();

  if (!title) {
    setTitleError("A note title cannot be empty.");
    setStatus("Title required", "error");
    saveButton.disabled = true;
    return;
  }

  setTitleError();

  if (saving) {
    saveButton.disabled = true;
    setStatus("Saving...");
    return;
  }

  const changed = hasUnsavedChanges();

  saveButton.disabled = !changed;

  if (saveErrorMessage && changed) {
    setStatus(saveErrorMessage, "error");
  } else if (changed) {
    setStatus("Unsaved changes", "dirty");
  } else {
    setStatus("All changes saved", "success");
  }
}

async function initializeEditor(markdown) {
  crepe = new Crepe({
    root: editorContainer,
    defaultValue: markdown,

    features: {
      [Crepe.Feature.TopBar]: true,
      [Crepe.Feature.Toolbar]: true,
      [Crepe.Feature.ImageBlock]: false,
      [Crepe.Feature.AI]: false,
    },

    featureConfigs: {
      [Crepe.Feature.Placeholder]: {
        text: "Start writing your note...",
        mode: "block",
      },

      [Crepe.Feature.BlockEdit]: {
        textGroup: {
          label: "Text",

          text: { label: "Normal text" },

          h1: null,

          h2: { label: "Heading 2" },
          h3: { label: "Heading 3" },
          h4: { label: "Heading 4" },
          h5: { label: "Heading 5" },
          h6: { label: "Heading 6" },

          quote: { label: "Quote" },
          divider: { label: "Divider" },
        },
      },
      [Crepe.Feature.TopBar]: {
        headingOptions: [
          { label: "Text", level: null },
          { label: "H2", level: 2 },
          { label: "H3", level: 3 },
          { label: "H4", level: 4 },
          { label: "H5", level: 5 },
          { label: "H6", level: 6 },
        ],
      },

    },
  });

  crepe.editor.use(preventH1Plugin);

  crepe.on((listener) => {
    listener.markdownUpdated(() => {
      if (ready) {
        saveErrorMessage = "";
        updateSaveState();
      }
    });
  });

  await crepe.create();

  crepe.editor.action((ctx) => {
    updateCodeBlockClasses(ctx.get(editorViewCtx));
  });

  const originalMarkdown = crepe.getMarkdown();

  normalizeExistingHeadings();

  return originalMarkdown;
}

function showNoteError(error) {
  console.error("Unable to open note:", error);

  let heading = "Unable to open note";

  let description =
    "Something went wrong while loading your note. Please try again.";

  let canRetry = true;
  let loginRequired = false;

  if (error.code === "INVALID_NOTE_ID") {
    heading = "Invalid note link";

    description =
      "The link does not contain a valid note ID. Please return to your dashboard and open a note from there.";

    canRetry = false;
  } else if (error.status === 404) {
    heading = "Note not found";

    description =
      "This note may have been deleted, or you may not have access to it.";

    canRetry = false;
  } else if (error.status === 401) {
    redirectToLogin();
    return;
  } else if (error.status === 403) {
    heading = "Access denied";

    description = "You do not have permission to open this note.";

    canRetry = false;
  }

  noteErrorTitle.textContent = heading;
  noteErrorDescription.textContent = description;

  document.title = `${heading} | JingHua Notex`;

  errorBackLink.href = loginRequired ? "/login/" : "/dashboard/";

  errorBackText.textContent = loginRequired
    ? "Go to login"
    : "Back to my notes";

  retryButton.hidden = !canRetry;

  ready = false;

  noteDocument.hidden = true;
  editorActions.hidden = true;
  noteError.hidden = false;

  saveButton.disabled = true;
}

async function loadNote() {
  try {
    if (!Number.isSafeInteger(noteId) || noteId <= 0) {
      const error = new Error("Invalid note ID");
      error.code = "INVALID_NOTE_ID";
      throw error;
    }

    if (!NOTES_API) {
      throw new Error("API configuration is missing.");
    }

    const note = await apiRequest(`${NOTES_API}/${noteId}`, { method: "GET" });

    if (
      note?.id !== noteId ||
      typeof note.title !== "string" ||
      typeof note.content !== "string"
    ) {
      throw new Error("Invalid note data received.");
    }

    titleInput.value = note.title.trim();
    setDocumentTitle(note.title);

    const originalMarkdown = await initializeEditor(note.content);

    savedTitle = titleInput.value;
    savedContent = originalMarkdown;

    ready = true;
    titleInput.disabled = false;
    copyButton.disabled = false;

    noteError.hidden = true;
    noteDocument.hidden = false;
    editorActions.hidden = false;

    updateSaveState();
  } catch (error) {
    if (error.status === 401) {
      redirectToLogin();
      return;
    }

    showNoteError(error);
  } finally {
    window.hidePageLoader?.();
  }
}

async function saveNote() {
  if (!ready || !crepe || saving) {
    return;
  }

  const title = getTitle();

  if (!title) {
    setTitleError("A note title cannot be empty.");
    setStatus("Title required", "error");
    return;
  }

  if (title.length > 100) {
    setTitleError("Title cannot exceed 100 characters.");
    setStatus("Invalid title", "error");
    return;
  }

  if (!hasUnsavedChanges()) {
    return;
  }

  const content = crepe.getMarkdown();

  saving = true;
  saveErrorMessage = "";

  saveButton.disabled = true;
  setStatus("Saving...");

  try {
    await apiRequest(NOTES_API, {
      method: "PATCH",

      body: JSON.stringify({
        id: noteId,
        title,
        content,
      }),
    });

    savedTitle = title;
    savedContent = content;

    setDocumentTitle(title);
  } catch (error) {
    console.error("Failed to save note:", error);

    if (error.status === 401) {
      redirectToLogin();
      return;
    }

    saveErrorMessage = `Save failed: ${error.message}`;
  } finally {
    saving = false;

    updateSaveState();
  }
}

titleInput.addEventListener("input", () => {
  saveErrorMessage = "";
  titleHeading.setAttribute("aria-label", getTitle() || "Note title");

  updateSaveState();
});

editorContainer.addEventListener(
  "pointerdown",
  preserveScrollDuringToolbarAction,
  true,
);

saveButton.addEventListener("click", () => {
  void saveNote();
});

copyButton.addEventListener("click", () => {
  void copyNoteAsMarkdown();
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    void saveNote();
  }
});

retryButton.addEventListener("click", () => {
  window.location.reload();
});
window.addEventListener("beforeunload", (event) => {
  if (hasUnsavedChanges()) {
    event.preventDefault();
    event.returnValue = "";
  }
});

void loadNote();
