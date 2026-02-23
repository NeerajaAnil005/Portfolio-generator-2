const markdownInput = document.getElementById("markdownInput");
const preview = document.getElementById("preview");
const fileInput = document.getElementById("fileInput");
const profileImageInput = document.getElementById("profileImage");
const previewImage = document.getElementById("previewImage");

function updatePreview() {
  const markdownText = markdownInput.value;
  const html = marked.parse(markdownText);

  preview.innerHTML = html;

  wrapSections();
  addSectionToggle();
}

markdownInput.addEventListener("input", updatePreview);

/* =============================
   SECTION WRAPPING
============================= */

function wrapSections() {
  const elements = Array.from(preview.children);
  preview.innerHTML = "";

  let currentSection = null;

  elements.forEach(el => {
    if (el.tagName === "H2") {
      currentSection = document.createElement("div");
      currentSection.className = "section";
      preview.appendChild(currentSection);
      currentSection.appendChild(el);
    } else if (currentSection) {
      currentSection.appendChild(el);
    } else {
      preview.appendChild(el);
    }
  });

  makeSortable();
}

/* =============================
   SHOW / HIDE SECTION
============================= */

function addSectionToggle() {
  const sections = document.querySelectorAll(".section");

  sections.forEach(section => {
    const heading = section.querySelector("h2");

    if (!heading) return;

    // Prevent duplicate buttons
    if (heading.querySelector(".toggle-btn")) return;

    const btn = document.createElement("button");
    btn.textContent = "Hide";
    btn.className = "toggle-btn";
    btn.style.marginLeft = "15px";

    btn.onclick = () => {
      const content = Array.from(section.children).slice(1);

      content.forEach(el => {
        el.style.display =
          el.style.display === "none" ? "block" : "none";
      });

      btn.textContent =
        btn.textContent === "Hide" ? "Show" : "Hide";
    };

    heading.appendChild(btn);
  });
}

/* =============================
   DRAG & DROP
============================= */

function makeSortable() {
  new Sortable(preview, {
    animation: 150
  });
}

/* =============================
   THEME SWITCHING
============================= */

function setTheme(theme) {
  document.body.className = theme;
}

/* =============================
   FILE UPLOAD (.md)
============================= */

fileInput.addEventListener("change", function(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    markdownInput.value = e.target.result;
    updatePreview();
  };

  reader.readAsText(file);
});

/* =============================
   PROFILE IMAGE UPLOAD
============================= */

profileImageInput.addEventListener("change", function(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    previewImage.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

/* =============================
   DOWNLOAD WEBSITE
============================= */

function downloadHTML() {
  const content = `
  <html>
  <head>
    <title>My Portfolio</title>
    <style>
      body { font-family: Arial; padding: 40px; }
      img { width:120px; border-radius:50%; }
    </style>
  </head>
  <body>
    ${previewImage.src ? `<img src="${previewImage.src}"/>` : ""}
    ${preview.innerHTML}
  </body>
  </html>
  `;

  const blob = new Blob([content], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "portfolio.html";
  link.click();
}

updatePreview();