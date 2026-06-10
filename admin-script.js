// Default admin credentials
const DEFAULT_ADMIN = {
    username: 'admin',
    password: 'admin123'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        showAdminPanel(currentUser);
    } else {
        showLoginForm();
    }
    
    setupEventListeners();
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection(item.dataset.section);
        });
    });
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Projects
    const addProjectBtn = document.getElementById('addProjectBtn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => openProjectModal());
    }
    
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', handleAddProject);
    }
    
    // Project image preview
    const projectImage = document.getElementById('projectImage');
    if (projectImage) {
        projectImage.addEventListener('change', previewImage);
    }
    
    // Users
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', openUserModal);
    }
    
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', handleAddUser);
    }
    
    // Feedbacks
    const clearFeedbacksBtn = document.getElementById('clearFeedbacksBtn');
    if (clearFeedbacksBtn) {
        clearFeedbacksBtn.addEventListener('click', clearAllFeedbacks);
    }
}

// ===== LOGIN FUNCTIONS =====
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('loginError');
    
    // Get users from localStorage or use default
    let users = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    if (users.length === 0) {
        users = [DEFAULT_ADMIN];
    }
    
    // Check if user exists and password is correct
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', username);
        showAdminPanel(username);
        errorMsg.textContent = '';
    } else {
        errorMsg.textContent = '❌ Identifiants incorrects';
    }
}

function showLoginForm() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

function showAdminPanel(username) {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'flex';
    document.getElementById('userName').textContent = username;
    
    // Load data
    loadProjects();
    loadFeedbacks();
    loadUsers();
    
    // Initialize with first section
    switchSection('projets');
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    showLoginForm();
    document.getElementById('loginForm').reset();
}

// ===== SECTION SWITCHING =====
function switchSection(section) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Update active section
    document.querySelectorAll('.content-section').forEach(s => {
        s.classList.remove('active');
    });
    document.getElementById(`${section}Section`).classList.add('active');
    
    // Update title
    const titles = {
        projets: 'Gérer les Projets',
        feedbacks: 'Feedbacks des Visiteurs',
        utilisateurs: 'Gérer les Utilisateurs'
    };
    document.getElementById('sectionTitle').textContent = titles[section];
}

// ===== PROJECTS FUNCTIONS =====
function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const tbody = document.getElementById('projectsTableBody');
    tbody.innerHTML = '';
    
    if (projects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Aucun projet pour le moment</td></tr>';
        return;
    }
    
    projects.forEach((project, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${project.title}</td>
            <td>${project.description.substring(0, 50)}...</td>
            <td><img src="${project.image}" style="width: 50px; height: 50px; border-radius: 5px; object-fit: cover;"></td>
            <td>${new Date(project.date).toLocaleDateString('fr-FR')}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit btn-small" onclick="editProject(${index})">Éditer</button>
                    <button class="btn-delete btn-small" onclick="deleteProject(${index})">Supprimer</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openProjectModal(editIndex = null) {
    const modal = document.getElementById('projectModal');
    const form = document.getElementById('projectForm');
    const title = document.getElementById('projectModalTitle');
    
    if (editIndex !== null && editIndex !== undefined) {
        title.textContent = 'Éditer le Projet';
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const project = projects[editIndex];
        
        document.getElementById('projectTitle').value = project.title;
        document.getElementById('projectDescription').value = project.description;
        form.dataset.editIndex = editIndex;
        
        // Show image preview
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        previewImg.src = project.image;
        preview.style.display = 'flex';
    } else {
        title.textContent = 'Ajouter un Projet';
        form.reset();
        form.dataset.editIndex = '';
        document.getElementById('imagePreview').style.display = 'none';
    }
    
    modal.style.display = 'flex';
}

function closeProjectModal() {
    document.getElementById('projectModal').style.display = 'none';
}

function handleAddProject(e) {
    e.preventDefault();
    
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const imageInput = document.getElementById('projectImage');
    const form = e.target;
    const editIndex = form.dataset.editIndex;
    
    // Check if file is selected for new projects
    if (!editIndex && !imageInput.files[0]) {
        alert('⚠️ Veuillez sélectionner une image');
        return;
    }
    
    let projects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    const handleImageUpload = (imageData) => {
        if (editIndex !== '') {
            // Edit existing
            projects[parseInt(editIndex)] = {
                ...projects[parseInt(editIndex)],
                title,
                description,
                image: imageData || projects[parseInt(editIndex)].image
            };
        } else {
            // Add new
            projects.push({
                id: Date.now(),
                title,
                description,
                image: imageData,
                date: new Date().toISOString()
            });
        }
        
        localStorage.setItem('projects', JSON.stringify(projects));
        closeProjectModal();
        loadProjects();
        alert('✅ Projet enregistré avec succès!');
    };
    
    // Convert image to base64 if provided
    if (imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            handleImageUpload(e.target.result);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        handleImageUpload(null);
    }
}

function editProject(index) {
    openProjectModal(index);
}

function deleteProject(index) {
    if (confirm('❌ Êtes-vous sûr de vouloir supprimer ce projet?')) {
        let projects = JSON.parse(localStorage.getItem('projects') || '[]');
        projects.splice(index, 1);
        localStorage.setItem('projects', JSON.stringify(projects));
        loadProjects();
        alert('✅ Projet supprimé');
    }
}

function previewImage(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const preview = document.getElementById('imagePreview');
            const previewImg = document.getElementById('previewImg');
            previewImg.src = event.target.result;
            preview.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }
}

// ===== FEEDBACKS FUNCTIONS =====
function loadFeedbacks() {
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    const container = document.getElementById('feedbacksContainer');
    container.innerHTML = '';
    
    if (feedbacks.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Aucun feedback pour le moment</p>';
        return;
    }
    
    feedbacks.forEach((feedback, index) => {
        const card = document.createElement('div');
        card.className = 'feedback-card';
        card.innerHTML = `
            <div class="feedback-header">
                <div>
                    <div class="feedback-name">${feedback.name}</div>
                    <div class="feedback-email">📧 ${feedback.email}</div>
                </div>
                <div class="feedback-date">${new Date(feedback.date).toLocaleDateString('fr-FR')}</div>
            </div>
            <div class="feedback-message">"${feedback.message}"</div>
            <div class="feedback-actions">
                <button class="btn-delete btn-small" onclick="deleteFeedback(${index})">Supprimer</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function deleteFeedback(index) {
    if (confirm('Supprimer ce feedback?')) {
        let feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
        feedbacks.splice(index, 1);
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        loadFeedbacks();
        alert('✅ Feedback supprimé');
    }
}

function clearAllFeedbacks() {
    if (confirm('⚠️ Êtes-vous sûr de vouloir supprimer TOUS les feedbacks? Cette action est irréversible.')) {
        localStorage.setItem('feedbacks', '[]');
        loadFeedbacks();
        alert('✅ Tous les feedbacks ont été supprimés');
    }
}

// ===== USERS FUNCTIONS =====
function loadUsers() {
    let users = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    
    // Initialize with default admin if empty
    if (users.length === 0) {
        users = [DEFAULT_ADMIN];
        localStorage.setItem('adminUsers', JSON.stringify(users));
    }
    
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    users.forEach((user, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><code>${user.username}</code></td>
            <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Admin par défaut'}</td>
            <td>
                <div class="action-buttons">
                    ${user.username !== DEFAULT_ADMIN.username ? `
                        <button class="btn-delete btn-small" onclick="deleteUser(${index})">Supprimer</button>
                    ` : '<span style="color: var(--text-secondary);">👑 Admin principal</span>'}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openUserModal() {
    document.getElementById('userModal').style.display = 'flex';
    document.getElementById('userForm').reset();
}

function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
}

function handleAddUser(e) {
    e.preventDefault();
    
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    
    if (username.length < 3) {
        alert('⚠️ Le nom d\'utilisateur doit contenir au moins 3 caractères');
        return;
    }
    
    if (password.length < 5) {
        alert('⚠️ Le mot de passe doit contenir au moins 5 caractères');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.username === username)) {
        alert('⚠️ Cet utilisateur existe déjà');
        return;
    }
    
    users.push({
        username,
        password,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('adminUsers', JSON.stringify(users));
    closeUserModal();
    loadUsers();
    alert('✅ Admin créé avec succès!');
}

function deleteUser(index) {
    if (confirm('❌ Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
        let users = JSON.parse(localStorage.getItem('adminUsers') || '[]');
        users.splice(index, 1);
        localStorage.setItem('adminUsers', JSON.stringify(users));
        loadUsers();
        alert('✅ Utilisateur supprimé');
    }
}

// Close modals on background click
window.addEventListener('click', (e) => {
    const projectModal = document.getElementById('projectModal');
    const userModal = document.getElementById('userModal');
    
    if (e.target === projectModal) {
        projectModal.style.display = 'none';
    }
    if (e.target === userModal) {
        userModal.style.display = 'none';
    }
});