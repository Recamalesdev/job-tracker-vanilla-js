// ==========================================
// 1. STATE & SELECTORS
// ==========================================
const companyNameInput = document.getElementById("company-name");
const userRoleInput = document.getElementById("job-role");
const jobStatusSelect = document.getElementById("job-status");
const submitBtn = document.getElementById("submit-btn");
const statusMessage = document.getElementById("status-message");
const jobListUI = document.getElementById("job-list");
const totalCount = document.getElementById("job-count");
const searchInput = document.getElementById("search-input");

// Editing state: stores the ID of the job being updated, or null if creating new
let editingId = null;
let jobsList = JSON.parse(localStorage.getItem("myJobs")) || [];

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

const clearMessage = () => {
  setTimeout(() => {
    statusMessage.textContent = "";
  }, 3000);
};

// UI Logic: Renders the provided list to the DOM
const renderJobs = (list = jobsList) => {
  jobListUI.innerHTML = "";
  totalCount.textContent = list.length;

  list.forEach((job) => {
    const li = document.createElement("li");
    li.classList.add("job-card");

    // Status mapping for better UX
    let statusText = "";
    if (job.status === "1") statusText = "Applied";
    if (job.status === "2") statusText = "Interviewing";
    if (job.status === "3") statusText = "Rejected";

    const text = document.createElement("div");
    text.classList.add("job-details");
    text.innerHTML = `
      <span><strong>Company:</strong> ${job.company}</span>
      <span><strong>Position:</strong> ${job.role}</span>
      <span><strong>Status:</strong> ${statusText}</span>
    `;

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Editar";
    btnEdit.classList.add("edit-btn");
    btnEdit.addEventListener("click", () => prepareEdit(job.id));

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Eliminar";
    btnDelete.classList.add("delete-btn");
    btnDelete.addEventListener("click", () => deleteJob(job.id));

    actions.appendChild(btnEdit);
    actions.appendChild(btnDelete);

    li.appendChild(text);
    li.appendChild(actions);
    jobListUI.appendChild(li);
  });
};

// Populates inputs with existing data to enable editing
const prepareEdit = (id) => {
  const foundJob = jobsList.find((item) => item.id === id);
  if (!foundJob) return;

  companyNameInput.value = foundJob.company;
  userRoleInput.value = foundJob.role;
  jobStatusSelect.value = foundJob.status;

  editingId = id; // Set editing mode

  submitBtn.textContent = "Actualizar";
  submitBtn.style.backgroundColor = "#fbbf24";
};

const deleteJob = (id) => {
  jobsList = jobsList.filter((job) => job.id !== id);
  saveAndRender();
};

// Persistence & Synchronization
const saveAndRender = () => {
  localStorage.setItem("myJobs", JSON.stringify(jobsList));
  renderJobs();
};

// ==========================================
// 3. INITIALIZATION
// ==========================================
renderJobs();

// ==========================================
// 4. EVENT LISTENERS
// ==========================================
submitBtn.addEventListener("click", (event) => {
  event.preventDefault();

  // Basic validation
  if (!companyNameInput.value.trim() || !userRoleInput.value.trim()) {
    statusMessage.textContent = "📢 Please fill out all fields.";
    statusMessage.style.color = "red";
    clearMessage();
    return;
  }

  if (editingId) {
    // --- UPDATE MODE ---
    jobsList = jobsList.map((job) => {
      if (job.id === editingId) {
        return {
          ...job,
          company: companyNameInput.value,
          role: userRoleInput.value,
          status: jobStatusSelect.value,
        };
      }
      return job;
    });

    statusMessage.innerText = "✅ Empleo actualizado..";
    editingId = null; // Reset editing mode
    submitBtn.textContent = "Guardar";
    submitBtn.style.backgroundColor = "";
  } else {
    // --- CREATE MODE ---
    const newJob = {
      id: self.crypto.randomUUID(), // Pro way to generate unique IDs
      company: companyNameInput.value,
      role: userRoleInput.value,
      status: jobStatusSelect.value,
    };
    jobsList = [...jobsList, newJob];
    statusMessage.innerText = "✅ Empleo guardado.";
  }

  saveAndRender();

  // Clear form
  companyNameInput.value = "";
  userRoleInput.value = "";
  jobStatusSelect.value = "1";
  clearMessage();
});

// Search functionality
searchInput.addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase();
  const filtered = jobsList.filter(
    (job) =>
      job.company.toLowerCase().includes(query) ||
      job.role.toLowerCase().includes(query),
  );
  renderJobs(filtered);
});
