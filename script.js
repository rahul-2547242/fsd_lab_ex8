document.addEventListener("DOMContentLoaded", () => {
    const projectsTable = document.getElementById("projects-table");
    const projectForm = document.getElementById("project-form");
    const cancelBtn = document.getElementById("cancel-btn");
    const formTitle = document.getElementById("form-title");

    let editingId = null;

    // Load projects
    function loadProjects() {
        fetch("http://localhost:3000/projects")
            .then((res) => res.json())
            .then((projects) => {
                projectsTable.innerHTML = projects
                    .map(
                        (project) => `
                    <tr class="border-t">
                        <td class="px-4 py-2">${project.project_id}</td>
                        <td class="px-4 py-2">${project.title}</td>
                        <td class="px-4 py-2">
                            <span class="px-2 py-1 rounded-full text-xs 
                                ${project.status === "Completed"
                                ? "bg-green-200 text-green-800"
                                : project.status === "Ongoing"
                                    ? "bg-blue-200 text-blue-800"
                                    : "bg-yellow-200 text-yellow-800"
                            }">
                                ${project.status}
                            </span>
                        </td>
                        <td class="px-4 py-2 space-x-2">
                            <button onclick="editProject(${project.project_id
                            })" class="text-blue-500">Edit</button>
                            <button onclick="deleteProject(${project.project_id
                            })" class="text-red-500">Delete</button>
                        </td>
                    </tr>
                `
                    )
                    .join("");
            });
    }

    // Form submit handler
    projectForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const project = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            status: document.getElementById("status").value,
            leader_name: document.getElementById("leader_name").value,
        };

        if (editingId) {
            // Include the project_id in the update
            project.project_id = parseInt(editingId);

            fetch(`http://localhost:3000/projects/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(project),
            }).then(() => {
                resetForm();
                loadProjects();
            });
        } else {
            fetch("http://localhost:3000/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(project),
            }).then(() => {
                resetForm();
                loadProjects();
            });
        }
    });

    // Cancel button handler
    cancelBtn.addEventListener("click", resetForm);

    // Reset form
    function resetForm() {
        projectForm.reset();
        editingId = null;
        formTitle.textContent = "Add New Project";
    }

    // Load projects on page load
    loadProjects();
});

// Edit project (global function)
function editProject(id) {
    fetch(`http://localhost:3000/projects/${id}`)
        .then((res) => res.json())
        .then((project) => {
            document.getElementById("project-id").value = project.project_id;
            document.getElementById("title").value = project.title;
            document.getElementById("description").value = project.description;
            document.getElementById("status").value = project.status;
            document.getElementById("leader_name").value = project.leader_name;

            document.getElementById("form-title").textContent = "Edit Project";
            window.editingId = project.project_id;
        });
}

// Delete project (global function)
function deleteProject(id) {
    if (confirm("Are you sure you want to delete this project?")) {
        fetch(`http://localhost:3000/projects/${id}`, { method: "DELETE" }).then(
            () => window.location.reload()
        );
    }
}
