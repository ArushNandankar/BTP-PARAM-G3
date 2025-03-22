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
  // Remove the active class from any folder
  document
    .querySelectorAll(".tree-item .name.active-folder")
    .forEach((span) => {
      span.classList.remove("active-folder");
    });

  currentFolderLi = directoryLi;
  const nameSpan = directoryLi.querySelector(".name");
  if (nameSpan) {
    nameSpan.classList.add("active-folder");
  }
  document.getElementById("folder-name-display").textContent =
    nameSpan.textContent;
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
    fileField2.style.height = "50px";
    fileField2.style.fontSize = "18px";
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
  updateNavigationButtons();
}

function closeFolderContentsBox() {
  // Remove active class from current folder name if needed
  if (currentFolderLi) {
    const nameSpan = currentFolderLi.querySelector(".name");
    if (nameSpan) {
      nameSpan.classList.remove("active-folder");
    }
  }
  document.getElementById("folder-contents-box").style.display = "none";
}

function saveFolderDetails() {
  if (!currentFolderLi) return;
  // Save examples so that any changes (like the checkbox state) are persisted
  saveExample();
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
  fileField2.style.height = "50px";
  fileField2.style.fontSize = "18px";
  // In non-admin mode, the textarea is read-only:
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

  // Always add the checkbox if the example is of the selected language:
  let featureCheckbox = null;
  let featureLabel = null;
  if (selectedLanguage === languageSelect.value) {
    featureCheckbox = document.createElement("input");
    featureCheckbox.type = "checkbox";
    featureCheckbox.className = "feature-checkbox";
    // New examples start unchecked:
    featureCheckbox.checked = false;

    featureLabel = document.createElement("label");
    featureLabel.textContent = " Feature present: ";
  }

  listItem.appendChild(fileNameSpan);
  listItem.appendChild(document.createElement("br"));
  listItem.appendChild(fileField2);
  // Append the checkbox if it was created
  if (featureCheckbox) {
    listItem.appendChild(featureLabel);
    listItem.appendChild(featureCheckbox);
  }
  listItem.appendChild(deleteBtn);
  filesList.appendChild(listItem);

  // Update the folder's examples data (include feature flag)
  const examples = JSON.parse(currentFolderLi.dataset.examples || "[]");
  examples.push({
    language: selectedLanguage,
    description: "",
    featurepresent: false,
  });
  currentFolderLi.dataset.examples = JSON.stringify(examples);
  toggleAdminMode();
}

function saveExample() {
  if (!currentFolderLi) return;
  const filesContainer = document.getElementById("folder-files");
  // The examples are grouped in <ul> elements
  const groups = filesContainer.querySelectorAll("ul");
  let examples = [];
  groups.forEach((group) => {
    const header = group.firstElementChild;
    if (!header) return;
    const language = header.textContent.trim();
    // Skip the header and loop through each example item
    const exampleItems = group.querySelectorAll("li:not(:first-child)");
    exampleItems.forEach((item) => {
      const textarea = item.querySelector("textarea");
      if (textarea) {
        // Get the checkbox if it exists
        const checkbox = item.querySelector(".feature-checkbox");
        const feature = checkbox ? checkbox.checked : false;
        const commentTextarea = item.querySelector(".comment-textarea");
        let comment = "";
        if (commentTextarea) {
          comment = commentTextarea.value;
        } else {
          const commentDisplay = item.querySelector(".comment-display");
          if (commentDisplay) {
            comment = commentDisplay.textContent;
          }
        }
        examples.push({
          language: language,
          description: textarea.value,
          featurepresent: feature,
          comment: comment,
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
                             <div class="tree-item ${
                               isRoot ? "root-item" : "node-item"
                             }">
                           <span class="expand-btn">${
                             item.collapsed ? "[+]" : "[-]"
                           }</span>
                           <span class="name">${item.name}</span>
                           <div class="actions">
                             <button class="add-btn" onclick="showAddForm(this)">+</button>
                             <button class="delete-btn" onclick="deleteItem(this)">x</button>
                           </div>
                           <div class="input-form">
                             <input type="text" placeholder="Name">
                             <button onclick="addItem(this)">Add</button>
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
      fileField2.style.height = "50px";
      fileField2.style.fontSize = "18px";
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

      const featureCheckbox = document.createElement("input");
      featureCheckbox.type = "checkbox";
      featureCheckbox.className = "feature-checkbox";
      featureCheckbox.checked = example.featurepresent || false;
      // Disable checkbox if the example's language is not the selected language
      if (example.language !== userLang) {
        featureCheckbox.disabled = true;
      }
      listItem.appendChild(featureCheckbox);

      const featureLabel = document.createElement("label");
      featureLabel.textContent = " Feature present: ";
      listItem.appendChild(featureLabel);

      // If feature is present, add a button to add a comment
      if (example.featurepresent) {
        if (example.comment && example.comment.trim() !== "") {
          // If a comment exists, display it instead of the Add Comment button
          const commentDisplay = document.createElement("span");
          commentDisplay.textContent = example.comment;
          commentDisplay.className = "comment-display";
          listItem.appendChild(commentDisplay);
        } else {
          // Otherwise, show the Add Comment button
          const commentButton = document.createElement("button");
          commentButton.textContent = "Add Comment";
          commentButton.onclick = function () {
            let existingCommentDiv = listItem.querySelector(".comment-div");
            if (existingCommentDiv) {
              // Remove the comment input if it already exists
              existingCommentDiv.remove();
            } else {
              // Create a new comment input area
              const commentDiv = document.createElement("div");
              commentDiv.className = "comment-div";
              const commentInput = document.createElement("input");
              commentInput.type = "text";
              commentInput.placeholder = "Enter comment";
              commentInput.classList.add("comment-textarea");
              // Pre-fill with existing comment if available (should be empty in this branch)
              commentInput.value = example.comment || "";
              const saveCommentBtn = document.createElement("button");
              saveCommentBtn.textContent = "Save Comment";
              saveCommentBtn.onclick = function () {
                example.comment = commentInput.value;
                alert("Comment saved");
                saveExample();
                // After saving, if a non-empty comment exists, replace the button with the comment display
                if (example.comment && example.comment.trim() !== "") {
                  commentDiv.remove();
                  commentButton.remove();
                  const commentDisplay = document.createElement("span");
                  commentDisplay.textContent = example.comment;
                  commentDisplay.className = "comment-display";
                  listItem.appendChild(commentDisplay);
                }
              };
              commentDiv.appendChild(commentInput);
              commentDiv.appendChild(saveCommentBtn);
              listItem.appendChild(commentDiv);
            }
          };
          listItem.appendChild(commentButton);
        }
      }

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
        fileField2.style.height = "50px";
        fileField2.style.fontSize = "18px";
        fileField2.value = example.description;
        // Only allow editing when the example is of the user-selected language:
        fileField2.readOnly = example.language !== userLang;
        listItem.appendChild(fileField2);

        const featureCheckbox = document.createElement("input");
        featureCheckbox.type = "checkbox";
        featureCheckbox.className = "feature-checkbox";
        featureCheckbox.checked = example.featurepresent || false;
        // Disable checkbox if the example's language is not the selected language
        if (example.language !== userLang) {
          featureCheckbox.disabled = true;
        }
        listItem.appendChild(featureCheckbox);

        const featureLabel = document.createElement("label");
        featureLabel.textContent = " Feature present: ";
        listItem.appendChild(featureLabel);
        // If feature is present, add a button to add a comment
        if (example.featurepresent) {
          if (example.comment && example.comment.trim() !== "") {
            const commentDisplay = document.createElement("span");
            commentDisplay.textContent = example.comment;
            commentDisplay.className = "comment-display";
            listItem.appendChild(commentDisplay);
          } else {
            const commentButton = document.createElement("button");
            commentButton.textContent = "Add Comment";
            commentButton.onclick = function () {
              let existingCommentDiv = listItem.querySelector(".comment-div");
              if (existingCommentDiv) {
                existingCommentDiv.remove();
              } else {
                const commentDiv = document.createElement("div");
                commentDiv.className = "comment-div";
                const commentInput = document.createElement("input");
                commentInput.type = "text";
                commentInput.placeholder = "Enter comment";
                commentInput.classList.add("comment-textarea");
                // Pre-fill with existing comment if available
                commentInput.value = example.comment || "";
                const saveCommentBtn = document.createElement("button");
                saveCommentBtn.textContent = "Save Comment";
                saveCommentBtn.onclick = function () {
                  example.comment = commentInput.value;
                  alert("Comment saved");
                  saveExample();
                  if (example.comment && example.comment.trim() !== "") {
                    commentDiv.remove();
                    commentButton.remove();
                    const commentDisplay = document.createElement("span");
                    commentDisplay.textContent = example.comment;
                    commentDisplay.className = "comment-display";
                    listItem.appendChild(commentDisplay);
                  }
                };
                commentDiv.appendChild(commentInput);
                commentDiv.appendChild(saveCommentBtn);
                listItem.appendChild(commentDiv);
              }
            };
            listItem.appendChild(commentButton);
          }
        }
        groupMap[example.language].appendChild(listItem);
      }
    });
    if (groupMap[userLang]) columns.push(groupMap[userLang]);
    if (userLang !== referenceLang && groupMap[referenceLang]) {
      columns.push(groupMap[referenceLang]);
    }
    if (
      userLang !== referenceLang2 &&
      groupMap[referenceLang2] &&
      referenceLang2 != "None"
    ) {
      columns.push(groupMap[referenceLang2]);
    }
  }
  // Append columns to the files container (using a flex layout for multiple columns)
  if (columns.length > 0) {
    if (columns.length === 1) {
      filesContainer.appendChild(columns[0]);
    } else {
      const flexContainer = document.createElement("div");
      flexContainer.style.display = "flex";
      flexContainer.style.gap = "20px";

      if (columns.length > 3) {
        // Make each column a fixed 33% and set container width accordingly
        columns.forEach((col) => {
          col.style.flex = "0 1 calc((100% - 4%) / 3)";
        });
        flexContainer.style.width = `${columns.length * 33}%`;
      } else if (columns.length === 2) {
        columns.forEach((col) => {
          col.style.flex = "0 1 calc((100% - 2%) / 2)";
        });
      } else if (columns.length === 3) {
        columns.forEach((col) => {
          col.style.flex = "0 1 calc((100% - 4%) / 3)";
        });
      }
      columns.forEach((col) => flexContainer.appendChild(col));

      // Wrap the flex container with a scrollable outer div for horizontal scrolling
      const scrollContainer = document.createElement("div");
      scrollContainer.style.overflowX = "auto";
      scrollContainer.style.width = "100%";
      scrollContainer.appendChild(flexContainer);

      filesContainer.appendChild(scrollContainer);
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
    folderBox.style.width = "55%";
    folderBox.style.right = "10%";
    folderBox.style.left = "";
  } else {
    treeContainer.style.display = "none";
    btn.textContent = "Show Tree";
    folderBox.style.width = "90%";
    folderBox.style.left = "5%";
    folderBox.style.right = "5%";
  }
}

// Call this function whenever a folder is opened to update the next/previous buttons
function updateNavigationButtons() {
  // Get all folders (the <li> elements in the tree)
  const folderList = Array.from(document.querySelectorAll("#root li"));
  const currentIndex = folderList.indexOf(currentFolderLi);
  const prevBtn = document.getElementById("prevFolderButton");
  const nextBtn = document.getElementById("nextFolderButton");

  if (prevBtn) {
    prevBtn.disabled = currentIndex <= 0;
  }
  if (nextBtn) {
    nextBtn.disabled =
      currentIndex === -1 || currentIndex >= folderList.length - 1;
  }
}

function navigateFolder(offset) {
  const folderList = Array.from(document.querySelectorAll("#root li"));
  const currentIndex = folderList.indexOf(currentFolderLi);
  const newIndex = currentIndex + offset;
  if (newIndex >= 0 && newIndex < folderList.length) {
    showFolderContents(folderList[newIndex]);
  }
}
