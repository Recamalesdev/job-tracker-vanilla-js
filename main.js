// ==========================================
// 1. GLOBAL VARIABLES & STATE
// ==========================================
const companyNameInput = document.getElementById("company-name");
const userRoleInput = document.getElementById("job-role");
const jobStatusSelect = document.getElementById("job-status");
const submitBtn = document.getElementById("submit-btn");
const statusMessage = document.getElementById("status-message");
const jobLisUI = document.getElementById("job-list");
const totalCount = document.getElementById("job-count");
const searchInput = document.getElementById("search-input");

// Load jobs from local storage or initialize empty array
let jobsList = JSON.parse(localStorage.getItem("myJobs")) || [];

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

// Clear status messages after 3 seconds
const clearMessage = () => {
  setTimeout(() => {
    statusMessage.textContent = "";
  }, 3000);
};

// Render the jobs list to the DOM
const renderJobs = (list = jobsList) => {
  // 1. Clear current UI list to prevent duplicates
  jobLisUI.innerHTML = "";

  totalCount.textContent = list.length;

  // 2. Iterate over the jobs array
  list.forEach((job, index) => {
    // 3. MAIN CONTAINER: Create the <li> wrapper card
    const li = document.createElement("li");
    li.classList.add("job-card");

    // Map status value to readable string
    let statusText = "";
    if (job.status === "1") statusText = "Enviado";
    if (job.status === "2") statusText = "Entrevista";
    if (job.status === "3") statusText = "Rechazado";

    // 4. TEXT: Create <div> for job details
    const text = document.createElement("div");
    text.classList.add("job-details");
    text.innerHTML = `
  <span><strong>Empresa:</strong> ${job.company}</span>
  <span><strong>Puesto:</strong> ${job.role}</span>
  <span><strong>Estado:</strong> ${statusText}</span>
`;

    // 5. BUTTON: Create the delete button element
    const btnDelete = document.createElement("button");
    btnDelete.textContent = "❌";
    btnDelete.classList.add("delete-btn");

    // 6. EVENT LISTENER: Attach click event
    btnDelete.addEventListener("click", () => deleteJob(job.id));

    // 7. ASSEMBLY: Append text and button inside the <li> wrapper
    li.appendChild(text);
    li.appendChild(btnDelete);

    // 8. DELIVERY: Mount the complete <li> to the <ul> in the DOM
    jobLisUI.appendChild(li);
  });
};

// Delete a job by index and update state
const deleteJob = (id) => {
  // 1. Remove the item using its index
  jobsList = jobsList.filter((job) => job.id !== id);

  // 2. Update local storage to persist changes
  localStorage.setItem("myJobs", JSON.stringify(jobsList));

  // 3. Re-render the UI with the updated list
  searchInput.value = "";
  renderJobs();
};

// ==========================================
// 3. INITIALIZATION
// ==========================================
renderJobs(); // Initial render on load

// ==========================================
// 4. EVENT LISTENERS
// ==========================================
submitBtn.addEventListener("click", (event) => {
  event.preventDefault();

  // Guard Clause: Handle the error edge case first
  if (
    companyNameInput.value.trim() === "" ||
    userRoleInput.value.trim() === ""
  ) {
    statusMessage.textContent = "📢 Por favor, escribe todos tus datos...";
    statusMessage.style.color = "red";
    clearMessage();
    return; // Early return stops execution here. No 'else' block needed.
  }

  // Success scenario: This only runs if the inputs are valid
  statusMessage.innerText = `✅  ${companyNameInput.value}, postulación guardada.`;
  statusMessage.style.color = "#f1f5f9";

  // Create new job object with a unique national identity card
  const newJob = {
    id: self.crypto.randomUUID(), // Generates a unique and unrepeatable ID such as: "123e4567-e89b-12d3-a456-426614174000"
    company: companyNameInput.value,
    role: userRoleInput.value,
    status: jobStatusSelect.value,
  };

  jobsList = [...jobsList, newJob]; // Save to memory
  localStorage.setItem("myJobs", JSON.stringify(jobsList)); // Persist to disk

  renderJobs(); // Re-render UI

  // Reset form inputs
  companyNameInput.value = "";
  userRoleInput.value = "";
  jobStatusSelect.value = "1";
  clearMessage();
});

// A dedicated function for filtering logic
const getFilteredJobs = (searchText) => {
  const query = searchText.toLowerCase();
  return jobsList.filter((job) => {
    return (
      job.company.toLowerCase().includes(query) ||
      job.role.toLowerCase().includes(query)
    );
  });
};

// Simplified Event Listener
searchInput.addEventListener("input", (event) => {
  const filtered = getFilteredJobs(event.target.value);
  renderJobs(filtered);
});
