
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const sucessoModal = new bootstrap.Modal(document.getElementById('sucessoModal'));
    const erroModal = new bootstrap.Modal(document.getElementById('erroModal'));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const dados = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/agregados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            const result = await response.json();

            if (response.ok) {
                document.getElementById('sucessoMensagem').innerText = result.mensagem;
                sucessoModal.show();
                form.reset();
            } else {
                document.getElementById('erroMensagem').innerText = result.mensagem;
                erroModal.show();
            }
        } catch (error) {
            document.getElementById('erroMensagem').innerText = 'Falha na comunicação com o servidor. Tente novamente mais tarde.';
            erroModal.show();
        }
    });
});