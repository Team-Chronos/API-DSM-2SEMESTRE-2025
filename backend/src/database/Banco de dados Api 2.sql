CREATE DATABASE Api_2;
USE Api_2;

CREATE TABLE Setor (
    ID_Setor INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Setor VARCHAR(255) NOT NULL,
    Descricao VARCHAR(255) NOT NULL
);

CREATE TABLE Cargo (
    ID_Cargo INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Cargo VARCHAR(100) NOT NULL,
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

CREATE TABLE Tipo_Evento(
    ID_Tipo_Evento INT PRIMARY KEY AUTO_INCREMENT,
    Tipo_Evento_Nome ENUM("Feira", "Workshop", "Reunião")
);

CREATE TABLE Evento (
    ID_Evento INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Evento VARCHAR(255) NOT NULL,
    Data_Evento DATETIME NOT NULL,
    Duracao_Evento VARCHAR(30),
    Local_Evento VARCHAR(255) NOT NULL,
    ID_Tipo_Evento INT NOT NULL,
    Descricao TEXT NOT NULL,
    Criado_Por INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Criado_Por) REFERENCES Colaboradores(ID_colaborador),
    FOREIGN KEY (ID_Tipo_Evento) REFERENCES Tipo_Evento(ID_Tipo_Evento) 
);

CREATE TABLE Status_Participacao (
    ID_Status INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Status ENUM('Pendente','Confirmado','Recusado', 'Concluído') NOT NULL
);

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
    Arquivo_PDF VARCHAR(255) NULL,
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
    ID_Cliente INT AUTO_INCREMENT PRIMARY KEY,
    Nome_Cliente VARCHAR(255) NOT NULL,
    Telefone_Cliente VARCHAR(20),
    Email_Cliente VARCHAR(255),
    Segmento VARCHAR(100) NOT NULL,
    Etapa VARCHAR(255) DEFAULT 'Prospects',
    atividade VARCHAR(100),
    Cidade VARCHAR(100) NULL,
    depart_responsavel VARCHAR(100),
    Ultima_Interacao DATETIME NULL,
    Criado_Por INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Criado_Por) REFERENCES Colaboradores(ID_colaborador)
);

CREATE TABLE Historico_Interacao (
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

CREATE TABLE responsaveisVistoria(
    id_responsavel INT PRIMARY KEY,
    FOREIGN KEY (id_responsavel) REFERENCES Colaboradores(ID_colaborador)
);

CREATE TABLE checklistVeiculoAgregado(
    ID_cva INT PRIMARY KEY AUTO_INCREMENT,
    nome_motorista VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    placa_veiculo VARCHAR(7) NOT NULL,
    tipo_veiculo VARCHAR(127) NOT NULL,
    nivel_oleo ENUM("sim", "não", "na") NOT NULL,
    vazamento_oleo ENUM("sim", "não", "na") NOT NULL,
    nivel_agua ENUM("sim", "não", "na") NOT NULL,
    foto_motor VARCHAR(255) NOT NULL,
    foto_etiqueta_troca_oleo VARCHAR(255),
    pne_liso ENUM("sim", "não") NOT NULL,
    pte_liso ENUM("sim", "não") NOT NULL,
    ptd_liso ENUM("sim", "não") NOT NULL,
    pdd_liso ENUM("sim", "não") NOT NULL,
    pne_foto VARCHAR(255) NOT NULL,
    pte_foto VARCHAR(255) NOT NULL,
    ptd_foto VARCHAR(255) NOT NULL,
    pdd_foto VARCHAR(255) NOT NULL,
    parabrisa_perfeito ENUM("sim", "não", "na") NOT NULL,
    cabine_externa_limpa ENUM("sim", "não", "na") NOT NULL,
    veiculo_externo_limpo ENUM("sim", "não", "na") NOT NULL,
    sem_amassado_ferrugem ENUM("sim", "não", "na") NOT NULL,
    assoalho_conservado ENUM("sim", "não", "na") NOT NULL,
    faixas_refletivas ENUM("sim", "não", "na") NOT NULL,
    parabrisa_funcionando ENUM("sim", "não", "na") NOT NULL,
    buzina_funciona ENUM("sim", "não", "na") NOT NULL,
    farol_alto ENUM("sim", "não", "na") NOT NULL,
    farol_baixo ENUM("sim", "não", "na") NOT NULL,
    setas_dianteiras ENUM("sim", "não", "na") NOT NULL,
    setas_traseiras ENUM("sim", "não", "na") NOT NULL,
    pisca_alerta ENUM("sim", "não", "na") NOT NULL,
    luz_freio ENUM("sim", "não", "na") NOT NULL,
    luz_re ENUM("sim", "não", "na") NOT NULL,
    sirene_re ENUM("sim", "não", "na") NOT NULL,
    extintor ENUM("sim", "não", "na") NOT NULL,
    step ENUM("sim", "não", "na") NOT NULL,
    triangulo ENUM("sim", "não", "na") NOT NULL,
    macaco ENUM("sim", "não", "na") NOT NULL,
    chave_roda ENUM("sim", "não", "na") NOT NULL,
    capacete_seguranca ENUM("sim", "não", "na") NOT NULL,
    colete_seguranca ENUM("sim", "não", "na") NOT NULL,
    bota_seguranca ENUM("sim", "não", "na") NOT NULL,
    foto_frente VARCHAR(255) NOT NULL,
    foto_lateral_direita VARCHAR(255) NOT NULL,
    foto_lateral_esquerda VARCHAR(255) NOT NULL,
    foto_traseira VARCHAR(255) NOT NULL,
    observacoes TEXT,
    id_responsavel_vistoria INT,
    nome_responsavel_vistoria VARCHAR(255),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_responsavel_vistoria) REFERENCES responsaveisVistoria (id_responsavel)
);

CREATE TABLE ChecklistPredial (
  CheckPredio INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  NomeFuncPredio VARCHAR(50),
  DataPredio DATETIME DEFAULT CURRENT_TIMESTAMP,
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
    id INT AUTO_INCREMENT PRIMARY KEY,
    servico VARCHAR(50) NOT NULL,
    cita CHAR(3) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    frete_minimo DECIMAL(10,2) NOT NULL,
    valor_kilo_excedente DECIMAL(10,5) NOT NULL,
    peso_minimo INT NOT NULL
);

CREATE TABLE weair_expresso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    servico VARCHAR(50) NOT NULL,
    destino VARCHAR(50) NOT NULL,
    frete_minimo DECIMAL(10,2) NOT NULL,
    valor_kilo_excedente DECIMAL(10,5) NOT NULL,
    peso_minimo INT NOT NULL
);

CREATE TABLE weair_generalidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
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

CREATE TABLE weair_proximo_voo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    peso_ate VARCHAR(20) NOT NULL,
    valor DECIMAL(12,4) NOT NULL
);

CREATE TABLE weair_proximo_voo_generalidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
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

CREATE TABLE wexpress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    veiculo VARCHAR(50) NOT NULL,
    peso_min INT NOT NULL,
    peso_max INT NOT NULL,
    frete_minimo DECIMAL(10,2) NOT NULL,
    km_minimo INT NOT NULL,
    km_excedente DECIMAL(10,2) NOT NULL,
    diaria_veiculo DECIMAL(10,2) NOT NULL,
    seguro_com_ddr DECIMAL(10,5),
    seguro_sem_ddr DECIMAL(10,5),
    gris DECIMAL(10,5)
);

CREATE TABLE wexpress_generalidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    advalorem_rj DECIMAL(10,5),
    batedor_incluso BOOLEAN,
    tap_incluso BOOLEAN,
    drop_valor DECIMAL(10,2),
    faturamento TEXT,
    escolta_incluso BOOLEAN
);

CREATE TABLE wexpress_cotacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    origem_uf VARCHAR(2) NOT NULL,
    origem_cidade VARCHAR(100) NOT NULL,
    destino_uf VARCHAR(2) NOT NULL,
    destino_cidade VARCHAR(100) NOT NULL,
    remetente VARCHAR(200),
    peso_carga DECIMAL(10,2) NOT NULL,
    valor_carga DECIMAL(15,2) NOT NULL,
    tipo_carga VARCHAR(200),
    pedagio DECIMAL(10,2),
    distancia_km DECIMAL(10,2) NOT NULL,
    veiculo_id INTEGER NOT NULL,
    imposto DECIMAL(15,2) NOT NULL,
    custo DECIMAL(15,2) NOT NULL,
    frete DECIMAL(15,2) NOT NULL,
    total DECIMAL(15,2) NOT NULL,
    liquido DECIMAL(15,2) NOT NULL,
    margem DECIMAL(10,5) NOT NULL,
    drop_servico BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'ABERTA',
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (veiculo_id) REFERENCES wexpress(id) ON DELETE RESTRICT
);

CREATE TABLE weair_lead_time (
    id INT AUTO_INCREMENT PRIMARY KEY,
    iata CHAR(3) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    uf CHAR(2) NOT NULL,
    convencional INT,
    expresso INT,
    proximo_voo INT,
    conexao BOOLEAN
);

INSERT INTO Tipo_Evento (Tipo_Evento_Nome) VALUES ('Feira'), ('Workshop'), ('Reunião');

INSERT INTO Status_Participacao (Nome_Status) VALUES ('Pendente'), ('Confirmado'), ('Recusado'), ('Concluído');

INSERT INTO Setor (Nome_Setor, Descricao) VALUES 
('Administrativo', 'Operações administrativas'),
('Comercial', 'Vendas e relacionamento'),
('Operacional', 'Execução das atividades');

INSERT INTO Cargo (Nome_Cargo, Nivel_Acesso) VALUES
('Gerente', 'Gestor'), 
('Coordenador', 'Gestor'),
('Assistente', 'Colaborador'), 
('Analista', 'Colaborador');

INSERT INTO Colaboradores (Email, Senha, Nome_Col, Setor, CPF, Telefone, ID_Cargo) VALUES
('jv.moura.sjc@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'João Victor Moura', 2, '12345678901', '11999999999', 1),
('rafael@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Rafael Sette', 1, '77777777777', '12988777777', 1),
('rebeca@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Rebeca Lima', 1, '99999999999', '11999999999', 1),
('rubim@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Ana Julia Rubim', 1, '88888888888', '11999998888', 1),
('lazaro@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Gabriel Lazaro', 1, '66666666666', '11994444499', 1),
('enzo@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Enzo de Paula', 1, '17221722172', '11945699399', 1);
INSERT INTO Cliente (Nome_Cliente, Telefone_Cliente, Email_Cliente, Segmento, atividade, Cidade, depart_responsavel, Ultima_Interacao, Criado_Por) VALUES
('Transportadora São Paulo Ltda', '11987654321', 'contato@transpsp.com.br', 'Logística', 'Transporte Rodoviário', 'São Paulo', 'Comercial', '2025-11-20 14:30:00', 1),
('Indústria Metal Brasil S.A.', '11976543210', 'vendas@metalbrasil.com.br', 'Industrial', 'Fabricação de Peças', 'Guarulhos', 'Comercial', '2025-11-19 10:00:00', 2),
('Supermercado Central', '21987651234', 'compras@supercentral.com.br', 'Varejo', 'Supermercado', 'Rio de Janeiro', 'Comercial', NULL, 1),
('Farmácia Saúde Total', '11965432187', 'farmacia@saudetotal.com.br', 'Farmacêutico', 'Drogaria', 'São Paulo', 'Comercial', '2025-11-15 16:00:00', 2),
('Construtora Alicerce Forte', '11954321987', 'projetos@alicerceforte.com.br', 'Construção Civil', 'Obras', 'Campinas', 'Comercial', '2025-11-18 09:30:00', 1),
('Tech Solutions Informática', '11943219876', 'ti@techsolutions.com.br', 'Tecnologia', 'TI e Software', 'São José dos Campos', 'Comercial', '2025-11-21 11:00:00', 2),
('Distribuidora Alimentícia ABC', '11932198765', 'comercial@distribabc.com.br', 'Alimentos e Bebidas', 'Distribuição', 'Santos', 'Comercial', '2025-11-17 14:00:00', 1),
('Fábrica de Móveis São João', '11921987654', 'vendas@moveissaojoao.com.br', 'Móveis', 'Fabricação', 'São Bernardo do Campo', 'Comercial', NULL, 2),
('Clínica Médica Vida Plena', '11912876543', 'atendimento@vidaplena.com.br', 'Saúde', 'Clínica Médica', 'São Paulo', 'Comercial', '2025-11-20 15:30:00', 1),
('AutoPeças Veloz', '11998765432', 'pecas@velocauto.com.br', 'Automotivo', 'Peças Automotivas', 'Osasco', 'Comercial', '2025-11-19 13:00:00', 2),
('Padaria e Confeitaria Delícia', '11987654322', 'padaria@delicia.com.br', 'Alimentação', 'Panificação', 'São Paulo', 'Comercial', '2025-11-21 08:00:00', 1),
('Escola Técnica Futuro', '11976543211', 'secretaria@escolafuturo.com.br', 'Educação', 'Ensino Técnico', 'São Paulo', 'Comercial', NULL, 2),
('Loja de Roupas Fashion Style', '11965432188', 'loja@fashionstyle.com.br', 'Moda', 'Varejo de Roupas', 'São Paulo', 'Comercial', '2025-11-16 10:30:00', 1),
('Gráfica Rápida Impressões', '11954321988', 'grafica@rapidaimpressoes.com.br', 'Gráfica', 'Impressão Gráfica', 'Barueri', 'Comercial', '2025-11-18 14:00:00', 2),
('Pet Shop Amigo Fiel', '11943219877', 'petshop@amigofiel.com.br', 'Pet Shop', 'Produtos para Pets', 'São Paulo', 'Comercial', '2025-11-21 09:00:00', 1),
('Laboratório Análises Clínicas', '11932198766', 'lab@analisesclinicas.com.br', 'Saúde', 'Laboratório', 'Santo André', 'Comercial', '2025-11-14 11:00:00', 2),
('Importadora Global Trade', '11921987655', 'importacao@globaltrade.com.br', 'Importação', 'Comércio Exterior', 'São Paulo', 'Comercial', '2025-11-20 16:00:00', 1),
('Hotel Conforto Plaza', '11912876544', 'reservas@confortoplaza.com.br', 'Hotelaria', 'Hospedagem', 'São Paulo', 'Comercial', NULL, 2),
('Academia Corpo em Forma', '11998765433', 'academia@corpoemforma.com.br', 'Fitness', 'Academia', 'São Paulo', 'Comercial', '2025-11-21 07:00:00', 1),
('Agência de Publicidade Criativa', '11987654323', 'agencia@criativa.com.br', 'Marketing', 'Publicidade', 'São Paulo', 'Comercial', '2025-11-19 15:00:00', 2);

INSERT INTO responsaveisVistoria VALUES (1), (2), (3);

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

INSERT INTO Relatorio (Nome_Relatorio, Tipo_Relatorio, Gerado_Por) VALUES
('Relatorio_Eventos_202412.pdf', 'eventos', 1),
('Relatorio_Comercial_Q4.xlsx', 'clientes', 2);

INSERT INTO notificacoes_personalizadas (titulo, mensagem, destinatarios, prioridade, criado_por, tipo) VALUES
('Bem-vindo', 'Sistema ativo.', '"todos"', 'media', 1, 'sistema'),
('Manutenção', 'Sábado 08h-12h.', '"todos"', 'alta', 1, 'sistema');

INSERT INTO historico_modalidade (colaborador_id, modalidade) VALUES (1, 'Remoto');

INSERT INTO wexpress (veiculo, peso_min, peso_max, frete_minimo, km_minimo, km_excedente, diaria_veiculo, seguro_com_ddr, seguro_sem_ddr, gris) VALUES
('Fiorino', 0, 550, 398.00, 154, 2.60, 220.00, 0.0010, 0.0010, 0.0008),
('Van', 600, 1200, 655.00, 145, 3.55, 300.00, 0.0010, 0.0010, 0.0008),
('VUC', 1200, 3000, 980.00, 200, 5.00, 390.00, 0.0010, 0.0010, 0.0008),
('03/04', 3000, 6000, 1417.76, 200, 6.00, 500.00, 0.0010, 0.0010, 0.0008),
('Truck', 6000, 14000, 2904.79, 175, 8.33, 700.00, 0.0010, 0.0010, 0.0008),
('Carreta 2 eixos', 14000, 33000, 3304.95, 175, 12.82, 1800.00, 0.0010, 0.0010, 0.0008),
('Carreta 3 eixos', 33000, 41000, 3672.15, 175, 13.50, 1800.00, 0.0010, 0.0010, 0.0008),
('Carreta Cavalo Trucado', 41000, 45000, 4637.30, 175, 10.99, 1800.00, 0.0010, 0.0010, 0.0008),
('Carreta Prancha', 45000, 50000, 3970.67, 175, 15.52, 1800.00, 0.0010, 0.0010, 0.0008);

INSERT INTO wexpress_generalidades (advalorem_rj, batedor_incluso, tap_incluso, drop_valor, faturamento, escolta_incluso) VALUES
(0.0035, false, false, 150.00, 'Faturamento Mensal mais 15 dias', false);
