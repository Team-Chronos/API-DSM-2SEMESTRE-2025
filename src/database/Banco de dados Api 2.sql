create database Api_2;
use Api_2;

CREATE TABLE Setor (
    ID_Setor INT AUTO_INCREMENT PRIMARY KEY,
    Nome_Setor VARCHAR(255),
    Descricao VARCHAR(255)
);

CREATE TABLE Colaboradores (
    ID_colaborador INT AUTO_INCREMENT PRIMARY KEY,
    Nome_Col VARCHAR(255),
    Setor INT,
    CPF VARCHAR(11),
    Senha VARCHAR(255),
    Perfil VARCHAR(255),
    Telefone VARCHAR(11),
    Email VARCHAR(255),
    FOREIGN KEY (Setor) REFERENCES Setor(ID_Setor)
);

CREATE TABLE Gestor (
    ID_gestor INT PRIMARY KEY,
    ID_colaborador INT,
    FOREIGN KEY (ID_colaborador) REFERENCES Colaboradores(ID_colaborador)
);

CREATE TABLE  Evento (
    ID_Evento INT AUTO_INCREMENT PRIMARY KEY,
    Nome_Evento VARCHAR(255) NOT NULL,
    Data_Evento DATETIME NOT NULL,
    Local_Evento VARCHAR(255),
    Descricao TEXT,
    ID_Setor INT,
    FOREIGN KEY (ID_Setor) REFERENCES Setor(ID_Setor)
);

CREATE TABLE  Participacao_Evento (
    ID_Participacao INT PRIMARY KEY,
    ID_Evento INT,
    ID_Colaborador INT,
    Status VARCHAR(50),
    FOREIGN KEY (ID_Evento) REFERENCES Evento(ID_Evento),
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores(ID_colaborador)
);

INSERT INTO Setor (Nome_Setor)
VALUES
('Administrativo'),
('Comercial'),
('Operacional');

INSERT INTO Colaboradores (Nome_Col, Email, Senha, Setor)
VALUES
('Dev','dev@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2',1),
('Ana Rubim','anajrbcosta25@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2',2)
;
