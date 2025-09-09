// public/js/task-modal.js
document.addEventListener('DOMContentLoaded', function () {
  const editButtons = document.querySelectorAll('.btn-edit');
  const modal = document.getElementById('editTaskModal');
  const closeBtn = document.getElementById('closeTaskModal');
  const form = document.getElementById('editTaskForm');

  const nameInput = document.getElementById('taskNameInput');
  const descInput = document.getElementById('taskDescInput'); // textarea
  const priorityInput = document.getElementById('taskPriorityInput');
  const dueInput = document.getElementById('taskDueInput');
  const saveBtn = document.getElementById('saveTaskBtn');

  const listId = document.body.dataset.listId || '';

  let originalName = '';
  let originalDesc = '';
  let originalPriority = 'medium';
  let originalDue = '';

  function toIsoDate(value) {
    if (value === undefined || value === null) return '';
    let v = String(value).trim();
    if (!v) return '';
    const isoMatch = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
    let dm = v.match(/^(\d{1,2})[\/\.\-](\d{1,2})[\/\.\-](\d{2,4})$/);
    if (dm) {
      let d = dm[1].padStart(2,'0'), m = dm[2].padStart(2,'0'), y = dm[3];
      if (y.length === 2) y = (parseInt(y,10) > 50 ? '19' + y : '20' + y);
      return `${y}-${m}-${d}`;
    }
    if (/^\d{10,13}$/.test(v)) {
      const ts = parseInt(v,10);
      const dt = new Date(ts);
      if (!isNaN(dt)) return dt.toISOString().slice(0,10);
    }
    const dt = new Date(v);
    if (!isNaN(dt)) return dt.toISOString().slice(0,10);
    const nums = v.match(/\d+/g);
    if (nums && nums.length >= 3) {
      let yearIdx = nums.findIndex(n => n.length === 4);
      if (yearIdx !== -1) {
        const y = nums[yearIdx];
        const others = nums.filter((_, i) => i !== yearIdx);
        const d = others[0].padStart(2,'0');
        const m = others[1] ? others[1].padStart(2,'0') : '01';
        return `${y}-${m}-${d}`;
      } else {
        let [a,b,c] = nums;
        if (c) {
          let d = a.padStart(2,'0'), m = b.padStart(2,'0'), y = c.length === 2 ? ('20' + c) : c;
          return `${y}-${m}-${d}`;
        }
      }
    }
    return '';
  }

  function openModal() {
    if (!modal) return;
    modal.style.display = 'flex';
    modal.classList.add('active');
    setTimeout(() => { if (nameInput) nameInput.focus(); }, 120);
  }
  function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
    modal.classList.remove('active');
  }

  function validateName() {
    if (!saveBtn || !nameInput) return;
    const cur = nameInput.value.trim();
    const ok = (cur === '') || (cur.length >= 3);
    saveBtn.disabled = !ok;
  }

  if (form) {
    form.addEventListener('submit', function () {
      if (nameInput && nameInput.value.trim() === '') nameInput.value = originalName || '';
      // aqui mantemos a lógica: se textarea vazio, reaplica originalDesc
      if (descInput && descInput.value.trim() === '') descInput.value = originalDesc || '';
      if (priorityInput && !priorityInput.value) priorityInput.value = originalPriority || 'medium';
      if (dueInput && !dueInput.value) {
        const iso = toIsoDate(originalDue);
        if (iso) dueInput.value = iso;
      }
    });
  }

  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const taskId = button.dataset.taskId;
      const taskName = button.dataset.taskName || '';
      const taskDesc = button.dataset.taskDesc || '';
      const taskPriority = button.dataset.taskPriority || 'medium';
      let taskDue = (button.dataset.taskDue || '').toString().trim();

      if (!taskDue) {
        const card = button.closest('.task-card');
        if (card) taskDue = (card.dataset.taskDue || card.getAttribute('data-task-due') || '').toString().trim();
      }
      if (!taskDue) {
        const card = button.closest('.task-card');
        const dueEl = card ? card.querySelector('.due-date') : null;
        if (dueEl) {
          const raw = (dueEl.textContent || dueEl.innerText || '').toString().trim();
          taskDue = raw.replace(/[^\d\/\-\.\s]/g, '').trim();
        }
      }

      originalName = taskName;
      originalDesc = taskDesc;
      originalPriority = taskPriority;
      originalDue = taskDue;

      // coloca value da data em ISO (para input[type=date] exibir)
      if (dueInput) {
        const isoDue = toIsoDate(taskDue);
        dueInput.value = isoDue || '';
      }

      // placeholders: mantemos placeholder preenchido com valores atuais
      if (nameInput) {
        nameInput.placeholder = taskName || 'Nome da tarefa';
        nameInput.value = '';
      }
      if (descInput) {
        descInput.placeholder = taskDesc || 'Descrição da tarefa';
        // NÃO atribuímos descInput.value = originalDesc aqui — manter vazio para mostrar placeholder
        descInput.value = taskDesc;
      }

      if (priorityInput) priorityInput.value = taskPriority || 'medium';

      if (form && listId && taskId) form.action = `/lists/${listId}/tasks/update/${taskId}`;

      validateName();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') closeModal(); });

  if (nameInput) nameInput.addEventListener('input', validateName);
});
