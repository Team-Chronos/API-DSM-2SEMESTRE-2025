CREATE DATABASE Api_2;
USE Api_2;

CREATE TABLE Setor (
    ID_Setor INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Setor VARCHAR(255) NOT NULL,
    Descricao VARCHAR(255) NOT NULL
);

create table Cargo (
	ID_Cargo int primary key auto_increment,
    Nome_Cargo varchar(100) not null,
    Nivel_Acesso ENUM('Gestor', 'Colaborador') NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Colaboradores (
    ID_colaborador INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Col VARCHAR(255) NOT NULL,
    Setor INT NOT NULL,
    CPF VARCHAR(11) NOT NULL,
    Senha VARCHAR(255) NOT NULL,
    Telefone VARCHAR(11),
    Email VARCHAR(255) NOT NULL,
    Localidade VARCHAR(20) default "N",
    ID_Cargo int not null,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    foreign key (ID_Cargo) REFERENCES Cargo(ID_Cargo),
    FOREIGN KEY (Setor) REFERENCES Setor(ID_Setor)
);

create table Tipo_Evento(
	ID_Tipo_Evento int primary key auto_increment,
    Tipo_Evento_Nome enum("Feira", "Workshop", "Reunião")
);
INSERT INTO Tipo_Evento (Tipo_Evento_Nome)
VALUES ('Feira'), ('Workshop'), ('Reunião');

CREATE TABLE Evento (
    ID_Evento INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Evento VARCHAR(255) NOT NULL,
    Data_Evento DATETIME NOT NULL,
    Duracao_Evento varchar(30),
    Local_Evento VARCHAR(255) NOT NULL,
    ID_Tipo_Evento int not null,
    Descricao TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    foreign key (ID_Tipo_Evento) references Tipo_Evento (ID_Tipo_Evento)
);

CREATE TABLE Status_Participacao (
    ID_Status INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Status ENUM('Pendente','Confirmado','Recusado', 'Concluído') NOT NULL
);

INSERT INTO Status_Participacao (Nome_Status)
VALUES ('Pendente'), ('Confirmado'), ('Recusado'), ('Concluído');

CREATE TABLE Participacao_Evento (
    ID_Evento INT NOT NULL,
    ID_Colaborador INT NOT NULL,
    ID_Status INT NOT NULL,
    justificativa VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (ID_Evento, ID_Colaborador),
    FOREIGN KEY (ID_Evento) REFERENCES Evento (ID_Evento) ON DELETE CASCADE,
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores (ID_colaborador) ON DELETE CASCADE,
    FOREIGN KEY (ID_Status) REFERENCES Status_Participacao(ID_Status)
);

create table Certificado_Participacao (
	ID_Colaborador int not null,
    ID_Evento int not null,
    Objetivo_Part text not null,
    Principais_Inf text not null,
    Aplicacoes_Newe text not null,
    Referencias text,
    Avaliacao int check (10 >= Avaliacao >= 0) not null,
    Comentarios text,
    criado_em datetime default current_timestamp,
    PRIMARY KEY (ID_Evento, ID_Colaborador),
    FOREIGN KEY (ID_Evento) REFERENCES Evento (ID_Evento) ON DELETE CASCADE,
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores (ID_colaborador) ON DELETE CASCADE
);

create view vw_participacao as
select 
"RELATÓRIO DE APROVEITAMENTO" as tipo_documento, s.Nome_Setor as departamento_funcionario,
e.Nome_Evento as titulo_atividade, e.Data_Evento, e.Duracao_Evento,
col.Nome_Col as participante, car.Nome_Cargo as cargo_funcionario,
e.Local_Evento, te.Tipo_Evento_Nome,
cp.Objetivo_Part,
cp.Principais_Inf,
cp.Aplicacoes_Newe,
cp.Referencias,
cp.Avaliacao,
cp.Comentarios
from certificado_participacao cp
inner join colaboradores col on col.ID_colaborador = cp.ID_Colaborador
inner join cargo car on car.ID_Cargo = col.ID_Cargo
inner join setor s on s.ID_Setor = col.Setor
inner join evento e on e.ID_Evento = cp.ID_Evento
inner join tipo_evento te on te.ID_Tipo_Evento = e.ID_Tipo_Evento;

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
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT uc_cpf UNIQUE (cpf),
    CONSTRAINT uc_cnpj UNIQUE (cnpj),
    CONSTRAINT uc_rg UNIQUE (rg)
);

CREATE TABLE Cliente (
    ID_Cliente INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Cliente VARCHAR(255) NOT NULL,
    Email_Cliente VARCHAR(255) NOT NULL UNIQUE,
    Telefone_Cliente VARCHAR(15),
    Endereco VARCHAR(255) not null,
    atividade varchar(255) not null,
    segmento_atuacao varchar(255) not null,
    depart_responsavel varchar(100) not null,
    Data_Cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Historico_Interacao (
    ID_Interacao INT PRIMARY KEY AUTO_INCREMENT,
    ID_Cliente INT NOT NULL,
    ID_Colaborador INT NULL,
    Data_Interacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    Tipo_Interacao ENUM('Ligação', 'Email', 'Reunião', 'Mensagem', 'Outro') NOT NULL,
    Descricao TEXT NOT NULL,
    Resultado VARCHAR(255),
    FOREIGN KEY (ID_Cliente) REFERENCES Cliente(ID_Cliente) ON DELETE CASCADE,
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores(ID_colaborador) ON DELETE SET NULL
);


INSERT INTO Setor (Nome_Setor, Descricao) VALUES 
('Administrativo', 'Setor responsável pelas operações administrativas da empresa.'),
('Comercial', 'Setor de vendas e relacionamento com clientes.'),
('Operacional', 'Setor responsável pela execução das atividades principais.');

INSERT INTO Cargo (Nome_Cargo, Nivel_Acesso) VALUES
('Gerente de Projetos', 'Gestor'),
('Coordenador de Equipe', 'Gestor'),
('Assistente Administrativo', 'Colaborador'),
('Analista de Operações', 'Colaborador');

INSERT INTO Colaboradores (Email, Senha, Nome_Col, Setor, CPF, Telefone, ID_Cargo) VALUES
('jv.moura.sjc@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'João Victor Moura', 1, '12345678901', '11999999999', 1),
('rafael@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Rafael Sette', 1, '77777777777', '12988777777', 1),
('rebeca@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Rebeca Lima', 1, '99999999999', '11999999999', 1),
('rubim@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Ana Julia Rubim', 1, '88888888888', '11999998888', 1),
('lazaro@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Gabriel Lazaro', 1, '66666666666', '11994444499', 1),
('enzo@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Enzo de Paula', 1, '17221722172', '11945699399', 1);

INSERT INTO Evento (Nome_Evento, Data_Evento, Duracao_Evento, Local_Evento, ID_Tipo_Evento, Descricao) VALUES
('Workshop de Gestão de Projetos', '2025-11-20 09:00:00', '4h', 'Auditório Principal', 2, 'Workshop para aprimorar habilidades em gestão de projetos.'),
('Treinamento Operacional', '2025-11-22 14:00:00', '3h', 'Sala de Treinamento 2', 1, 'Treinamento prático para a equipe operacional.'),
('Reunião Comercial Mensal', '2025-11-25 10:00:00', '2h', 'Sala de Reuniões 1', 3, 'Discussão das metas e estratégias comerciais do mês.'),
('Seminário de Inovação', '2025-12-01 09:00:00', '5h', 'Auditório Principal', 1, 'Seminário sobre tendências e inovações no setor.'),
('Palestra Motivacional', '2025-12-05 15:00:00', '2h', 'Auditório Secundário', 1, 'Palestra para engajar e motivar a equipe.');


INSERT INTO Participacao_Evento (ID_Evento, ID_Colaborador, ID_Status) VALUES
(1, 2, 1),
(1, 1, 1),
(1, 3, 1);

INSERT INTO Participacao_Evento (ID_Evento, ID_Colaborador, ID_Status) VALUES
(2, 2, 1),
(2, 4, 1),
(2, 5, 1);

INSERT INTO Participacao_Evento (ID_Evento, ID_Colaborador, ID_Status) VALUES
(3, 2, 1),
(3, 1, 1),
(3, 5, 1);

INSERT INTO Participacao_Evento (ID_Evento, ID_Colaborador, ID_Status) VALUES
(4, 2, 1),
(4, 3, 1),
(4, 4, 1);

INSERT INTO Participacao_Evento (ID_Evento, ID_Colaborador, ID_Status) VALUES
(5, 2, 1),
(5, 1, 1),
(5, 5, 1),
(5, 6, 1);

-- INSERT INTO Historico_Interacao (ID_Cliente, ID_Colaborador, Tipo_Interacao, Descricao, Resultado) VALUES
-- (1, 2, 'Ligação', 'Cliente pediu proposta comercial.', 'Enviado orçamento por e-mail'),
-- (1, 3, 'Email', 'Envio de follow-up após proposta.', 'Cliente respondeu positivamente'),
-- (2, 1, 'Reunião', 'Reunião presencial para demonstração do produto.', 'Em negociação');
