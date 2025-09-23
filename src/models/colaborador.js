import db from '../config/db.js';

const Colaborador = {
    
    findByEmail: (email) => {
        const query = "SELECT * FROM Colaboradores WHERE Email = ?";
        return db.promise().query(query, [email]);
    },
    
    findByCpf: (cpf) => {
        const query = "SELECT * FROM Colaboradores WHERE CPF = ?";
        return db.promise().query(query, [cpf]);
    },
    
    create: (data) => {
        const { nome, email, senhaHash, telefone, cpf, setor } = data;
        const query = "INSERT INTO Colaboradores (Nome_Col, Email, Senha, Telefone, CPF, Setor, verified) VALUES (?, ?, ?, ?, ?, ?, ?)";
        return db.promise().query(query, [nome, email, senhaHash, telefone, cpf, setor, false]); // Adicione o campo verified
    },
    
    findAll: () => {
        const query = "SELECT ID_colaborador, Nome_Col, Telefone, Email, Setor FROM Colaboradores"; 
        return db.promise().query(query);
    },
    
    findById: (id) => {
        const query = "SELECT ID_colaborador, Nome_Col, Telefone, Email, CPF, Setor FROM Colaboradores WHERE ID_colaborador = ?";
        return db.promise().query(query, [id]);
    },
    
    updateById: (id, data) => {
        const { nome, email, telefone, cpf, setor } = data; 
        const query = "UPDATE Colaboradores SET Nome_Col = ?, Email = ?, Telefone = ?, CPF = ?, Setor = ? WHERE ID_colaborador = ?"; 
        return db.promise().query(query, [nome, email, telefone, cpf, setor, id]); 
    },
    
    confirmarEmail: (email) => {
        const query = "UPDATE Colaboradores SET verified = true WHERE Email = ?";
        return db.promise().query(query, [email]);
    },
    
    deleteById: (id) => {
        const query = "DELETE FROM Colaboradores WHERE ID_colaborador = ?";
        return db.promise().query(query, [id]);
    }
};

export default Colaborador;