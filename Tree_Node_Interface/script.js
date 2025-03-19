function initializeExpandButtons() {
  document.querySelectorAll(".expand-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const li = this.closest("li");
      const isCollapsed = li.classList.contains("collapsed");
      this.textContent = isCollapsed ? "[-]" : "[+]";
      li.classList.toggle("collapsed");
    });
  });
}
initializeExpandButtons();

function showAddForm(button) {
  const form = button.parentElement.nextElementSibling;
  form.classList.toggle("active");
}

function addItem(button) {
  const form = button.parentElement;
  const input = form.querySelector("input");
  const name = input.value.trim();
  if (!name) return;
  const parentLi = form.parentElement.parentElement;
  let parentUl = parentLi.querySelector("ul");
  if (!parentUl) {
    parentUl = document.createElement("ul");
    parentLi.appendChild(parentUl);
  }
  const newLi = document.createElement("li");
  newLi.innerHTML = `
      <div class="tree-item node-item">
        <span class="expand-btn">[-]</span>
        <span class="name">${name}</span>
        <div class="actions">
          <button class="add-btn" onclick="showAddForm(this)">+</button>
          <button class="delete-btn" onclick="deleteItem(this)">×</button>
        </div>
        <div class="input-form">
          <input type="text" placeholder="Name">
          <button onclick="addItem(this)">Add</button>
        </div>
      </div>
      <ul></ul>
    `;
  const expandBtn = newLi.querySelector(".expand-btn");
  expandBtn.addEventListener("click", function () {
    const li = this.closest("li");
    const isCollapsed = li.classList.contains("collapsed");
    this.textContent = isCollapsed ? "[-]" : "[+]";
    li.classList.toggle("collapsed");
  });
  parentUl.appendChild(newLi);
  input.value = "";
  form.classList.remove("active");
}

function deleteItem(button) {
  const li = button.closest("li");
  if (
    confirm("Are you sure you want to delete this item and all its contents?")
  ) {
    li.remove();
  }
}

// Show details box when clicking a file name
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("name")) {
    const li = e.target.closest("li");
    showFolderContents(li);
  }
});

let currentFolderLi = null;

function showFolderContents(directoryLi) {
  currentFolderLi = directoryLi;
  document.getElementById("folder-name-display").textContent =
    directoryLi.querySelector(".name").textContent;
  const folderDetails = directoryLi.dataset.details
    ? JSON.parse(directoryLi.dataset.details)
    : { field1: "", field2: "", field3: "" };
  document.getElementById("folder-field1").value = folderDetails.field1 || "";
  const filesList = document.getElementById("folder-files");
  filesList.innerHTML = "";
  const examples = directoryLi.dataset.examples
    ? JSON.parse(directoryLi.dataset.examples)
    : [];
  examples.forEach((example) => {
    const listItem = document.createElement("li");
    const fileNameSpan = document.createElement("span");
    fileNameSpan.textContent = example.language;
    const fileField2 = document.createElement("textarea");
    fileField2.style.overflow = "auto";
    fileField2.style.resize = "vertical";
    fileField2.style.width = "100%";
    fileField2.style.height = "40px";
    fileField2.value = example.description;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = function () {
      if (confirm("Are you sure you want to delete this example?")) {
        listItem.remove();
      }
    };
    listItem.appendChild(fileNameSpan);
    listItem.appendChild(document.createElement("br"));
    listItem.appendChild(fileField2);
    listItem.appendChild(deleteBtn);
    filesList.appendChild(listItem);
  });
  document.getElementById("folder-contents-box").style.display = "block";
  toggleAdminMode();
}

function closeFolderContentsBox() {
  document.getElementById("folder-contents-box").style.display = "none";
}

function saveFolderDetails() {
  if (!currentFolderLi) return;
  const folderDetails = {
    field1: document.getElementById("folder-field1").value,
  };
  currentFolderLi.dataset.details = JSON.stringify(folderDetails);
  alert("Folder details updated!");
  closeFolderContentsBox();
}

function addExample() {
  const filesList = document.getElementById("folder-files");
  const listItem = document.createElement("li");
  const languageSelect = document.getElementById("languageSelect");
  const selectedLanguage = languageSelect.value;
  const fileNameSpan = document.createElement("span");
  fileNameSpan.textContent = selectedLanguage;
  const fileField2 = document.createElement("textarea");
  fileField2.style.overflow = "auto";
  fileField2.style.resize = "vertical";
  fileField2.style.width = "100%";
  fileField2.style.height = "40px";
  fileField2.readOnly = document.getElementById("adminSwitch").checked
    ? false
    : true;
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.onclick = function () {
    if (confirm("Are you sure you want to delete this example?")) {
      listItem.remove();
    }
  };
  listItem.appendChild(fileNameSpan);
  listItem.appendChild(document.createElement("br"));
  listItem.appendChild(fileField2);
  listItem.appendChild(deleteBtn);
  filesList.appendChild(listItem);
  const examples = JSON.parse(currentFolderLi.dataset.examples || "[]");
  examples.push({ language: selectedLanguage, description: "" });
  currentFolderLi.dataset.examples = JSON.stringify(examples);
  toggleAdminMode();
}

function saveExample() {
  if (!currentFolderLi) return;
  const filesContainer = document.getElementById("folder-files");
  const groups = filesContainer.querySelectorAll("ul");
  let examples = [];
  groups.forEach((group) => {
    const header = group.firstElementChild;
    if (!header) return;
    const language = header.textContent.trim();
    const exampleItems = group.querySelectorAll("li:not(:first-child)");
    exampleItems.forEach((item) => {
      const textarea = item.querySelector("textarea");
      if (textarea) {
        examples.push({
          language: language,
          description: textarea.value,
        });
      }
    });
  });
  currentFolderLi.dataset.examples = JSON.stringify(examples);
  console.log("Saved Examples:", examples);
  alert("Examples saved successfully!");
}

function treeToJson(element) {
  const items = [];
  const lis = element.children;
  for (let li of lis) {
    const item = {};
    const nameSpan = li.querySelector(".name");
    item.name = nameSpan.textContent;
    item.type = li.querySelector(".tree-item").classList.contains("root-item")
      ? "root"
      : "node";
    item.collapsed = li.classList.contains("collapsed");
    if (li.dataset.details) {
      item.details = JSON.parse(li.dataset.details);
    }
    if (li.dataset.examples) {
      item.examples = JSON.parse(li.dataset.examples);
    }
    const ul = li.querySelector("ul");
    if (ul && ul.children.length > 0) {
      item.children = treeToJson(ul);
    }
    items.push(item);
  }
  return items;
}

async function saveTree() {
  const root = document.getElementById("root");
  const treeData = treeToJson(root);
  const jsonString = JSON.stringify(treeData, null, 2);
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: "tree-structure.json",
        types: [
          {
            description: "JSON Files",
            accept: { "application/json": [".json"] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(jsonString);
      await writable.close();
      alert("File saved successfully!");
    } catch (error) {
      console.error("File save failed", error);
    }
  } else {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tree-structure.json";
    a.click();
    URL.revokeObjectURL(url);
  }
}

function loadTree(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const treeData = JSON.parse(e.target.result);
        const root = document.getElementById("root");
        root.innerHTML = "";
        function createTreeElement(items) {
          const fragment = document.createDocumentFragment();
          items.forEach((item) => {
            const li = document.createElement("li");
            if (item.collapsed) li.classList.add("collapsed");
            const isRoot = item.type === "root";
            li.innerHTML = `
                             <div class=\"tree-item ${
                               isRoot ? "root-item" : "node-item"
                             }\">
                           <span class=\"expand-btn\">${
                             item.collapsed ? "[+]" : "[-]"
                           }</span>
                           <span class=\"name\">${item.name}</span>
                           <div class=\"actions\">
                             <button class=\"add-btn\" onclick=\"showAddForm(this)\">+</button>
                             <button class=\"delete-btn\" onclick=\"deleteItem(this)\">x</button>
                           </div>
                           <div class=\"input-form\">
                             <input type=\"text\" placeholder=\"Name\">
                             <button onclick=\"addItem(this)\">Add</button>
                           </div>
                         </div>
                       `;
            if (item.details) {
              li.dataset.details = JSON.stringify(item.details);
            }
            if (item.examples) {
              li.dataset.examples = JSON.stringify(item.examples);
            }
            if (item.children) {
              const ul = document.createElement("ul");
              ul.appendChild(createTreeElement(item.children));
              li.appendChild(ul);
            }
            fragment.appendChild(li);
          });
          return fragment;
        }
        root.appendChild(createTreeElement(treeData));
        initializeExpandButtons();
        toggleAdminMode();
      } catch (error) {
        alert("Error loading file: " + error.message);
      }
    };
    reader.readAsText(file);
  }
}

function toggleAdminMode() {
  const isAdmin = document.getElementById("adminSwitch").checked;
  document.querySelectorAll(".add-btn, .delete-btn").forEach((btn) => {
    btn.style.display = isAdmin ? "inline-block" : "none";
  });
  document.getElementById("folder-field1").disabled = !isAdmin;
  const englishOption = document.querySelector(
    '#languageSelect option[value="English"]'
  );
  if (!isAdmin) {
    englishOption.disabled = true;
    if (document.getElementById("languageSelect").value === "English") {
      document.getElementById("languageSelect").value = "Gujarati";
    }
  } else {
    englishOption.disabled = false;
  }
  filterExamples();
}

function filterExamples() {
  if (!currentFolderLi) return;
  const userLang = document.getElementById("languageSelect").value;
  const isAdmin = document.getElementById("adminSwitch").checked;
  const filesContainer = document.getElementById("folder-files");
  filesContainer.innerHTML = "";
  let columns = [];
  if (isAdmin) {
    const groupMap = {};
    const examples = JSON.parse(currentFolderLi.dataset.examples || "[]");
    examples.forEach((example) => {
      if (!groupMap[example.language]) {
        const ul = document.createElement("ul");
        ul.style.margin = "0";
        const header = document.createElement("li");
        header.style.fontWeight = "bold";
        header.textContent = example.language;
        ul.appendChild(header);
        groupMap[example.language] = ul;
      }
      const listItem = document.createElement("li");
      const fileField2 = document.createElement("textarea");
      fileField2.style.overflow = "auto";
      fileField2.style.resize = "vertical";
      fileField2.style.width = "100%";
      fileField2.style.height = "40px";
      fileField2.value = example.description;
      fileField2.readOnly = false;
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-btn";
      deleteBtn.style.display = "inline-block";
      deleteBtn.onclick = function () {
        if (confirm("Are you sure you want to delete this example?")) {
          listItem.remove();
        }
      };
      listItem.appendChild(fileField2);
      listItem.appendChild(deleteBtn);
      groupMap[example.language].appendChild(listItem);
    });
    for (const lang in groupMap) {
      if (groupMap[lang].children.length > 1) {
        columns.push(groupMap[lang]);
      }
    }
  } else {
    const referenceLang = document.getElementById(
      "referenceLanguageSelect"
    ).value;
    const referenceLang2 = document.getElementById(
      "referenceLanguageSelect2"
    ).value;
    const languagesToShow = new Set([userLang, referenceLang]);
    if (referenceLang2 != "None") {
      languagesToShow.add(referenceLang2);
    }
    const groupMap = {};
    const examples = JSON.parse(currentFolderLi.dataset.examples || "[]");
    examples.forEach((example) => {
      if (languagesToShow.has(example.language)) {
        if (!groupMap[example.language]) {
          const ul = document.createElement("ul");
          ul.style.margin = "0";
          const header = document.createElement("li");
          header.style.fontWeight = "bold";
          header.textContent = example.language;
          ul.appendChild(header);
          groupMap[example.language] = ul;
        }
        const listItem = document.createElement("li");
        const fileField2 = document.createElement("textarea");
        fileField2.style.overflow = "auto";
        fileField2.style.resize = "vertical";
        fileField2.style.width = "100%";
        fileField2.style.height = "40px";
        fileField2.value = example.description;
        fileField2.readOnly = example.language !== userLang;
        listItem.appendChild(fileField2);
        groupMap[example.language].appendChild(listItem);
      }
    });
    if (groupMap[userLang]) columns.push(groupMap[userLang]);
    if (userLang !== referenceLang && groupMap[referenceLang]) {
      columns.push(groupMap[referenceLang]);
    }
    if (userLang !== referenceLang2 && groupMap[referenceLang2] && referenceLang2 != "None") {
      columns.push(groupMap[referenceLang2]);
    }
  }
  if (columns.length > 0) {
    if (columns.length === 1) {
      filesContainer.appendChild(columns[0]);
    } else {
      const flexContainer = document.createElement("div");
      flexContainer.style.display = "flex";
      flexContainer.style.gap = "20px";
      flexContainer.style.width = "100%";
      if (columns.length === 2) {
        columns.forEach((col) => {
          col.style.flex = "0 1 50%";
        });
      } else {
        columns.forEach((col) => {
          col.style.flex = `0 1 calc((100% - ${
            (columns.length - 1) * 20
          }px) / ${columns.length})`;
        });
      }
      columns.forEach((col) => flexContainer.appendChild(col));
      filesContainer.appendChild(flexContainer);
    }
  }
}

document
  .getElementById("languageSelect")
  .addEventListener("change", filterExamples);
document
  .getElementById("referenceLanguageSelect")
  .addEventListener("change", filterExamples);
document
  .getElementById("referenceLanguageSelect2")
  .addEventListener("change", filterExamples);
toggleAdminMode();

function toggleTreeVisibility() {
  const treeContainer = document.querySelector(".tree");
  const btn = document.getElementById("toggleTreeButton");
  const folderBox = document.getElementById("folder-contents-box");
  if (treeContainer.style.display === "none") {
    treeContainer.style.display = "block";
    btn.textContent = "Hide Tree";
    folderBox.style.width = "50%";
    folderBox.style.right = "10%";
    folderBox.style.left = "";
  } else {
    treeContainer.style.display = "none";
    btn.textContent = "Show Tree";
    folderBox.style.width = "80%";
    folderBox.style.left = "10%";
    folderBox.style.right = "";
  }
}
