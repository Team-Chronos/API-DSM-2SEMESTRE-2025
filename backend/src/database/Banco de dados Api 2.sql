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
    Localidade VARCHAR(20) NULL,
    Nivel_Acesso ENUM('Gestor','Peão') NOT NULL,
    FOREIGN KEY (Setor) REFERENCES Setor(ID_Setor)
);

CREATE TABLE Evento (
    ID_Evento INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Evento VARCHAR(255) NOT NULL,
    Data_Evento DATETIME NOT NULL,
    Duracao_Evento varchar(30),
    Local_Evento VARCHAR(255) NOT NULL,
    Descricao TEXT NOT NULL,
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Status_Participacao (
    ID_Status INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Status ENUM('Pendente','Confirmado','Recusado', 'Concluído') NOT NULL
);

CREATE TABLE Cliente (
    ID_Cliente INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Cliente VARCHAR(255) NOT NULL,
    Email_Cliente VARCHAR(255) NOT NULL UNIQUE,
    Telefone_Cliente VARCHAR(15),
    CPF_CNPJ VARCHAR(20) UNIQUE,
    Endereco VARCHAR(255),
    Data_Cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Historico_Interacao (
    ID_Interacao INT PRIMARY KEY AUTO_INCREMENT,
    ID_Cliente INT NOT NULL,
    ID_Colaborador INT NOT NULL,
    Data_Interacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    Tipo_Interacao ENUM('Ligação', 'Email', 'Reunião', 'Mensagem', 'Outro') NOT NULL,
    Descricao TEXT NOT NULL,
    Resultado VARCHAR(255),
    FOREIGN KEY (ID_Cliente) REFERENCES Cliente(ID_Cliente) ON DELETE CASCADE,
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores(ID_colaborador) ON DELETE SET NULL
);


CREATE TABLE Relatorio (
    ID_Relatorio INT PRIMARY KEY AUTO_INCREMENT,
    ID_Colaborador INT NOT NULL,
    Tipo_Relatorio ENUM('Cliente', 'Interacao', 'Evento', 'Outro') NOT NULL,
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
    Status ENUM('Pendente', 'Em andamento', 'Concluído', 'Cancelado') DEFAULT 'Pendente',
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

INSERT INTO Status_Participacao (Nome_Status)
VALUES ('Pendente'), ('Confirmado'), ('Recusado'), ('Concluído');

CREATE TABLE Participacao_Evento (
    ID_Evento INT NOT NULL,
    ID_Colaborador INT NOT NULL,
    ID_Status INT NOT NULL,
    justificativa VARCHAR(255),
    PRIMARY KEY (ID_Evento, ID_Colaborador),
    FOREIGN KEY (ID_Evento) REFERENCES Evento (ID_Evento) ON DELETE CASCADE,
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores (ID_colaborador) ON DELETE CASCADE,
    FOREIGN KEY (ID_Status) REFERENCES Status_Participacao(ID_Status)
);

create table Certificado_Participacao (
	ID_Colaborador int not null,
    ID_Evento int not null,
    Data_Part datetime not null,
    Duracao_Part varchar(30) not null,
    Descricao_Part text not null,
    PRIMARY KEY (ID_Evento, ID_Colaborador),
    FOREIGN KEY (ID_Evento) REFERENCES Evento (ID_Evento) ON DELETE CASCADE,
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores (ID_colaborador) ON DELETE CASCADE
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

CREATE TABLE Agregados (
    id_agregado INT AUTO_INCREMENT PRIMARY KEY,
    genero ENUM('Masculino', 'Feminino', 'Outro') NOT NULL,
    nome VARCHAR(150) NOT NULL,
    cnpj CHAR(14) NULL,
    cpf CHAR(11) NULL,
    nascimento DATE NULL,
    cidadeNascimento VARCHAR(100) NULL,
    telefone VARCHAR(20) NULL,
    email VARCHAR(150) NULL,
    rg VARCHAR(20) NULL,
    emissaoRG DATE NULL,
    orgaoExp VARCHAR(20) NULL,
    pai VARCHAR(150) NULL,
    mae VARCHAR(150) NULL,
    pis VARCHAR(15) NULL,
    cep CHAR(8) NULL,
    endereco VARCHAR(255) NULL,
    nomeProprietario VARCHAR(150) NULL,
    placa VARCHAR(10) NULL,
    marca VARCHAR(50) NULL,
    modelo VARCHAR(100) NULL,
    cor VARCHAR(30) NULL,
    anoFabricacao YEAR NULL,
    cilindrada INT NULL,
    bauSuporte BOOLEAN DEFAULT FALSE,
    seguro BOOLEAN DEFAULT FALSE,
    valorMinSaida DECIMAL(10,2) NULL,
    valorKmRodado DECIMAL(10,2) NULL,
    cursoMotoFrete BOOLEAN DEFAULT FALSE,
    
    CONSTRAINT uc_cpf UNIQUE (cpf),
    CONSTRAINT uc_cnpj UNIQUE (cnpj),
    CONSTRAINT uc_rg UNIQUE (rg)
);

INSERT INTO Setor (Nome_Setor, Descricao)
VALUES 
('Administrativo', 'Setor responsável pelas operações administrativas da empresa.'),
('Comercial', 'Setor de vendas e relacionamento com clientes.'),
('Operacional', 'Setor responsável pela execução das atividades principais.');

INSERT INTO Colaboradores (Email, Senha, Nome_Col, Setor, CPF, Telefone, Nivel_Acesso)
VALUES
('jv.moura.sjc@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'João Victor Moura', 1, '12345678901', '11999999999', 'Gestor'),
('rafael@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Rafael Sette', 1, '77777777777', '12988777777', 'Gestor'),
('rebeca@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Rebeca Lima', 1, '99999999999', '11999999999', 'Gestor'),
('rubim@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Ana Julia Rubim', 1, '88888888888', '11999998888', 'Gestor'),
('lazaro@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Gabriel Lazaro', 1, '66666666666', '11994444499', 'Gestor'),
('enzo@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Enzo de Paula', 1, '17221722172', '11945699399', 'Gestor');