document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('editModal');
  const editInput = document.getElementById('editInput');
  const editForm = document.getElementById('editForm');
  const closeModalBtn = document.getElementById('closeModal');

  if (!modal || !editInput || !editForm) return;

  // abre o modal e set a action do form dinamicamente
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const name = btn.dataset.name || '';
      editInput.value = name;
      editForm.action = `/list/update/${id}`; // action final para o POST
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      editInput.focus();
    });
  });

  // fechar modal com botão cancelar
  closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  });

  // fechar clicando fora do conteúdo
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  // fechar com ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  });
});
