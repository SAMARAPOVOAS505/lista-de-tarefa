const tbody = document.querySelector('tbody');
const addForm = document.querySelector('.add-form');
const inputTask = document.querySelector('.input-task');

const getApiBase = () => {
  const p = new URLSearchParams(location.search).get('api'); 
  if (p) return p.replace(/\/$/, '');
  const meta = document.querySelector('meta[name="api-base"]');
  if (meta?.content) return meta.content.replace(/\/$/, '');
  if (location.port === '8080') return location.origin;       
  return 'http://localhost:8080';                           
};
const API = getApiBase();
const jsonFetch = (url, opts = {}) =>
  fetch(`${API}${url}`, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });

const fetchTasks = async () => (await (await jsonFetch('/tasks')).json());

const addTask = async (event) => {
  event.preventDefault();
  if (!inputTask.value.trim()) return;
  await jsonFetch('/tasks', { method: 'POST', body: JSON.stringify({ title: inputTask.value }) });
  inputTask.value = '';
  loadTasks();
};

const deleteTask = async (id) => {
  await jsonFetch(`/tasks/${id}`, { method: 'DELETE' });
  loadTasks();
};

const updateTask = async ({ id, title, status }) => {
  await jsonFetch(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify({ title, status }) });
  loadTasks();
};

const formatDate = (dateUTC) => new Date(dateUTC).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' });

const createElement = (tag, innerText = '', innerHTML = '') => {
  const el = document.createElement(tag);
  if (innerText) el.innerText = innerText;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
};

const createSelect = (value) => {
  const select = createElement('select', '', `
    <option value="pendente">pendente</option>
    <option value="em andamento">em andamento</option>
    <option value="concluída">concluída</option>
  `);
  select.value = value;
  return select;
};

const createRow = (task) => {
  const { id, title, created_at, status } = task;
  const tr = createElement('tr');
  const tdTitle = createElement('td', title);
  const tdCreatedAt = createElement('td', formatDate(created_at));
  const tdStatus = createElement('td');
  const tdActions = createElement('td');

  const select = createSelect(status);
  select.addEventListener('change', ({ target }) => updateTask({ ...task, status: target.value }));

  const editButton = createElement('button', '', '<span class="material-symbols-outlined">edit</span>');
  const deleteButton = createElement('button', '', '<span class="material-symbols-outlined">delete</span>');

  const editForm = createElement('form');
  const editInput = createElement('input');
  editInput.value = title;
  editForm.appendChild(editInput);
  editForm.addEventListener('submit', (e) => { e.preventDefault(); updateTask({ id, title: editInput.value, status }); });

  editButton.addEventListener('click', () => { tdTitle.innerText = ''; tdTitle.appendChild(editForm); });
  editButton.classList.add('btn-action');
  deleteButton.classList.add('btn-action');
  deleteButton.addEventListener('click', () => deleteTask(id));

  tdStatus.appendChild(select);
  tdActions.appendChild(editButton);
  tdActions.appendChild(deleteButton);

  tr.append(tdTitle, tdCreatedAt, tdStatus, tdActions);
  return tr;
};

const loadTasks = async () => {
  const tasks = await fetchTasks();
  tbody.innerHTML = '';
  tasks.forEach((t) => tbody.appendChild(createRow(t)));
};

addForm.addEventListener('submit', addTask);
loadTasks();