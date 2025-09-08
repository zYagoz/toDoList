// public/js/task-modal.js
document.addEventListener('DOMContentLoaded', function () {
  const editButtons = document.querySelectorAll('.btn-edit');
  const modal = document.getElementById('editTaskModal');
  const closeBtn = document.getElementById('closeTaskModal');
  const form = document.getElementById('editTaskForm');

  const nameInput = document.getElementById('taskNameInput');
  const descInput = document.getElementById('taskDescInput');
  const priorityInput = document.getElementById('taskPriorityInput');
  const dueInput = document.getElementById('taskDueInput');
  const saveBtn = document.getElementById('saveTaskBtn');

  const listId = document.body.dataset.listId;

  let originalName = '';
  let originalDesc = '';
  let originalPriority = 'medium';
  let originalDue = '';

  function toIsoDate(value) {
    if (!value) return '';
    value = value.toString().trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0,10);
    if (value.includes('/')) {
      const [d,m,y] = value.split('/');
      return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
    }
    const dt = new Date(value);
    return !isNaN(dt) ? dt.toISOString().slice(0,10) : '';
  }

  function openModal() {
    modal.style.display = 'flex';
    modal.classList.add('active');
    setTimeout(() => nameInput.focus(), 120);
  }
  function closeModal() {
    modal.style.display = 'none';
    modal.classList.remove('active');
  }

  function validateName() {
    const cur = nameInput.value.trim();
    const ok = (cur === '') || (cur.length >= 3);
    saveBtn.disabled = !ok;
  }

  form.addEventListener('submit', function () {
    if (nameInput.value.trim() === '') nameInput.value = originalName || '';
    if (descInput.value.trim() === '') descInput.value = originalDesc || '';
    if (!priorityInput.value) priorityInput.value = originalPriority || 'medium';
    if (!dueInput.value) dueInput.value = toIsoDate(originalDue) || '';
  });

  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const taskId = button.dataset.taskId;
      const taskName = button.dataset.taskName || '';
      const taskDesc = button.dataset.taskDesc || '';
      const taskPriority = button.dataset.taskPriority || 'medium';
      const taskDue = button.dataset.taskDue || '';

      // guarda originais
      originalName = taskName;
      originalDesc = taskDesc;
      originalPriority = taskPriority;
      originalDue = taskDue;

      // define placeholders
      nameInput.placeholder = taskName || 'Nome da tarefa';
      descInput.placeholder = taskDesc || 'Descrição da tarefa';
      dueInput.placeholder = toIsoDate(taskDue);

      // limpa campos para permitir digitar novos valores
      nameInput.value = '';
      descInput.value = '';
      priorityInput.value = taskPriority || 'medium';
    //   dueInput.value = ''; // usuário só altera se quiser

      if (descInput.value.trim() === '') descInput.value = originalDesc || '';

      form.action = `/lists/${listId}/tasks/update/${taskId}`;
      validateName();
      openModal();
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') closeModal(); });

  nameInput.addEventListener('input', validateName);
});
