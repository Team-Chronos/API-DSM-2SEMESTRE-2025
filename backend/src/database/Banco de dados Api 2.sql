CREATE DATABASE Api_2;
USE Api_2;

CREATE TABLE  Setor (
    ID_Setor INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Setor VARCHAR(255) NOT NULL,
    Descricao VARCHAR(255) NOT NULL
);

CREATE TABLE  Cargo (
    ID_Cargo INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Cargo VARCHAR(100) NOT NULL,
    Nivel_Acesso ENUM('Gestor', 'Colaborador') NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE  Colaboradores (
    ID_colaborador INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Col VARCHAR(255) NOT NULL,
    Setor INT NOT NULL,
    CPF VARCHAR(11) NOT NULL,
    Senha VARCHAR(255) NOT NULL,
    Telefone VARCHAR(11),
    Email VARCHAR(255) NOT NULL,
    Localidade VARCHAR(20) DEFAULT "N",
    ID_Cargo INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Cargo) REFERENCES Cargo(ID_Cargo),
    FOREIGN KEY (Setor) REFERENCES Setor(ID_Setor)
);

CREATE TABLE historico_modalidade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    colaborador_id INT NOT NULL,
    modalidade ENUM('Presencial', 'Remoto', 'Híbrido') NOT NULL, 
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    data_resposta DATETIME NULL, 
    FOREIGN KEY (colaborador_id) REFERENCES Colaboradores(ID_colaborador) ON DELETE CASCADE
);


create table Tipo_Evento(
    ID_Tipo_Evento int primary key auto_increment,
    Tipo_Evento_Nome enum("Feira", "Workshop", "Reunião")
);
INSERT INTO Tipo_Evento (Tipo_Evento_Nome)
VALUES ('Feira'), ('Workshop'), ('Reunião');

CREATE TABLE  Evento (
    ID_Evento INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Evento VARCHAR(255) NOT NULL,
    Data_Evento DATETIME NOT NULL,
    Duracao_Evento VARCHAR(30),
    Local_Evento VARCHAR(255) NOT NULL,
    ID_Tipo_Evento int not null,
    Descricao TEXT NOT NULL,
    Criado_Por INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Criado_Por) REFERENCES Colaboradores(ID_colaborador),
    FOREIGN KEY (ID_Tipo_Evento) REFERENCES Tipo_Evento(ID_Tipo_Evento) 
);

CREATE TABLE  Status_Participacao (
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
    Avaliacao int check (10 >= Avaliacao AND Avaliacao >= 0) not null, 
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


CREATE TABLE  colaboradores_emails_enviados (
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

CREATE TABLE  Cliente (
    ID_Cliente INT AUTO_INCREMENT PRIMARY KEY,
    Nome_Cliente VARCHAR(255) NOT NULL,
    Telefone_Cliente VARCHAR(20),
    Email_Cliente VARCHAR(255),
    Segmento varchar(100) not null,
    Etapa varchar(255) DEFAULT 'Prospects',
    atividade varchar(100),
    Cidade VARCHAR(100) NULL,
    depart_responsavel varchar(100),
    Ultima_Interacao DATETIME NULL,
    Criado_Por INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Criado_Por) REFERENCES Colaboradores(ID_colaborador)
);

CREATE TABLE  Historico_Interacao (
    ID_Interacao INT AUTO_INCREMENT PRIMARY KEY,
    ID_Cliente INT NOT NULL,
    ID_Colaborador INT NOT NULL,
    Data_Interacao DATETIME NOT NULL,
    Forma_Contato ENUM('Telefone', 'Email', 'Reunião', 'Visita', 'WhatsApp', 'Proposta') NOT NULL,
    Titulo VARCHAR(255) NOT NULL,
    Descricao TEXT,
    Resultado VARCHAR(100),
    Proxima_Acao VARCHAR(255),
    Data_Proxima_Acao DATETIME NULL,
    Prioridade ENUM('Baixa', 'Media', 'Alta', 'Urgente') DEFAULT 'Media',
    Status ENUM('Agendada', 'Realizada', 'Cancelada', 'Concluída') DEFAULT 'Realizada',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Cliente) REFERENCES Cliente(ID_Cliente) ON DELETE CASCADE,
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores(ID_colaborador) ON DELETE CASCADE
);

CREATE TABLE Agenda (
    ID_Agenda INT AUTO_INCREMENT PRIMARY KEY,
    ID_Colaborador INT NOT NULL,
    Titulo VARCHAR(255) NOT NULL,
    Descricao TEXT,
    Data_Hora_Inicio DATETIME NOT NULL,
    Data_Hora_Fim DATETIME,
    Local_Evento VARCHAR(255),
    Status ENUM('Pendente', 'Em andamento', 'Concluído', 'Cancelado') DEFAULT 'Pendente',
    Prioridade ENUM('Baixa', 'Média', 'Alta', 'Urgente') DEFAULT 'Média',
    ID_Cliente INT,
    Tipo_Contato ENUM('Email', 'Telefone', 'Reunião', 'Visita', 'Proposta') DEFAULT 'Reunião',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores(ID_colaborador),
    FOREIGN KEY (ID_Cliente) REFERENCES Cliente(ID_Cliente)
);

CREATE TABLE Relatorio (
    ID_Relatorio INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Relatorio VARCHAR(255) NOT NULL,
    Tipo_Relatorio VARCHAR(50) NOT NULL,
    Data_Geracao DATETIME DEFAULT CURRENT_TIMESTAMP,
    Gerado_Por INT,
    FOREIGN KEY (Gerado_Por) REFERENCES Colaboradores(ID_colaborador) ON DELETE SET NULL
);

CREATE TABLE notificacoes_personalizadas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo ENUM('personalizada', 'sistema', 'lembrete') DEFAULT 'personalizada',
    destinatarios JSON,
    prioridade ENUM('baixa', 'media', 'alta', 'urgente') DEFAULT 'media',
    agendamento DATETIME NULL,
    status ENUM('pendente', 'enviada', 'cancelada', 'erro') DEFAULT 'pendente',
    criado_por INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    enviado_em DATETIME NULL,
    FOREIGN KEY (criado_por) REFERENCES Colaboradores(ID_colaborador)
);

INSERT INTO Setor (Nome_Setor, Descricao) VALUES 
('Administrativo', 'Operações administrativas'),
('Comercial', 'Vendas e relacionamento'),
('Operacional', 'Execução das atividades');

INSERT INTO Cargo (Nome_Cargo, Nivel_Acesso) VALUES
('Gerente', 'Gestor'), ('Coordenador', 'Gestor'),
('Assistente', 'Colaborador'), ('Analista', 'Colaborador');

INSERT INTO Colaboradores (Email, Senha, Nome_Col, Setor, CPF, Telefone, ID_Cargo) VALUES
('jv.moura.sjc@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'João Victor Moura', 2, '12345678901', '11999999999', 1),
('rafael@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Rafael Sette', 1, '77777777777', '12988777777', 1),
('rebeca@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Rebeca Lima', 1, '99999999999', '11999999999', 1),
('rubim@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Ana Julia Rubim', 1, '88888888888', '11999998888', 1),
('lazaro@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Gabriel Lazaro', 1, '66666666666', '11994444499', 1),
('enzo@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Enzo de Paula', 1, '17221722172', '11945699399', 1);

INSERT INTO Evento (Nome_Evento, Data_Evento, Duracao_Evento, Local_Evento, ID_Tipo_Evento, Descricao, Criado_Por) VALUES
('Workshop Gestão', '2025-11-20 09:00:00', '4h', 'Auditório P.', 2, 'Workshop de gestão.', 1),
('Treinamento Oper.', '2025-11-22 14:00:00', '3h', 'Sala T2', 1, 'Treinamento operacional.', 1),
('Reunião Comercial', '2025-11-25 10:00:00', '2h', 'Sala R1', 3, 'Reunião mensal.', 2),
('Seminário Inovação', '2025-12-01 09:00:00', '5h', 'Auditório P.', 1, 'Seminário de inovação.', 1),
('Palestra Motivacional', '2025-12-05 15:00:00', '2h', 'Auditório S.', 1, 'Palestra motivacional.', 2);

INSERT INTO Participacao_Evento (ID_Evento, ID_Colaborador, ID_Status) VALUES
(1, 2, 1), (1, 1, 1), (1, 3, 1), (2, 2, 1), (2, 4, 1), (2, 5, 1),
(3, 2, 1), (3, 1, 1), (3, 5, 1), (4, 2, 1), (4, 3, 1), (4, 4, 1),
(5, 2, 1), (5, 1, 1), (5, 5, 1), (5, 6, 1);

INSERT INTO Agregados (genero, nome, cpf, nascimento, cidadeNascimento, telefone, email, endereco, placa, marca, modelo) VALUES
('Masculino', 'Carlos Silva', '11122233344', '1985-03-15', 'São Paulo', '11911112222', 'carlos.silva@email.com', 'Rua Exemplo, 10, São Paulo', 'BRA1A11', 'Honda', 'CG 160'),
('Feminino', 'Ana Pereira', '55566677788', '1992-07-22', 'Rio de Janeiro', '21988887777', 'ana.pereira@email.com', 'Av. Teste, 20, Rio de Janeiro', 'MER2B22', 'Yamaha', 'Factor 150'),
('Masculino', 'José Santos', '99988877766', '1978-11-01', 'Belo Horizonte', '31977776666', 'jose.santos@email.com', 'Praça Modelo, 30, Belo Horizonte', 'SUL3C33', 'Honda', 'Biz 125');

INSERT  INTO Historico_Interacao (ID_Cliente, ID_Colaborador, Data_Interacao, Forma_Contato, Titulo, Descricao, Resultado, Proxima_Acao, Data_Proxima_Acao, Prioridade, Status) VALUES
(1, 3, '2024-12-01 10:00:00', 'Telefone', 'Follow-up', 'Pedido alterações.', 'Negociação', 'Revisar proposta', '2024-12-05 14:00:00', 'Alta', 'Realizada'),
(2, 3, '2024-12-02 14:30:00', 'Reunião', 'Apresentação', 'Interesse positivo.', 'Positivo', 'Enviar proposta', '2024-12-06 09:00:00', 'Alta', 'Realizada'),
(3, 4, '2024-12-03 11:00:00', 'Email', 'Catálogo', 'Enviado.', 'Aguardando', 'Follow-up', '2024-12-10 10:00:00', 'Media', 'Realizada'),
(1, 3, '2024-12-04 16:00:00', 'WhatsApp', 'Confirmação', 'Dados OK.', 'Confirmado', 'Emitir proposta', '2024-12-05 08:00:00', 'Urgente', 'Realizada'),
(4, 3, '2024-12-04 09:00:00', 'Visita', 'Visita Técnica', 'Necessidades mapeadas.', 'Mapeado', 'Elaborar solução', '2024-12-12 15:00:00', 'Alta', 'Realizada');

INSERT  INTO Agenda (ID_Colaborador, Titulo, Descricao, Data_Hora_Inicio, Data_Hora_Fim, Local_Evento, ID_Cliente, Tipo_Contato, Prioridade) VALUES
(1, 'Reunião Cliente 1', 'Serviços', '2024-12-01 09:00:00', '2024-12-01 10:30:00', 'Sala 1', 1, 'Reunião', 'Alta'),
(2, 'Follow-up Cliente 2', 'Proposta', '2024-12-02 14:00:00', '2024-12-02 14:30:00', NULL, 2, 'Telefone', 'Média'),
(1, 'Visita Cliente 3', 'Necessidades', '2024-12-03 10:00:00', '2024-12-03 12:00:00', 'Cliente', 3, 'Visita', 'Alta'),
(3, 'Demo Cliente 4', 'Nova linha', '2024-12-04 15:00:00', '2024-12-04 16:30:00', 'Sala Demo', 4, 'Reunião', 'Alta'),
(4, 'Negociação Cliente 5', 'Contrato', '2024-12-05 11:00:00', '2024-12-05 12:00:00', 'Sala 2', 5, 'Reunião', 'Urgente');

INSERT INTO Relatorio (Nome_Relatorio, Tipo_Relatorio, Gerado_Por) VALUES
('Relatorio_Eventos_202412.pdf', 'eventos', 1),
('Relatorio_Comercial_Q4.xlsx', 'clientes', 2);

INSERT INTO notificacoes_personalizadas (titulo, mensagem, destinatarios, prioridade, criado_por, tipo) VALUES
('Bem-vindo', 'Sistema ativo.', '"todos"', 'media', 1, 'sistema'),
('Manutenção', 'Sábado 08h-12h.', '"todos"', 'alta', 1, 'sistema');

UPDATE Cliente SET Ultima_Interacao = NOW() WHERE ID_Cliente IN (1, 2, 3, 4); 

INSERT INTO historico_modalidade (colaborador_id, modalidade) VALUES (1, 'Remoto');
