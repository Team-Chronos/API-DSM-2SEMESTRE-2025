import db from '../config/db.js';

type ColaboradorCreate = {
    nome: string;
    email: string;
    senhaHash: string;
    telefone?: string | null;
    cpf: string;
    setor: string;
};

const Colaborador = {
    
    findByEmail: (email: string) => {
        const query = "SELECT * FROM Colaboradores WHERE Email = ?";
        return db.promise().query(query, [email]);
    },
    
    findByCpf: (cpf: string) => {
        const query = "SELECT * FROM Colaboradores WHERE CPF = ?";
        return db.promise().query(query, [cpf]);
    },
    
    create: (data: ColaboradorCreate) => {
        const { nome, email, senhaHash, telefone, cpf, setor } = data;
        const query = "INSERT INTO Colaboradores (Nome_Col, Email, Senha, Telefone, CPF, Setor) VALUES (?, ?, ?, ?, ?, ?)";
        return db.promise().query(query, [nome, email, senhaHash, telefone, cpf, setor]);
    },
    
    findAll: () => {
        const query = "SELECT ID_colaborador, Nome_Col, Telefone, Email, Setor,  Localidade FROM Colaboradores"; 
        return db.promise().query(query);
    },
    
    findById: (id: number) => {
        const query = "SELECT ID_colaborador, Nome_Col, Telefone, Email, CPF, Setor FROM Colaboradores WHERE ID_colaborador = ?";
        return db.promise().query(query, [id]);
    },
    
    
    updateById: (id: number, data: ColaboradorCreate) => {
        const { nome, email, telefone, cpf, setor } = data; 
        const query = "UPDATE Colaboradores SET Nome_Col = ?, Email = ?, Telefone = ?, CPF = ?, Setor = ? WHERE ID_colaborador = ?"; 
        return db.promise().query(query, [nome, email, telefone, cpf, setor, id]); 
    },
    
    
    deleteById: (id: number) => {
        const query = "DELETE FROM Colaboradores WHERE ID_colaborador = ?";
        return db.promise().query(query, [id]);
    },
    updateLocalidade: (colaboradorId: number, localidade: string | null) => {
    const query = "UPDATE Colaboradores SET Localidade = ? WHERE ID_colaborador = ?";
    return db.promise().query(query, [localidade, colaboradorId]);}
};

export default Colaborador;