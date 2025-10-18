import db from '../config/db.js';


const Colaborador = {
    findAllCargos: () => {
        const query = "SELECT ID_Cargo, Nome_Cargo FROM Cargo ORDER BY Nome_Cargo ASC";
        return db.promise().query(query);
    },

    findByEmail: (email) => {
        const query = "SELECT col.*, car.Nivel_Acesso FROM Colaboradores col inner join cargo car on car.ID_Cargo = col.ID_Cargo WHERE Email = ?";
        return db.promise().query(query, [email]);
    },

    findByCpf: (cpf) => {
        const query = "SELECT * FROM Colaboradores WHERE CPF = ?";
        return db.promise().query(query, [cpf]);
    },

    create: (data) => {
        const { nome, email, senhaHash, telefone, cpf, setor, ID_Cargo } = data;
        const query = "INSERT INTO Colaboradores (Nome_Col, Email, Senha, Telefone, CPF, Setor, ID_Cargo) VALUES (?, ?, ?, ?, ?, ?, ?)";
        return db.promise().query(query, [nome, email, senhaHash, telefone, cpf, setor, ID_Cargo]);
    },

    findAll: () => {
        const query = "SELECT ID_colaborador, Nome_Col, Telefone, Email, Setor, ID_Cargo, Localidade FROM Colaboradores";
        return db.promise().query(query);
    },

    findById: (id) => {
        const query = "SELECT ID_colaborador, Nome_Col, Telefone, Email, CPF, Setor, ID_Cargo FROM Colaboradores WHERE ID_colaborador = ?";
        return db.promise().query(query, [id]);
    },


    updateById: (id, data) => {
        const { nome, email, telefone, cpf, setor } = data;
        const query = "UPDATE Colaboradores SET Nome_Col = ?, Email = ?, Telefone = ?, CPF = ?, Setor = ? WHERE ID_colaborador = ?";
        return db.promise().query(query, [nome, email, telefone, cpf, setor, id]);
    },


    deleteById: (id) => {
        const query = "DELETE FROM Colaboradores WHERE ID_colaborador = ?";
        return db.promise().query(query, [id]);
    },
    updateLocalidade: (colaboradorId, localidade) => {
        const query = "UPDATE Colaboradores SET Localidade = ? WHERE ID_colaborador = ?";
        return db.promise().query(query, [localidade, colaboradorId]);}
};

export default Colaborador;