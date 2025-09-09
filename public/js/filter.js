document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const tasks = document.querySelectorAll('.task-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove classe active de todos os botões
            filterButtons.forEach(b => b.classList.remove('active'));
            // Adiciona active no botão clicado
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            tasks.forEach(task => {
                if(filter === 'none') {
                    task.classList.remove('hidden'); // mostra todas
                } else if(task.classList.contains(filter)) {
                    task.classList.remove('hidden'); // mostra apenas as do filtro
                } else {
                    task.classList.add('hidden'); // esconde as outras
                }
            });
        });
    });
});
