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
    CPF VARCHAR(11) NOT NULL UNIQUE,
    Senha VARCHAR(255) NOT NULL,
    Telefone VARCHAR(11),
    Email VARCHAR(255) NOT NULL UNIQUE,
    Localidade VARCHAR(20),
    Nivel_Acesso ENUM('Gestor','Peão') NOT NULL,
    FOREIGN KEY (Setor) REFERENCES Setor(ID_Setor)
);

CREATE TABLE Evento (
    ID_Evento INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Evento VARCHAR(255) NOT NULL,
    Data_Evento DATETIME NOT NULL,
    Duracao_Evento VARCHAR(30),
    Local_Evento VARCHAR(255) NOT NULL,
    Descricao TEXT NOT NULL,
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Status_Participacao (
    ID_Status INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Status ENUM('Pendente','Confirmado','Recusado','Concluído') NOT NULL
);

CREATE TABLE Segmento_Cliente (
    ID_Segmento INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Segmento VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Cliente (
    ID_Cliente INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Cliente VARCHAR(255) NOT NULL,
    Email_Cliente VARCHAR(255) NOT NULL UNIQUE,
    Telefone_Cliente VARCHAR(15),
    CPF_CNPJ VARCHAR(20) UNIQUE,
    Endereco VARCHAR(255),
    Data_Cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    Cidade VARCHAR(100), 
    ID_Segmento INT,    
    FOREIGN KEY (ID_Segmento) REFERENCES Segmento_Cliente(ID_Segmento)
);

CREATE TABLE Historico_Interacao (
    ID_Interacao INT PRIMARY KEY AUTO_INCREMENT,
    ID_Cliente INT NOT NULL,
    ID_Colaborador INT,
    Data_Interacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    Tipo_Interacao ENUM('Ligação','Email','Reunião','Mensagem','Outro') NOT NULL,
    Descricao TEXT NOT NULL,
    Resultado VARCHAR(255),
    Sucesso BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (ID_Cliente) REFERENCES Cliente(ID_Cliente) ON DELETE CASCADE,
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores(ID_colaborador) ON DELETE SET NULL
);

CREATE TABLE Vendas (
    ID_Venda INT PRIMARY KEY AUTO_INCREMENT,
    ID_Cliente INT NOT NULL,
    ID_Colaborador INT, 
    Data_Venda DATETIME DEFAULT CURRENT_TIMESTAMP,
    Valor DECIMAL(10, 2) NOT NULL,
    Descricao_Produto TEXT,
    Status_Venda ENUM('Aprovada', 'Pendente', 'Cancelada', 'Em negociação') NOT NULL,
    FOREIGN KEY (ID_Cliente) REFERENCES Cliente(ID_Cliente) ON DELETE CASCADE,
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores(ID_colaborador) ON DELETE SET NULL
);

CREATE TABLE Relatorio (
    ID_Relatorio INT PRIMARY KEY AUTO_INCREMENT,
    ID_Colaborador INT NOT NULL,
    Tipo_Relatorio ENUM('Cliente','Interacao','Evento','Venda','Outro') NOT NULL, 
    Descricao TEXT NOT NULL,
    Data_Criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores(ID_colaborador) ON DELETE CASCADE
);

CREATE TABLE Agenda (
    ID_Agenda INT PRIMARY KEY AUTO_INCREMENT,
    ID_Colaborador INT NOT NULL,
    Titulo VARCHAR(255) NOT NULL,
    Descricao TEXT,
    Data_Hora_Inicio DATETIME NOT NULL,
    Data_Hora_Fim DATETIME,
    Local_Evento VARCHAR(255),
    Status ENUM('Pendente','Em andamento','Concluído','Cancelado') DEFAULT 'Pendente',
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores(ID_colaborador) ON DELETE CASCADE
);

CREATE TABLE Cliente_Evento (
    ID_Cliente INT NOT NULL,
    ID_Evento INT NOT NULL,
    Participou BOOLEAN DEFAULT FALSE,
    Feedback TEXT,
    PRIMARY KEY (ID_Cliente, ID_Evento),
    FOREIGN KEY (ID_Cliente) REFERENCES Cliente(ID_Cliente) ON DELETE CASCADE,
    FOREIGN KEY (ID_Evento) REFERENCES Evento(ID_Evento) ON DELETE CASCADE
);

CREATE TABLE Participacao_Evento (
    ID_Evento INT NOT NULL,
    ID_Colaborador INT NOT NULL,
    ID_Status INT NOT NULL,
    Justificativa VARCHAR(255),
    PRIMARY KEY (ID_Evento, ID_Colaborador),
    FOREIGN KEY (ID_Evento) REFERENCES Evento(ID_Evento) ON DELETE CASCADE,
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores(ID_colaborador) ON DELETE CASCADE,
    FOREIGN KEY (ID_Status) REFERENCES Status_Participacao(ID_Status)
);

CREATE TABLE Certificado_Participacao (
    ID_Colaborador INT NOT NULL,
    ID_Evento INT NOT NULL,
    Data_Part DATETIME NOT NULL,
    Duracao_Part VARCHAR(30) NOT NULL,
    Descricao_Part TEXT NOT NULL,
    PRIMARY KEY (ID_Evento, ID_Colaborador),
    FOREIGN KEY (ID_Evento) REFERENCES Evento(ID_Evento) ON DELETE CASCADE,
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores(ID_colaborador) ON DELETE CASCADE
);

CREATE TABLE colaboradores_emails_enviados (
    ID_colaborador INT PRIMARY KEY,
    email_enviado BOOLEAN DEFAULT FALSE,
    data_envio DATETIME,
    tentativas INT DEFAULT 0,
    FOREIGN KEY (ID_colaborador) REFERENCES Colaboradores(ID_colaborador) ON DELETE CASCADE
);

CREATE TABLE colaboradores_confirmados (
    ID_colaborador INT PRIMARY KEY,
    data_confirmacao DATETIME,
    FOREIGN KEY (ID_colaborador) REFERENCES Colaboradores(ID_colaborador) ON DELETE CASCADE
);

INSERT INTO Status_Participacao (Nome_Status)
VALUES ('Pendente'), ('Confirmado'), ('Recusado'), ('Concluído');

INSERT INTO Setor (Nome_Setor, Descricao)
VALUES
('Administrativo', 'Setor responsável pelas operações administrativas da empresa.'),
('Comercial', 'Setor de vendas e relacionamento com clientes.'),
('Operacional', 'Setor responsável pela execução das atividades principais.');

INSERT INTO Segmento_Cliente (Nome_Segmento) VALUES
('Tecnologia'),
('Varejo'),
('Saúde'),
('Financeiro'),
('Educação');

INSERT INTO Colaboradores (Email, Senha, Nome_Col, Setor, CPF, Telefone, Nivel_Acesso)
VALUES
('jv.moura.sjc@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'João Victor Moura', 1, '12345678901', '11999999999', 'Gestor'),
('rafael@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Rafael Sette', 2, '77777777777', '12988777777', 'Gestor'),
('rebeca@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Rebeca Lima', 2, '99999999999', '11999999999', 'Gestor'),
('rubim@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Ana Julia Rubim', 3, '88888888888', '11999998888', 'Peão'),
('lazaro@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Gabriel Lazaro', 3, '66666666666', '11994444499', 'Peão'),
('enzo@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Enzo de Paula', 2, '17221722172', '11945699399', 'Peão');