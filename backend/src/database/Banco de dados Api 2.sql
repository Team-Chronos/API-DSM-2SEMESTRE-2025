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
    modalidade ENUM('Presencial', 'Remoto', 'Outro') NOT NULL, 
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

CREATE TABLE Certificado_Participacao (
    ID_Colaborador INT NOT NULL,
    ID_Evento INT NOT NULL,
    Data_Part DATETIME DEFAULT CURRENT_TIMESTAMP,      
    Duracao_Part VARCHAR(100) NOT NULL,                 
    Descricao_Part TEXT NOT NULL,                       
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,     
    PRIMARY KEY (ID_Evento, ID_Colaborador),
    FOREIGN KEY (ID_Evento) REFERENCES Evento (ID_Evento) ON DELETE CASCADE,
    FOREIGN KEY (ID_Colaborador) REFERENCES Colaboradores (ID_Colaborador) ON DELETE CASCADE
);

CREATE OR REPLACE VIEW vw_participacao AS
SELECT
  "RELATÓRIO DE APROVEITAMENTO" AS tipo_documento,
  s.Nome_Setor AS departamento_funcionario,
  e.Nome_Evento AS titulo_atividade,
  e.Data_Evento,
  e.Duracao_Evento,
  col.Nome_Col AS participante,
  car.Nome_Cargo AS cargo_funcionario,
  e.Local_Evento,
  te.Tipo_Evento_Nome,
  cp.Data_Part,
  cp.Duracao_Part,
  cp.Descricao_Part,
  cp.criado_em
FROM Certificado_Participacao cp
INNER JOIN Colaboradores col ON col.ID_Colaborador = cp.ID_Colaborador
INNER JOIN Cargo car ON car.ID_Cargo = col.ID_Cargo
INNER JOIN Setor s ON s.ID_Setor = col.Setor
INNER JOIN Evento e ON e.ID_Evento = cp.ID_Evento
INNER JOIN Tipo_Evento te ON te.ID_Tipo_Evento = e.ID_Tipo_Evento;



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

create table responsaveisVistoria(
    id_responsavel int primary key,
    foreign key (id_responsavel) references Colaboradores(ID_colaborador)
);

create table checklistVeiculoAgregado(
	ID_cva int primary key auto_increment,
    nome_motorista varchar(255) not null,
    cpf varchar(11) not null,
    placa_veiculo varchar(7) not null,
    tipo_veiculo varchar(127) not null,
    nivel_oleo enum("sim", "não", "na") not null,
    vazamento_oleo enum("sim", "não", "na") not null,
    nivel_agua enum("sim", "não", "na") not null,
    foto_motor varchar(255) not null, #tem foto de referencia
    foto_etiqueta_troca_oleo varchar(255), #tbm tem
    pne_liso enum("sim", "não") not null,
    pte_liso enum("sim", "não") not null,
    ptd_liso enum("sim", "não") not null,
    pdd_liso enum("sim", "não") not null,
    pne_foto varchar(255) not null, # 1
    pte_foto varchar(255) not null, # 2
    ptd_foto varchar(255) not null, # 3
    pdd_foto varchar(255) not null, # 4
    parabrisa_perfeito enum("sim", "não", "na") not null,
    cabine_externa_limpa enum("sim", "não", "na") not null,
    veiculo_externo_limpo enum("sim", "não", "na") not null,
    sem_amassado_ferrugem enum("sim", "não", "na") not null,
    assoalho_conservado enum("sim", "não", "na") not null,
    faixas_refletivas enum("sim", "não", "na") not null,
    parabrisa_funcionando enum("sim", "não", "na") not null,
    buzina_funciona enum("sim", "não", "na") not null,
    farol_alto enum("sim", "não", "na") not null,
    farol_baixo enum("sim", "não", "na") not null,
    setas_dianteiras enum("sim", "não", "na") not null,
    setas_traseiras enum("sim", "não", "na") not null,
    pisca_alerta enum("sim", "não", "na") not null,
    luz_freio enum("sim", "não", "na") not null,
    luz_re enum("sim", "não", "na") not null,
    sirene_re enum("sim", "não", "na") not null,
    extintor enum("sim", "não", "na") not null,
    step enum("sim", "não", "na") not null,
    triangulo enum("sim", "não", "na") not null,
    macaco enum("sim", "não", "na") not null,
    chave_roda enum("sim", "não", "na") not null,
    capacete_seguranca enum("sim", "não", "na") not null,
    colete_seguranca enum("sim", "não", "na") not null,
    bota_seguranca enum("sim", "não", "na") not null,
    foto_frente varchar(255) not null, #tem foto de referencia 1
    foto_lateral_direita varchar(255) not null, # 2
    foto_lateral_esquerda varchar(255) not null, # 3
    foto_traseira varchar(255) not null, # 4
    observacoes text,
    id_responsavel_vistoria int,
    nome_responsavel_vistoria varchar(255),
    criado_em datetime default current_timestamp,
    foreign key (id_responsavel_vistoria) references responsaveisVistoria (id_responsavel)
);

CREATE TABLE ChecklistPredial (
  CheckPredio INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  NomeFuncPredio VARCHAR(50),
  DataPredio DATETIME default current_timestamp,
  LixoCozinha ENUM('Sim','Não'),
  LixoReciclavel ENUM('Sim','Não'),
  CozinhaOrganizada ENUM('Sim','Não'),
  LuzesCozinha ENUM('Sim','Não'),
  CadeadoPortao2 ENUM('Sim','Não'),
  CadeadoPortao1 ENUM('Sim','Não'),
  TorneirasFechadas ENUM('Sim','Não'),
  LixoBanheiro ENUM('Sim','Não'),
  PortaBanheiro ENUM('Sim','Não'),
  BebedouroDesligado ENUM('Sim','Não'),
  ChavesChaveiro ENUM('Sim','Não'),
  TVCameras ENUM('Sim','Não'),
  TVDashboard ENUM('Sim','Não'),
  ArCondicionado ENUM('Sim','Não'),
  LuzesOperacional ENUM('Sim','Não'),
  LuzesArmazem ENUM('Sim','Não'),
  ConePCD ENUM('Sim','Não'),
  Alarme ENUM('Sim','Não'),
  PortaArmazem ENUM('Sim','Não'),
  CadeadoCorrentes ENUM('Sim','Não'),
  MotorRuidos TEXT,
  SituacaoAtip TEXT
);

CREATE TABLE weair_convencional (
    id SERIAL PRIMARY KEY,
    servico VARCHAR(50) NOT NULL,
    cita CHAR(3) NOT NULL,     -- Código IATA
    destino VARCHAR(100) NOT NULL,
    frete_minimo DECIMAL(10,2) NOT NULL,
    valor_kilo_excedente DECIMAL(10,5) NOT NULL,
    peso_minimo INT NOT NULL
);

INSERT INTO weair_convencional (servico, cita, destino, frete_minimo, valor_kilo_excedente, peso_minimo) VALUES
('NEWE CONVENCIONAL', 'AJU', 'Aracaju', 257.30, 11.62, 10),
('NEWE CONVENCIONAL', 'JPA', 'João Pessoa', 257.30, 13.42, 10),
('NEWE CONVENCIONAL', 'SLZ', 'São Luís', 257.30, 13.42, 10),
('NEWE CONVENCIONAL', 'THE', 'Teresina', 257.30, 13.42, 10),
('NEWE CONVENCIONAL', 'FOR', 'Fortaleza', 257.30, 13.42, 10),
('NEWE CONVENCIONAL', 'PMW', 'Palmas', 257.30, 11.62, 10),
('NEWE CONVENCIONAL', 'REC', 'Recife', 257.30, 13.42, 10),
('NEWE CONVENCIONAL', 'SSA', 'Salvador', 257.30, 11.62, 10),
('NEWE CONVENCIONAL', 'SDU', 'Rio de Janeiro (Santos Dumont)', 257.30, 9.51, 10),
('NEWE CONVENCIONAL', 'GIG', 'Rio de Janeiro (Galeão)', 257.30, 9.51, 10),
('NEWE CONVENCIONAL', 'PLU', 'Belo Horizonte (Pampulha)', 257.30, 9.51, 10),
('NEWE CONVENCIONAL', 'CNF', 'Confins', 257.30, 9.51, 10),
('NEWE CONVENCIONAL', 'BSB', 'Brasília', 257.30, 10.43, 10),
('NEWE CONVENCIONAL', 'CGR', 'Campo Grande', 257.30, 10.43, 10),
('NEWE CONVENCIONAL', 'CWB', 'Curitiba', 257.30, 9.51, 10),
('NEWE CONVENCIONAL', 'FLN', 'Florianópolis', 257.30, 9.51, 10),
('NEWE CONVENCIONAL', 'GYN', 'Goiania', 257.30, 10.43, 10),
('NEWE CONVENCIONAL', 'POA', 'Porto Alegre', 257.30, 10.43, 10),
('NEWE CONVENCIONAL', 'CGB', 'Cuiabá', 257.30, 11.62, 10),
('NEWE CONVENCIONAL', 'VIX', 'Vitória', 257.30, 10.43, 10),
('NEWE CONVENCIONAL', 'BVB', 'Boa Vista', 257.30, 16.90, 10),
('NEWE CONVENCIONAL', 'IMP', 'Imperatriz', 257.30, 16.90, 10),
('NEWE CONVENCIONAL', 'MAB', 'Marabá', 257.30, 16.90, 10),
('NEWE CONVENCIONAL', 'MCP', 'Macapá', 257.30, 16.90, 10),
('NEWE CONVENCIONAL', 'PVH', 'Porto Velho', 257.30, 16.90, 10),
('NEWE CONVENCIONAL', 'RBR', 'Rio Branco', 257.30, 16.90, 10),
('NEWE CONVENCIONAL', 'STM', 'Santarém', 257.30, 16.90, 10),
('NEWE CONVENCIONAL', 'MCZ', 'Maceió', 257.30, 11.62, 10),
('NEWE CONVENCIONAL', 'NAT', 'Natal', 257.30, 13.42, 10),
('NEWE CONVENCIONAL', 'BEL', 'Belém', 257.30, 16.90, 10),
('NEWE CONVENCIONAL', 'MAO', 'Manaus', 257.30, 16.90, 10);


CREATE TABLE weair_expresso (
    id SERIAL PRIMARY KEY,
    servico VARCHAR(50) NOT NULL,
    destino VARCHAR(50) NOT NULL,
    frete_minimo DECIMAL(10,2) NOT NULL,
    valor_kilo_excedente DECIMAL(10,5) NOT NULL,
    peso_minimo INT NOT NULL
);

INSERT INTO weair_expresso (servico, destino, frete_minimo, valor_kilo_excedente, peso_minimo) VALUES
('NEWE EXPRESS', 'AJU', 283.50, 12.80, 10),
('NEWE EXPRESS', 'JPA', 283.50, 14.78, 10),
('NEWE EXPRESS', 'SLZ', 283.50, 14.78, 10),
('NEWE EXPRESS', 'THE', 283.50, 14.78, 10),
('NEWE EXPRESS', 'FOR', 283.50, 14.78, 10),
('NEWE EXPRESS', 'PMW', 283.50, 12.80, 10),
('NEWE EXPRESS', 'REC', 283.50, 14.78, 10),
('NEWE EXPRESS', 'SSA', 283.50, 12.80, 10),
('NEWE EXPRESS', 'SDU', 283.50, 10.61, 10),
('NEWE EXPRESS', 'GIG', 283.50, 10.61, 10),
('NEWE EXPRESS', 'PLU', 283.50, 10.61, 10),
('NEWE EXPRESS', 'CNF', 283.50, 10.61, 10),
('NEWE EXPRESS', 'BSB', 283.50, 11.63, 10),
('NEWE EXPRESS', 'CGR', 283.50, 11.63, 10),
('NEWE EXPRESS', 'CWB', 283.50, 10.61, 10),
('NEWE EXPRESS', 'FLN', 283.50, 10.61, 10),
('NEWE EXPRESS', 'GYN', 283.50, 11.63, 10),
('NEWE EXPRESS', 'JOI', 283.50, 10.61, 10),
('NEWE EXPRESS', 'POA', 283.50, 11.63, 10),
('NEWE EXPRESS', 'CGB', 283.50, 12.80, 10),
('NEWE EXPRESS', 'VIX', 283.50, 11.63, 10),
('NEWE EXPRESS', 'BVB', 283.50, 17.31, 10),
('NEWE EXPRESS', 'IMP', 283.50, 17.31, 10),
('NEWE EXPRESS', 'MAB', 283.50, 17.31, 10),
('NEWE EXPRESS', 'MCP', 283.50, 17.31, 10),
('NEWE EXPRESS', 'PVH', 283.50, 17.31, 10),
('NEWE EXPRESS', 'RBR', 283.50, 17.31, 10),
('NEWE EXPRESS', 'STM', 283.50, 17.31, 10),
('NEWE EXPRESS', 'MCZ', 283.50, 12.80, 10),
('NEWE EXPRESS', 'NAT', 283.50, 14.78, 10),
('NEWE EXPRESS', 'BEL', 283.50, 17.31, 10),
('NEWE EXPRESS', 'MAO', 283.50, 17.31, 10);


CREATE TABLE weair_generalidades (
    id SERIAL PRIMARY KEY,
    coleta_horario_descricao TEXT,
    coleta_horario_valor DECIMAL(10,2),
    coleta_emergencia_descricao TEXT,
    coleta_emergencia_valor DECIMAL(10,2),
    seguro DECIMAL(10,5),
    gris DECIMAL(10,5),
    veiculo_ded_50km_desc TEXT,
    veiculo_ded_50km_valor DECIMAL(10,2),
    retira_aeroporto TEXT,
    veiculo_ded_km_desc TEXT,
    veiculo_ded_km_valor DECIMAL(10,2),
    observacoes TEXT
);

INSERT INTO weair_generalidades (
    coleta_horario_descricao,
    coleta_horario_valor,
    coleta_emergencia_descricao,
    coleta_emergencia_valor,
    seguro,
    gris,
    veiculo_ded_50km_desc,
    veiculo_ded_50km_valor,
    retira_aeroporto,
    veiculo_ded_km_desc,
    veiculo_ded_km_valor,
    observacoes
)
VALUES (
    'Coleta com antecedência de 4 horas dentro do horário comercial',
    150.00,

    'Coleta Emergência 24 horas',
    280.00,

    0.007,
    0.0008,

    'Veículo Dedicado Entrega no Destino até 50Km (Fiorino)',
    480.00,

    'Carga Retira Aeroporto sem Custos',

    'Veículo Dedicado Interior Valor por Km',
    4.50,

    'Exceto Regiões Rural, Indígena e Fluvial.'
);


CREATE TABLE weair_proximo_voo (
    id SERIAL PRIMARY KEY,
    peso_ate VARCHAR(20) NOT NULL,
    valor DECIMAL(12,4) NOT NULL
);

INSERT INTO weair_proximo_voo (peso_ate, valor) VALUES
(0.5, 164.81),
(1.0, 201.44),
(1.5, 222.66),
(2.0, 222.66),
(2.5, 318.06),
(3.0, 318.06),
(3.5, 413.50),
(4.0, 413.50),
(4.5, 459.47),
(5.0, 459.47),
(5.5, 505.37),
(6.0, 505.37),
(6.5, 551.32),
(7.0, 551.32),
(7.5, 597.27),
(8.0, 597.27),
(8.5, 643.20),
(9.0, 643.20),
(9.5, 689.15),
(10.0, 689.15),
(10.5, 830.26),
(11.0, 830.26),
(11.5, 885.88),
(12.0, 885.88),
(12.5, 941.50),
(13.0, 941.50),
(13.5, 997.10),
(14.0, 997.10),
(14.5, 1052.69),
(15.0, 1052.69),
(15.5, 957.20),
(16.0, 957.20),
(16.5, 1005.21),
(17.0, 1005.21),
(17.5, 1053.24),
(18.0, 1053.24),
(18.5, 1101.28),
(19.0, 1101.28),
(19.5, 1149.32),
(20.0, 1149.32),
(20.5, 1197.34),
(21.0, 1197.34),
(21.5, 1245.38),
(22.0, 1245.38),
(22.5, 1293.41),
(23.0, 1293.41),
(23.5, 1305.57),
(24.0, 1305.57),
(24.5, 1335.35),
(25.0, 1335.35),
(25.5, 1362.64),
(26.0, 1362.64),
(26.5, 1389.95),
(27.0, 1389.95),
(27.5, 1422.23),
(28.0, 1422.23),
(28.5, 1447.06),
(29.0, 1447.06),
(29.5, 1476.82),
(30.0, 1476.82);


CREATE TABLE weair_proximo_voo_generalidades (
    id SERIAL PRIMARY KEY,
    valor_atualizado DECIMAL(10,2),
    coleta_horario_descricao TEXT,
    coleta_horario_valor DECIMAL(10,2),
    coleta_emergencia_descricao TEXT,
    coleta_emergencia_valor DECIMAL(10,2),
    seguro DECIMAL(10,5),
    gris DECIMAL(10,5),
    veiculo_ded_50km_desc TEXT,
    veiculo_ded_50km_valor DECIMAL(10,2),
    retira_aeroporto TEXT,
    veiculo_ded_km_desc TEXT,
    veiculo_ded_km_valor DECIMAL(10,2),
    observacoes TEXT
);

INSERT INTO weair_proximo_voo_generalidades (
    valor_atualizado,
    coleta_horario_descricao,
    coleta_horario_valor,
    coleta_emergencia_descricao,
    coleta_emergencia_valor,
    seguro,
    gris,
    veiculo_ded_50km_desc,
    veiculo_ded_50km_valor,
    retira_aeroporto,
    veiculo_ded_km_desc,
    veiculo_ded_km_valor,
    observacoes
)
VALUES (
    33.95,

    'Coleta com antecedência de 4 horas dentro do horário comercial',
    150.00,

    'Coleta Emergência 24 horas',
    280.00,

    0.007,
    0.0008,

    'Veículo Dedicado Entrega no Destino até 50Km (Fiorino)',
    480.00,

    'Carga Retira Aeroporto sem Custos',

    'Veículo Dedicado Interior Valor por Km',
    4.50,

    'Exceto Regiões Rural, Indígena e Fluvial.'
);


CREATE TABLE wexpress (
    id SERIAL PRIMARY KEY,
    veiculo VARCHAR(50) NOT NULL,
    peso_min int NOT NULL,
    peso_max int NOT NULL,
    frete_minimo DECIMAL(10,2) NOT NULL,
    km_minimo INT NOT NULL,
    km_excedente DECIMAL(10,2) NOT NULL,
    diaria_veiculo DECIMAL(10,2) NOT NULL,
    seguro_com_ddr DECIMAL(10,5),
    seguro_sem_ddr DECIMAL(10,5),
    gris DECIMAL(10,5)
);

INSERT INTO wexpress 
(veiculo, peso_min, peso_max, frete_minimo, km_minimo, km_excedente, diaria_veiculo, 
 seguro_com_ddr, seguro_sem_ddr, gris)
VALUES
('Fiorino', 0, 550, 398.00, 154, 2.60, 220.00, 0.0010, 0.0010, 0.0008),
('Van', 600, 1200, 655.00, 145, 3.55, 300.00, 0.0010, 0.0010, 0.0008),
('VUC', 1200, 3000, 980.00, 200, 5.00, 390.00, 0.0010, 0.0010, 0.0008),
('03/04', 3000, 6000, 1417.76, 200, 6.00, 500.00, 0.0010, 0.0010, 0.0008),
('Truck', 6000, 14000, 2904.79, 175, 8.33, 700.00, 0.0010, 0.0010, 0.0008),
('Carreta 2 eixos', 14000, 33000, 3304.95, 175, 12.82, 1800.00, 0.0010, 0.0010, 0.0008),
('Carreta 3 eixos', 33000, 41000, 3672.15, 175, 13.50, 1800.00, 0.0010, 0.0010, 0.0008),
('Carreta Cavalo Trucado', 41000, 45000, 4637.30, 175, 10.99, 1800.00, 0.0010, 0.0010, 0.0008),
('Carreta Prancha', 45000, 50000, 3970.67, 175, 15.52, 1800.00, 0.0010, 0.0010, 0.0008);


CREATE TABLE wexpress_generalidades (
    id SERIAL PRIMARY KEY,
    advalorem_rj DECIMAL(10,5),
    batedor_incluso BOOLEAN,
    tap_incluso BOOLEAN,
    drop_valor DECIMAL(10,2),
    faturamento TEXT,
    escolta_incluso BOOLEAN
);

INSERT INTO wexpress_generalidades 
(advalorem_rj, batedor_incluso, tap_incluso, drop_valor, faturamento, escolta_incluso)
VALUES
(0.0035, false, false, 150.00, 'Faturamento Mensal mais 15 dias', false);


CREATE TABLE weair_lead_time (
    id SERIAL PRIMARY KEY,
    iata CHAR(3) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    uf CHAR(2) NOT NULL,
    convencional INT,
    expresso INT,
    proximo_voo INT,
    conexao BOOLEAN
);

INSERT INTO weair_lead_time (iata, cidade, uf, convencional, expresso, proximo_voo, conexao) VALUES
('AJU','Aracaju','SE',4,3,1,false),
('BEL','Belém','PA',5,3,1,false),
('BNU','Blumenau','SC',3,3,1,false),
('BSB','Brasília','DF',3,3,1,false),
('BVB','Boa Vista','RR',7,4,2,true),
('CGB','Cuiaba','MT',5,3,1,false),
('CGR','Campo Grande','MS',5,3,1,false),
('CWB','Curitiba','PR',3,3,1,false),
('CXJ','Caxias do Sul','RS',3,2,1,false),
('FLN','Florianópolis','SC',3,2,1,false),
('FOR','Fortaleza','CE',4,3,1,false),
('GIG','Rio de Janeiro (Galeão)','RJ',3,2,1,false),
('GYN','Goiania','GO',4,3,1,false),
('IMP','Imperatriz','MA',4,NULL,1,false),
('IOS','Ilhéus','BA',4,3,1,false),
('JOI','Joinville','SC',3,2,1,false),
('JPA','João Pessoa','PB',4,4,1,false),
('LDB','Londrina','PR',3,3,1,false),
('MAB','Marabá','PA',6,4,2,true),
('MAO','Manaus','AM',6,4,1,false),
('MCP','Macapá','AP',7,3,2,true),
('MGF','Maringá','PR',3,3,1,false),
('NAT','Natal','RN',4,3,1,false),
('NVT','Navegantes','SC',3,3,1,false),
('PMW','Palmas','TO',4,3,1,false),
('POA','Porto Alegre','RS',3,3,1,false),
('PVH','Porto Velho','RO',7,4,2,true),
('RBR','Rio Branco','AC',7,4,2,true),
('REC','Recife','PE',5,3,1,false),
('SDU','Rio de Janeiro (Santos Dumont)','RJ',3,3,1,false),
('SLZ','São Luís','MA',5,4,1,false),
('SSA','Salvador','BA',3,3,1,false),
('STM','Santarém','PA',6,4,2,true),
('THE','Teresina','PI',5,4,1,false),
('UDI','Uberlândia','MG',3,3,1,false),
('VIX','Vitória','ES',3,3,1,false),
('CNF','Belo Horizonte','MG',3,3,1,false),
('PLU','Belo Horizonte (Pampulha)','MG',3,3,1,false),
('MCZ','Maceió','AL',4,3,1,false),
('LFR','Lauro de Freitas','BA',4,3,1,false);


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

insert into responsaveisVistoria values
(1), (2), (3);

INSERT INTO Evento (Nome_Evento, Data_Evento, Duracao_Evento, Local_Evento, ID_Tipo_Evento, Descricao, Criado_Por) VALUES
('Workshop Gestão', '2025-11-20 09:00:00', '4h', 'Auditório P.', 2, 'Workshop de gestão.', 1),
('Treinamento Oper', '2025-11-22 14:00:00', '3h', 'Sala T2', 1, 'Treinamento operacional.', 1),
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
-- Rode este comando no seu banco de dados
ALTER TABLE Certificado_Participacao
ADD COLUMN Arquivo_PDF VARCHAR(255) NULL;

	
