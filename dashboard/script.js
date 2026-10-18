const profileButton = document.getElementById("profile-button");
const profileMenu = document.getElementById("profile-menu");

const signOut_btn = document.getElementById("signOut");
const updateUser_btn = document.getElementById("updateUser");
const deleteAccount_btn = document.getElementById("deleteAccount");
const changePassword_btn = document.getElementById("changePassword");
const addNoteButtons = document.querySelectorAll(".add-note-button");
const notesSearchInput = document.getElementById("notes-search-input");

const note_section = document.getElementById("note-section");
const user = document.getElementById("user");

async function fetchNotes() {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  try {
    const response = await fetch(API_ENDPOINTS.notes, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return [];
  }
}

function showNotes(notes) {
  const toolbar = document.getElementById("notes-toolbar");
  const notesList = document.getElementById("notes-list");
  const emptyState = document.getElementById("notes-empty");
  const notesCount = document.querySelector(".notes-count");

  if (!toolbar || !notesList || !emptyState || !notesCount) {
    return;
  }

  if (!Array.isArray(notes)) {
    throw new TypeError("Expected an array of notes");
  }

  notesCount.textContent = `${notes.length} ${
    notes.length === 1 ? "note" : "notes"
  }`;

  notesList.replaceChildren();

  if (notes.length === 0) {
    toolbar.hidden = true;
    emptyState.hidden = false;
    return;
  }

  toolbar.hidden = false;
  emptyState.hidden = true;

  notes.forEach((note) => {
    const card = document.createElement("article");

    card.className = "note-card";
    card.dataset.noteId = note.id;

    card.innerHTML = `
      <p class="note-title"></p>

      <div class="note-actions">
        <button class="open-note-button" type="button">
          <i
            class="fa-solid fa-arrow-up-right-from-square"
            aria-hidden="true"
          ></i>
          <span>Open</span>
        </button>

        <button class="remove-note-button" type="button">
          <i
            class="fa-solid fa-trash"
            aria-hidden="true"
          ></i>
          <span>Delete</span>
        </button>
      </div>
    `;
    card.querySelector(".note-title").textContent = note.title;

    notesList.appendChild(card);
  });
}

async function fetchUser() {
  const token = localStorage.getItem("auth_token");
  const url = API_ENDPOINTS.user.me;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const username = data.username;

    if (user) {
      user.textContent = username;
    }

    localStorage.setItem("username", username);
  } catch (error) {
    alert("The Login has Expired");
    localStorage.removeItem("auth_token");

    if (!window.location.pathname.includes("/login/")) {
      window.location.href = "/login/";
    }
  }
}

if (profileButton && profileMenu) {
  profileButton.addEventListener("click", () => {
    const isOpen = profileButton.getAttribute("aria-expanded") === "true";

    profileButton.setAttribute("aria-expanded", String(!isOpen));
    profileMenu.hidden = isOpen;
  });
}

document.addEventListener("click", (event) => {
  if (
    !(event.target instanceof Element) ||
    !event.target.closest(".site-nav")
  ) {
    profileButton?.setAttribute("aria-expanded", "false");

    if (profileMenu) {
      profileMenu.hidden = true;
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && profileButton && profileMenu) {
    profileButton.setAttribute("aria-expanded", "false");
    profileMenu.hidden = true;
    profileButton.focus();
  }
});

if (signOut_btn) {
  signOut_btn.addEventListener("click", () => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("username");
    }

    window.location.reload();
  });
}

if (updateUser_btn) {
  updateUser_btn.addEventListener("click", () => {
    window.location.href = "/dashboard/updateAccount/";
  });
}

if (changePassword_btn) {
  changePassword_btn.addEventListener("click", () => {
    window.location.href = "/dashboard/changePassword/";
  });
}

if (deleteAccount_btn) {
  deleteAccount_btn.addEventListener("click", () => {
    window.location.href = "/dashboard/deleteAccount/";
  });
}

for (const addNoteButton of addNoteButtons) {
  addNoteButton.addEventListener("click", () => {
    window.location.href = "/dashboard/createNote/";
  });
}

notesSearchInput?.addEventListener("input", ({ target }) => {
  const query = target.value.trim().toLowerCase();

  document.querySelectorAll(".note-card").forEach((card) => {
    card.hidden = !card
      .querySelector(".note-title")
      .textContent.toLowerCase()
      .includes(query);
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  await fetchUser();
  const notes = await fetchNotes();
  showNotes(notes);
  window.hidePageLoader?.();
});
