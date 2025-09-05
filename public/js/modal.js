document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('editModal');
  const editInput = document.getElementById('editInput');
  const editForm = document.getElementById('editForm');
  const closeModalBtn = document.getElementById('closeModal');
  const saveBtn = document.getElementById('saveBtn');
  const editError = document.getElementById('editError');

  if (!modal || !editInput || !editForm) return;

  const MIN_LENGTH = 3;

  function validate() {
    const v = (editInput.value || '').trim();
    if (v.length >= MIN_LENGTH) {
      editError.style.display = 'none';
      saveBtn.disabled = false;
      return true;
    } else {
      // se campo vazio — não mostrar erro agressivo, apenas manter botão desabilitado
      if (v.length === 0) {
        editError.style.display = 'none';
      } else {
        editError.style.display = 'block';
      }
      saveBtn.disabled = true;
      return false;
    }
  }

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const name = btn.dataset.name || '';

      // UX: não preencher o valor; mostrar o nome atual como placeholder
      editInput.value = '';
      editInput.placeholder = name;
      editForm.action = `/list/update/${id}`;

      // reset estado do modal/validação
      saveBtn.disabled = true;
      editError.style.display = 'none';
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      setTimeout(() => editInput.focus(), 100); // foco após abrir
    });
  });

  // validação em tempo real
  editInput.addEventListener('input', validate);

  // evitar submissão se inválido (dupla-checagem)
  editForm.addEventListener('submit', (e) => {
    if (!validate()) {
      e.preventDefault();
      editInput.focus();
    } else {
      // trim no valor antes de enviar (opcional)
      editInput.value = editInput.value.trim();
    }
  });

  // fechar modal
  closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  });
});
