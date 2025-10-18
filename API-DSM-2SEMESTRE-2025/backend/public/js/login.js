document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('userToken')) {
        window.location.href = '/home.html';
    }

    const formLogin = document.getElementById('formLogin');
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.mensagem);
            } else {
                localStorage.setItem('userToken', result.token); 
                window.location.href = '/home.html';
            }
        } catch (error) {
            alert('Falha na conexão com o servidor.');
        }
    });
});document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('userToken')) {
        window.location.href = '/home.html';
    }

    const formLogin = document.getElementById('formLogin');
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.mensagem);
            } else {
                localStorage.setItem('userToken', result.token); 
                window.location.href = '/home.html';
            }
        } catch (error) {
            alert('Falha na conexão com o servidor.');
        }
    });
});