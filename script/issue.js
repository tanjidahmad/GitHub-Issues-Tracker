const issuesContainer = document.getElementById("issuesContainer");
const spinner = document.getElementById("spinner");

let allIssues = [];

// LOAD ISSUES
async function loadIssues(){

    spinner.classList.remove("hidden");

    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await res.json();

    allIssues = data.data;

    displayIssues(allIssues);

    spinner.classList.add("hidden");
}

loadIssues();


// ISSUE COUNT
function updateIssueCount(count){
    document.getElementById("issueCount").innerText = count;
}


// DISPLAY ISSUES
function displayIssues(issues){

    issuesContainer.innerHTML = "";

    // update count
    updateIssueCount(issues.length);

    issues.forEach(issue => {

        const div = document.createElement("div");

        div.innerHTML = `
        <div onclick="loadIssueDetails(${issue.id})"
             class="card bg-white shadow-md border-t-4 ${issue.status === "open" ? "border-green-500" : "border-purple-500"}">

            <div class="card-body">

                <div class="flex justify-between">

                    <span class="badge ${issue.status==="open"?"badge-success":"badge-secondary"}">
                        ${issue.status}
                    </span>

                    <span class="badge border-none ${
                        issue.priority==="high"
                        ? "bg-red-100 text-red-600"
                        : issue.priority==="medium"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-200 text-gray-600"
                    }">
                        ${issue.priority.toUpperCase()}
                    </span>

                </div>

                <h2 class="card-title text-sm text-black h-10 overflow-hidden">
                            ${issue.title}
                                         </h2>

                <p class="text-xs text-gray-500 h-10 overflow-hidden">
                          ${issue.description.slice(0,80)}...
                                   </p>

                <div class="flex gap-2 mt-2">

                    ${
                        issue.labels.map(label => {

                            if(label === "bug"){
                                return `<span class="badge bg-red-100 text-red-600 border-none">${label.toUpperCase()}</span>`
                            }

                            if(label === "help wanted"){
                                return `<span class="badge bg-yellow-100 text-yellow-600 border-none">${label.toUpperCase()}</span>`
                            }

                            if(label === "enhancement"){
                                return `<span class="badge bg-green-100 text-green-600 border-none">${label.toUpperCase()}</span>`
                            }

                            if(label === "good first issue"){
                                return `<span class="badge bg-green-100 text-green-600 border-none">${label.toUpperCase()}</span>`
                            }

                            if(label === "documentation"){
                                return `<span class="badge bg-green-100 text-green-600 border-none">${label.toUpperCase()}</span>`
                            }

                            return `<span class="badge">${label}</span>`

                        }).join("")
                    }

                </div>

                <div class="text-xs text-gray-400 mt-3">
                    #${issue.id} by ${issue.author}
                    <br>
                    ${new Date(issue.createdAt).toLocaleDateString()}
                </div>

            </div>
        </div>
        `;

        issuesContainer.appendChild(div);
    });
}


// FILTER
function filterIssues(status){

    const allBtn = document.getElementById("allBtn");
    const openBtn = document.getElementById("openBtn");
    const closedBtn = document.getElementById("closedBtn");

    allBtn.classList.remove("btn-primary");
    openBtn.classList.remove("btn-primary");
    closedBtn.classList.remove("btn-primary");

    if(status === "all"){
        allBtn.classList.add("btn-primary");
        displayIssues(allIssues);
    }

    else if(status === "open"){
        openBtn.classList.add("btn-primary");
        const filtered = allIssues.filter(issue => issue.status === "open");
        displayIssues(filtered);
    }

    else if(status === "closed"){
        closedBtn.classList.add("btn-primary");
        const filtered = allIssues.filter(issue => issue.status === "closed");
        displayIssues(filtered);
    }
}


// SEARCH
async function searchIssues(){

    const text = document.getElementById("searchInput").value;

    const res = await fetch(
        `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`
    );

    const data = await res.json();

    displayIssues(data.data);
}


// MODAL
async function loadIssueDetails(id){

    const res = await fetch(
        `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
    );

    const data = await res.json();

    const issue = data.data;

    document.getElementById("modalTitle").innerText = issue.title;

    const statusEl = document.getElementById("modalStatus");

    statusEl.innerText = issue.status === "open" ? "Opened" : "Closed";

    statusEl.className =
        issue.status === "open"
        ? "badge bg-emerald-500 text-white border-none"
        : "badge bg-red-500 text-white border-none";

    document.getElementById("modalAuthor").innerText =
        `Opened by ${issue.author}`;

    document.getElementById("modalDate").innerText =
        new Date(issue.createdAt).toLocaleDateString();

    document.getElementById("modalDescription").innerText =
        issue.description;

    document.getElementById("modalAssignee").innerText =
        issue.assignee || "Not Assigned";

    const priorityEl = document.getElementById("modalPriority");

    priorityEl.innerText = issue.priority.toUpperCase();

    priorityEl.className =
        issue.priority === "high"
        ? "badge bg-red-500 text-white border-none"
        : issue.priority === "medium"
        ? "badge bg-yellow-400 text-black border-none"
        : "badge bg-gray-400 text-white border-none";

    const labelsContainer = document.getElementById("modalLabels");

    labelsContainer.innerHTML = "";

    issue.labels.forEach(label => {
        labelsContainer.innerHTML += `
            <span class="badge bg-yellow-400 text-black border-none">
                ${label.toUpperCase()}
            </span>
        `;
    });

    document.getElementById("issue_modal").showModal();
}