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

CREATE TABLE Evento (
    ID_Evento INT PRIMARY KEY AUTO_INCREMENT,
    Nome_Evento VARCHAR(255) NOT NULL,
    Data_Evento DATETIME NOT NULL,
    Duracao_Evento varchar(30),
    Local_Evento VARCHAR(255) NOT NULL,
    Descricao TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
    Etapa ENUM('Inicial', 'Em andamento', 'Finalizada') DEFAULT 'Inicial',
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
('jv.moura.sjc@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'João Victor Moura', 2, '12345678901', '11999999999', 1),
('rafael@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Rafael Sette', 1, '77777777777', '12988777777', 1),
('rebeca@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Rebeca Lima', 1, '99999999999', '11999999999', 1),
('rubim@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Ana Julia Rubim', 1, '88888888888', '11999998888', 1),
('lazaro@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Gabriel Lazaro', 1, '66666666666', '11994444499', 1),
('enzo@gmail.com', '$2a$10$N58kA4rPjE2nTUKAHNHHTeOhYwwSwXsm7/eOI8zEBdd3RT/mOXlU2', 'Enzo de Paula', 1, '17221722172', '11945699399', 1);

INSERT INTO Evento (Nome_Evento, Data_Evento, Duracao_Evento, Local_Evento, Descricao) VALUES
('Workshop de Gestão de Projetos', '2025-11-20 09:00:00', '4h', 'Auditório Principal', 'Workshop para aprimorar habilidades em gestão de projetos.'),
('Treinamento Operacional', '2025-11-22 14:00:00', '3h', 'Sala de Treinamento 2', 'Treinamento prático para a equipe operacional.'),
('Reunião Comercial Mensal', '2025-11-25 10:00:00', '2h', 'Sala de Reuniões 1', 'Discussão das metas e estratégias comerciais do mês.'),
('Seminário de Inovação', '2025-12-01 09:00:00', '5h', 'Auditório Principal', 'Seminário sobre tendências e inovações no setor.'),
('Palestra Motivacional', '2025-12-05 15:00:00', '2h', 'Auditório Secundário', 'Palestra para engajar e motivar a equipe.');


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
INSERT INTO Cliente (Nome_Cliente, Email_Cliente, Telefone_Cliente, Endereco, atividade, segmento_atuacao, depart_responsavel) VALUES
('Agropecuária Boa Safra Ltda.', 'contato@boasafra.com.br', '(11) 98765-4321', 'Rodovia Anhanguera, km 318, Ribeirão Preto - SP', 'Cultivo de Soja e Milho', 'Industria', 'Compras'),
('Indústria Têxtil Fia-Forte S.A.', 'comercial@fiaforte.com.br', '(81) 91234-5678', 'Av. Caxangá, 2500, Recife - PE', 'Fabricação de Tecidos', 'Industria', 'Suprimentos'),
('Metalúrgica Inova Aço Ltda.', 'vendas@inovaaco.com.br', '(31) 99988-7766', 'Rua dos Timbiras, 1532, Belo Horizonte - MG', 'Produção de Peças Metálicas', 'Industria', 'Engenharia'),
('Móveis Design Conforto Eireli', 'atendimento@moveisdesign.com', '(41) 98877-6655', 'Av. das Indústrias, 123, Curitiba - PR', 'Fabricação de Móveis Planejados', 'Industria', 'Produção'),
('Alimentos Sabor da Terra S.A.', 'diretoria@sabordaterra.ind.br', '(51) 97654-3210', 'Estrada do Arroz, 450, Pelotas - RS', 'Processamento de Alimentos', 'Industria', 'Logística'),
('Cosméticos Bella Pele Ltda.', 'financeiro@bellapele.ind.br', '(21) 96543-2109', 'Av. Rio Branco, 1, Rio de Janeiro - RJ', 'Produção de Cosméticos', 'Industria', 'Financeiro'),
('Calçados Passo Certo Indústria e Comércio', 'rh@passocerto.ind.br', '(51) 95432-1098', 'Rua da Produção, 789, Novo Hamburgo - RS', 'Fabricação de Calçados', 'Industria', 'Recursos Humanos'),
('Indústria Farmacêutica Vida Longa S.A.', 'qualidade@vidalonga.com', '(11) 94321-0987', 'Av. das Nações Unidas, 11541, São Paulo - SP', 'Fabricação de Medicamentos', 'Industria', 'Qualidade'),
('Plásticos Flexíveis Embala Tudo Ltda.', 'contato@embalatudo.com.br', '(19) 93210-9876', 'Rua da Indústria, 500, Campinas - SP', 'Fabricação de Embalagens', 'Industria', 'Comercial'),
('Automotive Systems S.A.', 'engenharia@automotivesystems.com', '(12) 92109-8765', 'Av. Cassiano Ricardo, 1333, São José dos Campos - SP', 'Fabricação de Autopeças', 'Industria', 'Desenvolvimento'),
('Construtora e Incorporadora Morar Bem', 'obras@morarbem.com', '(62) 91098-7654', 'Av. T-4, 1478, Goiânia - GO', 'Construção de Edifícios', 'Industria', 'Operações'),
('Indústria Química Alfa Ltda.', 'laboratorio@alfaquimica.com', '(71) 99876-5432', 'Polo Petroquímico, s/n, Camaçari - BA', 'Produção de Componentes Químicos', 'Industria', 'Pesquisa e Desenvolvimento'),
('Papel e Celulose Brasil S.A.', 'meioambiente@pcbrasil.com', '(27) 98765-4321', 'Rodovia BR-101, km 60, Aracruz - ES', 'Produção de Celulose', 'Industria', 'Sustentabilidade'),
('Cimenteira Rocha Forte Ltda.', 'vendas.industria@rochaforte.com', '(85) 97654-3210', 'Rodovia do Cimento, 100, Caucaia - CE', 'Fabricação de Cimento', 'Industria', 'Vendas'),
('Geradores de Energia PowerOn S.A.', 'suporte.tecnico@poweron.com', '(47) 96543-2109', 'Rua dos Motores, 321, Jaraguá do Sul - SC', 'Fabricação de Geradores', 'Industria', 'Manutenção'),
('Supermercado Preço Bom Ltda.', 'gerencia@precobom.com.br', '(11) 95432-1098', 'Av. Paulista, 2000, São Paulo - SP', 'Comércio Varejista de Alimentos', 'Comercio', 'Gerência'),
('Magazine Inova Tudo S.A.', 'compras@inovatudo.com', '(11) 94321-0987', 'Rua Augusta, 1500, São Paulo - SP', 'Comércio Varejista de Eletrônicos', 'Comercio', 'Compras'),
('Livraria e Papelaria Saber e Ler', 'atendimento@sabereler.com.br', '(21) 93210-9876', 'Rua da Carioca, 50, Rio de Janeiro - RJ', 'Comércio de Livros e Material Escolar', 'Comercio', 'Atendimento ao Cliente'),
('Atacadista Distribui Bem Ltda.', 'logistica@distribuibem.com', '(31) 92109-8765', 'Anel Rodoviário, 12000, Belo Horizonte - MG', 'Comércio Atacadista de Mercadorias', 'Comercio', 'Logística'),
('Farmácia Saúde Total Eireli', 'farmaceutico@saudetotal.com', '(41) 91098-7654', 'Rua XV de Novembro, 300, Curitiba - PR', 'Comércio de Produtos Farmacêuticos', 'Comercio', 'Farmacêutico Responsável'),
('Loja de Roupas Estilo Único', 'estilo@estilounico.com.br', '(51) 99876-5432', 'Rua da Praia, 800, Porto Alegre - RS', 'Comércio Varejista de Vestuário', 'Comercio', 'Vendas'),
('Pet Shop Mundo Animal Ltda.', 'contato@mundoanimalpet.com.br', '(61) 98765-4321', 'CLS 305 Bloco A, Brasília - DF', 'Comércio de Artigos para Animais', 'Comercio', 'Gerência'),
('Concessionária Auto Rápido S.A.', 'vendas@autorapido.com', '(71) 97654-3210', 'Av. Tancredo Neves, 1234, Salvador - BA', 'Comércio de Veículos', 'Comercio', 'Vendas'),
('Casa & Construção Materiais', 'orcamento@casaconstrucao.com', '(85) 96543-2109', 'Av. Bezerra de Menezes, 500, Fortaleza - CE', 'Comércio de Material de Construção', 'Comercio', 'Orçamento'),
('Distribuidora de Bebidas Gelada Hora', 'pedidos@geladahora.com', '(81) 95432-1098', 'Rua da Aurora, 177, Recife - PE', 'Comércio Atacadista de Bebidas', 'Comercio', 'Logística'),
('Loja de Calçados Pisa Forte', 'atendimento@pisaforte.com', '(11) 94321-0987', 'Rua Teodoro Sampaio, 900, São Paulo - SP', 'Comércio Varejista de Calçados', 'Comercio', 'Vendas'),
('Comércio de Importados Global Trade', 'import@globaltrade.com', '(41) 93210-9876', 'Porto de Paranaguá, s/n, Paranaguá - PR', 'Comércio de Importados', 'Comercio', 'Importação'),
('Mercado de Orgânicos Vida Leve', 'contato@vidaleveorganicos.com', '(21) 92109-8765', 'Rua das Laranjeiras, 400, Rio de Janeiro - RJ', 'Comércio de Produtos Orgânicos', 'Comercio', 'Compras'),
('Joalheria Brilho Eterno Ltda.', 'design@brilhoeterno.com', '(31) 91098-7654', 'Rua da Bahia, 1000, Belo Horizonte - MG', 'Comércio de Joias', 'Comercio', 'Design'),
('Loja de Brinquedos Criança Feliz', 'estoque@criancafeliz.com', '(11) 99876-5432', 'Rua 25 de Março, 123, São Paulo - SP', 'Comércio Varejista de Brinquedos', 'Comercio', 'Estoque'),
('Escritório de Advocacia Justo & Certo', 'juridico@justoecerto.adv.br', '(11) 98765-1234', 'Av. Brigadeiro Faria Lima, 4440, São Paulo - SP', 'Serviços Advocatícios', 'Serviços', 'Jurídico'),
('Clínica Médica Bem Estar', 'agendamento@clinicabemestar.med.br', '(21) 97654-2345', 'Av. Copacabana, 700, Rio de Janeiro - RJ', 'Atendimento Médico', 'Serviços', 'Administrativo'),
('Consultoria em TI Inova Solution', 'projetos@inovasolution.com.br', '(11) 96543-3456', 'Rua Vergueiro, 3000, São Paulo - SP', 'Consultoria em Tecnologia da Informação', 'Serviços', 'Projetos'),
('Agência de Publicidade Cria Ação', 'criacao@criacao.pub', '(31) 95432-4567', 'Rua Fernandes Tourinho, 50, Belo Horizonte - MG', 'Criação de Campanhas Publicitárias', 'Serviços', 'Criação'),
('Escola de Idiomas Fale Mais', 'matricula@falemais.edu.br', '(41) 94321-5678', 'Alameda Dr. Carlos de Carvalho, 800, Curitiba - PR', 'Ensino de Idiomas', 'Serviços', 'Secretaria'),
('Salão de Beleza Toque Final', 'agendamento@toquefinal.com.br', '(51) 93210-6789', 'Rua Padre Chagas, 200, Porto Alegre - RS', 'Serviços de Cabeleireiro e Estética', 'Serviços', 'Recepção'),
('Restaurante Tempero Brasileiro', 'reservas@temperobrasileiro.com', '(61) 92109-7890', 'SHIS QI 11 Bloco J, Brasília - DF', 'Serviços de Alimentação', 'Serviços', 'Gerência'),
('Academia Corpo em Movimento', 'planos@corpoemmovimento.fit', '(71) 91098-8901', 'Av. Oceânica, 300, Salvador - BA', 'Atividades de Condicionamento Físico', 'Serviços', 'Comercial'),
('Transportadora Rápido Log S.A.', 'operacional@rapidolog.com', '(11) 99876-9012', 'Rodovia Presidente Dutra, km 220, Guarulhos - SP', 'Transporte Rodoviário de Cargas', 'Serviços', 'Operacional'),
('Serviços de Limpeza Brilho Total', 'orcamento@brilhototal.serv.br', '(81) 98765-0123', 'Rua do Sol, 100, Recife - PE', 'Limpeza Predial e Industrial', 'Serviços', 'Comercial'),
('Estúdio de Fotografia Click Perfeito', 'ensaio@clickperfeito.com', '(21) 97654-1234', 'Rua Visconde de Pirajá, 50, Rio de Janeiro - RJ', 'Serviços de Fotografia', 'Serviços', 'Atendimento'),
('Manutenção Predial Repara Já', 'chamados@reparaja.com', '(11) 96543-2345', 'Rua da Consolação, 222, São Paulo - SP', 'Manutenção Elétrica e Hidráulica', 'Serviços', 'Técnico'),
('Agência de Viagens Mundo Afora', 'pacotes@mundoafora.tur.br', '(11) 95432-3456', 'Alameda Santos, 1000, São Paulo - SP', 'Agenciamento de Viagens', 'Serviços', 'Vendas'),
('Segurança Patrimonial Protege S.A.', 'monitoramento@protege.seg.br', '(31) 94321-4567', 'Av. do Contorno, 8000, Belo Horizonte - MG', 'Serviços de Vigilância e Segurança', 'Serviços', 'Monitoramento'),
('Escritório de Contabilidade Conta Certa', 'fiscal@contacerta.com.br', '(11) 93210-5678', 'Praça da Sé, 100, São Paulo - SP', 'Serviços Contábeis', 'Serviços', 'Departamento Fiscal');