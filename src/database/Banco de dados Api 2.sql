CREATE DATABASE Api_2;
USE Api_2;

CREATE TABLE Setor (
    ID_Setor INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Setor VARCHAR(255) NOT NULL,
    Descricao VARCHAR(255) NOT NULL
);

CREATE TABLE Colaboradores (
    ID_colaborador INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Col VARCHAR(255) NOT NULL,
    Setor INT NOT NULL,
    CPF VARCHAR(11) NOT NULL,
    Senha VARCHAR(255) NOT NULL,
    Telefone VARCHAR(11),
    Email VARCHAR(255) NOT NULL,
    Nivel_Acesso ENUM('Gestor','Peão') NOT NULL,
    FOREIGN KEY (Setor) REFERENCES Setor(ID_Setor)
);

CREATE TABLE Evento (
    ID_Evento INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Evento VARCHAR(255) NOT NULL,
    Data_Evento DATETIME NOT NULL,
    Local_Evento VARCHAR(255) NOT NULL,
    Descricao TEXT NOT NULL,
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Status_Participacao (
    ID_Status INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Status ENUM('Pendente','Confirmado','Recusado') NOT NULL
);

INSERT INTO Status_Participacao (Nome_Status)
VALUES ('Pendente'), ('Confirmado'), ('Recusado');

CREATE TABLE Participacao_Evento (
    ID_Evento INT NOT NULL,
    ID_Colaborador INT NOT NULL,
    ID_Status INT NOT NULL,
    justificativa VARCHAR(255),
    PRIMARY KEY (ID_Evento, ID_Colaborador),
    FOREIGN KEY (ID_Evento) REFERENCES Evento (ID_Evento),
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores (ID_colaborador),
    FOREIGN KEY (ID_Status) REFERENCES Status_Participacao(ID_Status)
);

CREATE TABLE colaboradores_emails_enviados (
    ID_colaborador INT PRIMARY KEY,
    email_enviado BOOLEAN DEFAULT FALSE,
    data_envio DATETIME,
    tentativas INT DEFAULT 0,
    FOREIGN KEY (ID_colaborador) REFERENCES Colaboradores(ID_colaborador)
);

CREATE TABLE colaboradores_confirmados (
    ID_colaborador INT PRIMARY KEY,
    data_confirmacao DATETIME,
    FOREIGN KEY (ID_colaborador) REFERENCES Colaboradores(ID_colaborador)
);

INSERT INTO Setor (Nome_Setor, Descricao)
VALUES 
('Administrativo', 'Setor responsável pelas operações administrativas da empresa.'),
('Comercial', 'Setor de vendas e relacionamento com clientes.'),
('Operacional', 'Setor responsável pela execução das atividades principais.');

INSERT INTO Colaboradores (Email, Senha, Nome_Col, Setor, CPF, Telefone, Nivel_Acesso)
VALUES (
  'jv.moura.sjc@gmail.com',
  '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2',
  'João Victor Moura',
  1,
  '12345678901',
  '11999999999',
  'Gestor'
);