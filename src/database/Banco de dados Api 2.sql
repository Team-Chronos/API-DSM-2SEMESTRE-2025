CREATE DATABASE Api_2;
USE Api_2;

CREATE TABLE Setor (
    ID_Setor INT PRIMARY KEY auto_increment unique,
    Nome_Setor VARCHAR(255) not null,
    Descricao VARCHAR(255) not null
);

CREATE TABLE Colaboradores (
    ID_colaborador INT PRIMARY KEY,
    Nome_Col VARCHAR(255) not null,
    Setor INT not null,
    CPF VARCHAR(11) not null,
    Senha VARCHAR(255) not null,
    Telefone VARCHAR(11) not null,
    Email VARCHAR(255) not null,
    Nivel_Acesso enum('Gestor','Peão'),
    FOREIGN KEY (Setor) REFERENCES Setor(ID_Setor)
);

CREATE TABLE Evento (
    ID_Evento INT PRIMARY KEY,
    Nome_Evento VARCHAR(255) not null,
    Data_Evento DATETIME not null,
    Local_Evento VARCHAR(255) not null,
    Descricao TEXT not null,
    data_registro datetime default current_timestamp
);

INSERT IGNORE INTO Status_Participacao (Nome_Status)
VALUES ('Pendente'), ('Confirmado'), ('Recusado');

CREATE TABLE Participacao_Evento (
    ID_Evento INT not null,
    ID_Colaborador INT not null,
    ID_Status enum('Pendente','Confirmado','Recusado'),
    justificativa varchar(255),
    primary key (ID_Evento, ID_Colaborador),
    FOREIGN KEY (ID_Evento) REFERENCES Evento (ID_Evento),
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores (ID_colaborador)
);

INSERT INTO Setor (Nome_Setor, Descricao)
VALUES 
('Administrativo', 'Setor responsável pelas operações administrativas da empresa.'),
('Comercial', 'Setor de vendas e relacionamento com clientes.'),
('Operacional', 'Setor responsável pela execução das atividades principais.');

INSERT INTO Colaboradores (ID_colaborador, Email, Senha, Nome_Col, Setor,Nivel_Acesso)
VALUES (1, 'jv.moura.sjc@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'João Victor Moura', 1, 'Admin','Gerente');

