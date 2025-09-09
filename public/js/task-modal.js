// public/js/task-modal.js
// const { format } = window.dateFns;


document.addEventListener('DOMContentLoaded', function () {
  const editButtons = document.querySelectorAll('.btn-edit');
  const modal = document.getElementById('editTaskModal');
  const closeBtn = document.getElementById('closeTaskModal');
  const form = document.getElementById('editTaskForm');

  const nameInput = document.getElementById('taskNameInput');
  const descInput = document.getElementById('taskDescInput'); // textarea
  const priorityInput = document.getElementById('taskPriorityInput');
  const dueInput = document.getElementById('taskDueInput'); // input[type="date"]
  const saveBtn = document.getElementById('saveTaskBtn');

  const listId = document.body.dataset.listId || '';

  let originalName = '';
  let originalDesc = '';
  let originalPriority = 'medium';
  let originalDue = '';   // string original da task (como veio)
  let dueChanged = false; // flag opcional se usuário mexeu na data

  // formata Date -> 'yyyy-MM-dd'
  function formatDateToIso(dt) {
    if (!(dt instanceof Date) || isNaN(dt)) return '';
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const d = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // tenta parsear vários formatos e retorna Date ou null
  function parseToDate(value) {
    if (value === undefined || value === null) return null;
    let v = String(value).trim();
    if (!v) return null;

    // ISO (YYYY-MM-DD or starts with)
    if (/^\d{4}-\d{2}-\d{2}/.test(v)) {
      // garantir T00:00:00 para evitar timezone madness
      const dt = new Date(v.indexOf('T') === -1 ? `${v}T00:00:00` : v);
      if (!isNaN(dt)) return dt;
    }

    // dd/mm/yyyy
    let dm = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    if (dm) {
      const d = parseInt(dm[1],10);
      const m = parseInt(dm[2],10) - 1;
      let y = dm[3];
      if (y.length === 2) y = (parseInt(y,10) > 50 ? '19' + y : '20' + y);
      const dt = new Date(Number(y), m, d);
      if (!isNaN(dt)) return dt;
    }

    // dd-mm-yyyy or dd.mm.yyyy
    dm = v.match(/^(\d{1,2})[-\.](\d{1,2})[-\.](\d{2,4})$/);
    if (dm) {
      const d = parseInt(dm[1],10);
      const m = parseInt(dm[2],10) - 1;
      let y = dm[3];
      if (y.length === 2) y = (parseInt(y,10) > 50 ? '19' + y : '20' + y);
      const dt = new Date(Number(y), m, d);
      if (!isNaN(dt)) return dt;
    }

    // timestamp ms
    if (/^\d{10,13}$/.test(v)) {
      const dt = new Date(parseInt(v,10));
      if (!isNaN(dt)) return dt;
    }

    // fallback Date.parse
    const dt = new Date(v);
    if (!isNaN(dt)) return dt;

    // última tentativa: extrair números e assumir dd mm yyyy
    const nums = v.match(/\d+/g);
    if (nums && nums.length >= 3) {
      const yearIdx = nums.findIndex(n => n.length === 4);
      if (yearIdx !== -1) {
        const y = parseInt(nums[yearIdx],10);
        const others = nums.filter((_,i) => i !== yearIdx);
        const d = parseInt(others[0],10);
        const m = parseInt(others[1] || 1,10) - 1;
        const dt2 = new Date(y, m, d);
        if (!isNaN(dt2)) return dt2;
      } else {
        const d = parseInt(nums[0],10);
        const m = parseInt(nums[1],10) - 1;
        let y = nums[2];
        y = y.length === 2 ? ('20' + y) : y;
        const dt3 = new Date(parseInt(y,10), m, d);
        if (!isNaN(dt3)) return dt3;
      }
    }
    return null;
  }

  function openModal() {
    if (!modal) return;
    modal.style.display = 'flex';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => { if (nameInput) nameInput.focus(); }, 120);
  }
  function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    dueChanged = false;
  }

  function validateName() {
    if (!saveBtn || !nameInput) return;
    const cur = nameInput.value.trim();
    const ok = (cur === '') || (cur.length >= 3);
    saveBtn.disabled = !ok;
  }

  // garantir formato ISO antes do submit — usar o valor real do input (selecionado pelo usuário)
  if (form) {
    form.addEventListener('submit', function () {
      if (dueInput) {
        const selected = (dueInput.value || '').toString().trim();
        if (selected) {
          // normalmente selected já vem 'YYYY-MM-DD' after user picks a date in control
          // mas parse e formatamos para garantir consistência
          let dt = null;
          if (/^\d{4}-\d{2}-\d{2}$/.test(selected)) {
            dt = new Date(selected + 'T00:00:00');
            if (isNaN(dt)) dt = parseToDate(selected);
          } else {
            dt = parseToDate(selected);
          }
          if (dt && !isNaN(dt)) {
            dueInput.value = formatDateToIso(dt); // keep user's chosen date
          } else {
            // se por algum motivo a selected value não parseou, tentamos original
            const odt = parseToDate(originalDue);
            dueInput.value = odt ? formatDateToIso(odt) : '';
          }
        } else {
          // se input estiver vazio (usuário removeu), reaplicar original (caso exista)
          const odt = parseToDate(originalDue);
          dueInput.value = odt ? formatDateToIso(odt) : '';
        }
      }

      // name / desc / priority: manter originais caso usuário não preencha novo valor
      if (nameInput && nameInput.value.trim() === '') nameInput.value = originalName || '';
      if (descInput && descInput.value.trim() === '') descInput.value = originalDesc || '';
      if (priorityInput && !priorityInput.value) priorityInput.value = originalPriority || 'medium';
      // formulário segue o envio normal
    });
  }

  // detectar mudança do usuário na data (opcional, mas útil)
  if (dueInput) {
    dueInput.addEventListener('input', function () {
      dueChanged = true;
    });
  }

  // popula modal
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const taskId = button.dataset.taskId;
      const taskName = button.dataset.taskName || '';
      const taskDesc = button.dataset.taskDesc || '';
      const taskPriority = button.dataset.taskPriority || 'medium';
      let taskDue = (button.dataset.taskDue || '').toString().trim();

      // fallback: procurar no .task-card
      if (!taskDue) {
        const card = button.closest('.task-card');
        if (card) taskDue = (card.dataset.taskDue || card.getAttribute('data-task-due') || '').toString().trim();
      }
      // fallback: pegar texto visível da .due-date
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
      originalDue = taskDue; // guardamos a string original

      // IMPORTANT: setar value do input date para a data da task (ISO) — o usuário verá a data selecionada
      if (dueInput) {
        const dt = parseToDate(taskDue);
        dueInput.value = dt ? formatDateToIso(dt) : ''; // se não conseguir parse, fica vazio
      }

      // placeholders e limpar valores para edição (mantemos placeholder com valor atual)
      if (nameInput) { nameInput.placeholder = taskName || 'Nome da tarefa'; nameInput.value = ''; }
      if (descInput) {
        descInput.placeholder = taskDesc || 'Descrição da tarefa';
        descInput.value = ''; // deixa vazio para que o usuário edite (se deixar vazio, submit reaplica originalDesc)
      }
      if (priorityInput) priorityInput.value = taskPriority || 'medium';

      if (form && listId && taskId) form.action = `/lists/${listId}/tasks/update/${taskId}`;

      validateName();
      openModal();
    });
  });

  // fechar modal
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') closeModal(); });

  if (nameInput) nameInput.addEventListener('input', validateName);
});
