CREATE DATABASE Api_2;
USE Api_2;

CREATE TABLE Setor (
    ID_Setor INT AUTO_INCREMENT PRIMARY KEY,
    Nome_Setor VARCHAR(255),
=======
    ID_Setor INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Setor VARCHAR(255) NOT NULL,
    Descricao VARCHAR(255)
);

CREATE TABLE Colaboradores (

    ID_colaborador INT AUTO_INCREMENT PRIMARY KEY,
    Nome_Col VARCHAR(255),
    ID_colaborador INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Col VARCHAR(255) NOT NULL,
    Setor INT,
    CPF VARCHAR(11) UNIQUE,
    Senha VARCHAR(255) NOT NULL,
    Perfil VARCHAR(255),
    Email VARCHAR(255) UNIQUE,
    FOREIGN KEY (Setor) REFERENCES Setor(ID_Setor)
);

CREATE TABLE Gestor (
    ID_gestor INT PRIMARY KEY AUTO_INCREMENT,
    ID_colaborador INT NOT NULL,
    FOREIGN KEY (ID_colaborador) REFERENCES Colaboradores(ID_colaborador)
);


CREATE TABLE Evento (
    ID_Evento INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Evento VARCHAR(255) NOT NULL,
    Data_Evento DATETIME NOT NULL,
    Local_Evento VARCHAR(255),
    Descricao TEXT,
    ID_Setor INT,
    FOREIGN KEY (ID_Setor) REFERENCES Setor(ID_Setor)
);


CREATE TABLE Participacao_Evento (
    ID_Participacao INT PRIMARY KEY AUTO_INCREMENT,
    ID_Evento INT NOT NULL,
    ID_Colaborador INT NOT NULL,
    Status VARCHAR(50),
    FOREIGN KEY (ID_Evento) REFERENCES Evento(ID_Evento),
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores(ID_colaborador)
);


INSERT INTO Setor (Nome_Setor)
VALUES
('Adm'),
('Comercial'),
('Operacional');


CREATE TABLE Local_Trabalho (
    ID_Local INT PRIMARY KEY AUTO_INCREMENT,
    ID_Colaborador INT NOT NULL,
    Tipo_Local ENUM('Presencial','Semipresencial','Home Office') NOT NULL,
    Endereco VARCHAR(255),
    Data_Inicio DATE NOT NULL,
    Data_Fim DATE,
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores(ID_colaborador)
);

