/* ===================== Project Manager – Frontend ===================== */
const API = '/api/projects';

const statusLabels = {
  'pending': 'Pendiente',
  'in-progress': 'En progreso',
  'completed': 'Completado',
  'on-hold': 'En pausa',
  'cancelled': 'Cancelado',
};

const priorityLabels = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Crítica',
};

// ── DOM refs ─────────────────────────────────────────────────────────────────
const searchInput     = document.getElementById('searchInput');
const filterStatus    = document.getElementById('filterStatus');
const filterPriority  = document.getElementById('filterPriority');
const newProjectBtn   = document.getElementById('newProjectBtn');
const projectsGrid    = document.getElementById('projectsGrid');
const statsEl         = document.getElementById('stats');

// Form modal
const modalOverlay    = document.getElementById('modalOverlay');
const modalTitle      = document.getElementById('modalTitle');
const projectForm     = document.getElementById('projectForm');
const projectId       = document.getElementById('projectId');
const projectName     = document.getElementById('projectName');
const projectDesc     = document.getElementById('projectDescription');
const projectStatus   = document.getElementById('projectStatus');
const projectPriority = document.getElementById('projectPriority');
const projectDueDate  = document.getElementById('projectDueDate');
const formError       = document.getElementById('formError');
const cancelBtn       = document.getElementById('cancelBtn');

// Delete modal
const deleteOverlay      = document.getElementById('deleteOverlay');
const deleteProjectName  = document.getElementById('deleteProjectName');
const cancelDeleteBtn    = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn   = document.getElementById('confirmDeleteBtn');

let pendingDeleteId = null;
let debounceTimer   = null;

// ── API helpers ──────────────────────────────────────────────────────────────
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error inesperado');
  return data;
}

// ── Load & render projects ───────────────────────────────────────────────────
async function loadProjects() {
  const params = new URLSearchParams();
  const search   = searchInput.value.trim();
  const status   = filterStatus.value;
  const priority = filterPriority.value;
  if (search)   params.set('search',   search);
  if (status)   params.set('status',   status);
  if (priority) params.set('priority', priority);

  const url = `${API}?${params}`;
  let projects;
  try {
    projects = await apiFetch(url);
  } catch {
    projectsGrid.innerHTML = '<p class="empty-state">Error al cargar proyectos.</p>';
    return;
  }

  renderStats(projects);
  renderProjects(projects);
}

function renderStats(projects) {
  const total      = projects.length;
  const inProgress = projects.filter(p => p.status === 'in-progress').length;
  const completed  = projects.filter(p => p.status === 'completed').length;
  const pending    = projects.filter(p => p.status === 'pending').length;

  statsEl.innerHTML = `
    <div class="stat-card"><div class="stat-value">${total}</div><div class="stat-label">Total</div></div>
    <div class="stat-card"><div class="stat-value">${pending}</div><div class="stat-label">Pendientes</div></div>
    <div class="stat-card"><div class="stat-value">${inProgress}</div><div class="stat-label">En progreso</div></div>
    <div class="stat-card"><div class="stat-value">${completed}</div><div class="stat-label">Completados</div></div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderProjects(projects) {
  if (!projects.length) {
    projectsGrid.innerHTML = '<p class="empty-state">No hay proyectos. ¡Crea el primero!</p>';
    return;
  }

  projectsGrid.innerHTML = projects.map(p => {
    const dueDateStr = p.due_date
      ? `📅 ${new Date(p.due_date + 'T00:00:00').toLocaleDateString('es-ES')}`
      : '';
    const createdStr = new Date(p.created_at).toLocaleDateString('es-ES');
    return `
      <article class="project-card priority-${p.priority}" data-id="${p.id}">
        <div class="card-header">
          <h3 class="card-title">${escapeHtml(p.name)}</h3>
          <div class="card-actions">
            <button class="icon-btn edit-btn" title="Editar" data-id="${p.id}">✏️</button>
            <button class="icon-btn delete-btn" title="Eliminar" data-id="${p.id}">🗑️</button>
          </div>
        </div>
        ${p.description ? `<p class="card-description">${escapeHtml(p.description)}</p>` : ''}
        <div class="card-meta">
          <span class="badge badge-${p.status}">${statusLabels[p.status] || p.status}</span>
          <span class="badge badge-${p.priority}">${priorityLabels[p.priority] || p.priority}</span>
        </div>
        <div class="card-footer">
          <span class="card-date">${dueDateStr || `Creado: ${createdStr}`}</span>
        </div>
      </article>
    `;
  }).join('');
}

// ── Modal helpers ────────────────────────────────────────────────────────────
function openCreateModal() {
  modalTitle.textContent = 'Nuevo Proyecto';
  projectId.value = '';
  projectName.value = '';
  projectDesc.value = '';
  projectStatus.value = 'pending';
  projectPriority.value = 'medium';
  projectDueDate.value = '';
  formError.hidden = true;
  modalOverlay.hidden = false;
  projectName.focus();
}

function openEditModal(project) {
  modalTitle.textContent = 'Editar Proyecto';
  projectId.value = project.id;
  projectName.value = project.name;
  projectDesc.value = project.description || '';
  projectStatus.value = project.status;
  projectPriority.value = project.priority;
  projectDueDate.value = project.due_date || '';
  formError.hidden = true;
  modalOverlay.hidden = false;
  projectName.focus();
}

function closeModal() {
  modalOverlay.hidden = true;
}

// ── Form submit ──────────────────────────────────────────────────────────────
projectForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.hidden = true;

  const payload = {
    name:        projectName.value.trim(),
    description: projectDesc.value.trim() || null,
    status:      projectStatus.value,
    priority:    projectPriority.value,
    due_date:    projectDueDate.value || null,
  };

  try {
    const id = projectId.value;
    if (id) {
      await apiFetch(`${API}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      await apiFetch(API, { method: 'POST', body: JSON.stringify(payload) });
    }
    closeModal();
    await loadProjects();
  } catch (err) {
    formError.textContent = err.message;
    formError.hidden = false;
  }
});

// ── Delete flow ──────────────────────────────────────────────────────────────
function openDeleteModal(id, name) {
  pendingDeleteId = id;
  deleteProjectName.textContent = `"${name}"`;
  deleteOverlay.hidden = false;
}

cancelDeleteBtn.addEventListener('click', () => {
  deleteOverlay.hidden = true;
  pendingDeleteId = null;
});

confirmDeleteBtn.addEventListener('click', async () => {
  if (!pendingDeleteId) return;
  try {
    await apiFetch(`${API}/${pendingDeleteId}`, { method: 'DELETE' });
  } catch { /* ignore */ }
  deleteOverlay.hidden = true;
  pendingDeleteId = null;
  await loadProjects();
});

// ── Event delegation for card buttons ────────────────────────────────────────
projectsGrid.addEventListener('click', async (e) => {
  const editBtn   = e.target.closest('.edit-btn');
  const deleteBtn = e.target.closest('.delete-btn');

  if (editBtn) {
    const id = editBtn.dataset.id;
    try {
      const project = await apiFetch(`${API}/${id}`);
      openEditModal(project);
    } catch { /* ignore */ }
  }

  if (deleteBtn) {
    const card = deleteBtn.closest('.project-card');
    const name = card.querySelector('.card-title').textContent;
    openDeleteModal(deleteBtn.dataset.id, name);
  }
});

// ── Toolbar events ───────────────────────────────────────────────────────────
newProjectBtn.addEventListener('click', openCreateModal);
cancelBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

deleteOverlay.addEventListener('click', (e) => {
  if (e.target === deleteOverlay) {
    deleteOverlay.hidden = true;
    pendingDeleteId = null;
  }
});

searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(loadProjects, 300);
});
filterStatus.addEventListener('change', loadProjects);
filterPriority.addEventListener('change', loadProjects);

// ── Keyboard: close modals on Escape ────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!modalOverlay.hidden) closeModal();
    if (!deleteOverlay.hidden) {
      deleteOverlay.hidden = true;
      pendingDeleteId = null;
    }
  }
});

// ── Init ─────────────────────────────────────────────────────────────────────
loadProjects();
