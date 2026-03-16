# API DSM 2 SEMESTRE 2025

# Plataforma Integrada para Gestão Administrativa, Comercial e Operacional - Newe

<h2 align="center"> Chronos </h2>

<p align="center">
  <a href ="#desafio">Desafio</a>  |
  <a href ="#solucao">Solução</a>  |   
  <a href ="#backlog">Backlog do Produto</a>  |
  <a href ="#dor">DoR</a>  |
  <a href ="#dod">DoD</a>  |
  <a href ="#instalacao">Manual de Instalação</a>
  <a href ="#branch">Estratégia de Branch</a>  |
  <a href ="#vpc">Value Proposition Canvas</a>  |
  <a href ="#sprint">Cronograma de Sprints</a>  |
  <a href ="#tecnologias">Tecnologias</a> |
  <a href ="#equipe">Equipe</a> |
</p>

> Status do Projeto: Concluída ✅ 
>
> Pasta de Documentação: [Documentação das Sprints](https://github.com/Team-Chronos/API-DSM-2SEMESTRE-2025/tree/main/docs)
> 
> Video do Projeto: Indisponível 📽️

## 🏅 Desafio <a id="desafio"></a>

O desafio consiste em desenvolver uma plataforma única que centralize e padronize processos administrativos, comerciais e operacionais, facilitando a visualização das informações, notificações e relatórios, garantindo maior eficiência e controle para a empresa.

## 🏅 Solução <a id="solucao"></a>

A plataforma Newe CRM consiste em um sistema que visa a centralização de dados e processos em uma única plataforma que permite um maior controle e acompanhamento de treinamentos, vendas e operações, além de relatórios precisos e em tempo real para tomada de decisão, reduzindo retrabalho e risco de erros, de maneira rápida, eficiente e direta.

---

## 📋 Backlog do Produto <a id="backlog"></a>

| Rank | Prioridade | User Story                                                                                                                                                                                                      | Estimativa | Sprint | Status |
| :--: | :--------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: | :----: | :----: |
|   1  |    Alta    | Como um usuário cadastrado, eu quero fazer login na plataforma utilizando meu e-mail empresarial para acessar o sistema de forma segura e utilizar suas funcionalidades.                                        |       5      |    1   |   ✅   |
|   2  |    Alta    | Como um administrador, eu quero cadastrar colaboradores com nome e informações básicas para ter um registro centralizado da equipe.                                                                             |       5      |    1   |   ✅   |
|   3  |    Alta    | Como um vendedor, eu quero registrar o cadastro completo de clientes (nome, endereço, atividade, segmento, contatos, departamento) para centralizar as informações do contato.                                  |       5      |    2   |   ✅   |
|   4  |    Alta    | Como um vendedor, eu quero registrar o histórico completo de interações com os clientes (data, forma de contato, relatório detalhado) para acompanhar o relacionamento.                                         |       4      |    2   |   ✅   |
|   5  |    Alta    | Como um gerente, eu quero gerar relatórios e gráficos quantitativos sobre interações, vendas, e clientes (por cidade, segmento), com filtros de período (dia, mês, ano), para tomar decisões baseadas em dados. |       6      |    2   |   ✅   |
|   6  |    Alta    | Como um agregado, eu quero me cadastrar e que me seja enviada uma devolutiva automática, para saber se fui cadastrado corretamente.                                                                             |       4      |    1   |   ✅   |
|   7  |    Alta    | Como um gestor, eu quero ter uma visão centralizada de todos os checklists e cadastros para simplificar o acesso e padronizar as operações.                                                                     |       3      |    1   |   ✅   |
|   8  |    Média   | Como um organizador de eventos, eu quero que o sistema envie notificações automáticas sobre novos eventos, presenciais ou online (com link) para os colaboradores, para garantir que todos sejam informados.    |       4      |    1   |   ✅   |
|   9  |    Média   | Como um colaborador, eu quero poder confirmar ou recusar a participação de um evento e, caso recuse, informar o motivo, para que a organização tenha visibilidade.                                              |       2      |    1   |   ✅   |
|  10  |    Média   | Como um colaborador, eu quero marcar um evento ou treinamento como "concluído" após sua realização, para manter meu histórico de participação atualizado.                                                       |       1      |    1   |   ✅   |
|  11  |    Média   | Como um colaborador, eu quero acessar um documento padrão gerado automaticamente após um evento, contendo data, duração e um campo para descrever o conhecimento adquirido, para registrar meu desenvolvimento. |       3      |    1   |   ✅   |
|  12  |    Média   | Como um gerente de vendas, eu quero visualizar e classificar os clientes em um funil de vendas (Prospects, Inicial, Potencial, Manutenção, Em Negociação, Follow Up) para gerenciar o processo comercial.       |       2      |    2   |   ✅   |
|  13  |    Média   | Como um vendedor, eu quero agendar tarefas e receber lembretes para próximos contatos com clientes, para não perder oportunidades de negócio.                                                                   |       8      |    3   |   ✅   |
|  14  |    Média   | Como um operador, eu quero preencher o checklist de "Abertura e fechamento da empresa" (sim/não) para registrar o cumprimento dos procedimentos diários.                                                        |       5      |    3   |   ✅   |
|  15  |    Média   | Como um operador, eu quero preencher o "Checklist de Agregado", inserindo dados do motorista, do veículo e fotos para formlizar a vistoria.                                                                     |       4      |    3   |   ✅   |
|  16  |    Média   | Como um operador, eu quero preencher o "Checklist de veículo da frota" (sim/não) para registrar a conformidade dos veículos.                                                                                    |       4      |    3   |   ✅   |
|  17  |    Média   | Como um responsável pela manutenção, eu quero preencher o checklist de "Manutenção predial" (excelente/bom/precisa reparo) para registrar as condições das instalações.                                         |       4      |    3   |   ✅   |
|  18  |    Baixa   | Como um gestor, eu quero consultar os eventos pendentes de confirmação e os já realizados pelos colaboradores, para ter um controle sobre a participação da equipe.                                             |       6      |    3   |   ✅   |
|  19  |    Baixa   | Como um administrador, eu quero visualizar a localização de um colaborador para que eu possa saber quem está disponível para alocação de tarefas.                                                               |       3      |    1   |   ✅   |
|  20  |    Alta    | Como um colaborador do comercial, eu quero cadastrar uma nova cotação com os dados do cliente, para que eu possa acompanhar minhas propostas e negociar com os clientes de forma organizada.                    |       7      |    3   |   ✅   |

---

## 🏃‍ DoR - Definition of Ready <a id="dor"></a>

* User Stories com **Critérios de Aceitação**
* Cenários **a partir das US**
* Design no **Canva**
* Modelagem do **Banco de Dados**

## 🏆 DoD - Definition of Done <a id="dod"></a>

* Manual de Usuário
* Manual da Instalação
* Documentação da API (Application Programming Interface)
* Código completo
* Vídeos de cada etapa de entrega

---

## Manual de Instalação <a id="instalacao"></a>

Pré-requisitos:
- Node.js instalado.
- Banco de dados criado.

Passos para criação do banco:
- Dentro do arquivo do projeto você deve acessar a pasta backend, em seguida src e por fim database. Terá apenas um arquvi dentro da última pasta, chamado Banco de dados Api 2.sql.
- Em um sistema gerenciador de banco de dados (SGBD, recomendamos o MySql Workbench), você deve rodar o arquivo Banco de dados Api 2.sql.
- Se tudo ocorreu sem erros, o banco já está criado e funcional na sua máquina.


Comandos para execução:
- Em um editor de código fonte (recomendamos o VS Code), abra o arquivo do projeto.
- Abra o terminal do editor de código e certifique-se que está aberto na pasta do projeto.
- Se não estiver, insira o comando cd API-DSM-2SEMESTRE-2025.
- Ainda no terminal, insira o comando npm run test para instalar e rodar o necessário para a plataforma funcionar.
- Por fim, se o código tiver rodado sem erros, aparecerá no termial o seguinte link de acesso à plataforma: http://localhost:5173/

---

## 🚀 Estratégia de Branch <a id="branch"></a>

[Documentação da Estrátegia de Branch](https://github.com/Team-Chronos/API-DSM-2SEMESTRE-2025/blob/main/docs/Documenta%C3%A7%C3%A3o%20da%20Estrat%C3%A9gia%20de%20Branches%20-%20Equipe%20Chronos.pdf)

## 🔴 Value Proposition Canvas (VPC) <a id="vpc"></a>

[Documentação do VPC](https://github.com/Team-Chronos/API-DSM-2SEMESTRE-2025/blob/main/docs/VPC%20(Value%20Proposition%20Canvas)%20-%20Chronos.jpg)

## 📅 Cronograma de Sprints <a id="sprint"></a>

| Sprint          |    Período    | Documentação                                     |
| --------------- | :-----------: | ------------------------------------------------ |
| 🔖 **SPRINT 1** | 08/09 - 28/09 ✅ | [Sprint 1](https://github.com/Team-Chronos/API-DSM-2SEMESTRE-2025/tree/main/docs/sprint%201) |
| 🔖 **SPRINT 2** | 06/10 - 26/10 ✅ | [Sprint 2](https://github.com/Team-Chronos/API-DSM-2SEMESTRE-2025/tree/main/docs/sprint%202) |
| 🔖 **SPRINT 3** | 03/11 - 23/11 ✅ | [Sprint 3](https://github.com/Team-Chronos/API-DSM-2SEMESTRE-2025/tree/main/docs/sprint%203) |

## 💻 Tecnologias <a id="tecnologias"></a>

<h4 align="center">
 <a href="https://developer.mozilla.org/pt-BR/docs/Web/HTML"><img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"></a>
 <a href="https://developer.mozilla.org/pt-BR/docs/Web/CSS"><img src="https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css&logoColor=white"></a>
 <a href="https://developer.mozilla.org/pt-BR/docs/Web/JavaScript"><img src="https://img.shields.io/badge/javascript-f7df1e?style=for-the-badge&logo=javascript&logoColor=black"></a>
 <a href="https://nodejs.org/pt"><img src="https://img.shields.io/badge/node.js-80be03?style=for-the-badge&logo=nodedotjs&logoColor=white"></a>
 <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"></a>
 <a href="https://www.canva.com/pt_br/"><img src="https://img.shields.io/badge/canva-5257de?style=for-the-badge&logo=canva&logoColor=white"></a>
 <a href="https://www.atlassian.com/software/jira"><img src="https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=jira&logoColor=white"/></a>
 <a href="https://www.mysql.com"><img alt="Static Badge" src="https://img.shields.io/badge/mysql-325f74?style=for-the-badge&logo=mysql&logoColor=white"></a>
 <a href="https://github.com/"><img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white"/></a>
 <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-white?style=for-the-badge&logo=react&logoColor=white&color=%23087ea4"/></a>
</h4>

## 🎓 Equipe <a id="equipe"></a>

<div align="center">
  <table>
    <tr>
      <th>Membro</th>
      <th>Função</th>
      <th>Github</th>
      <th>Linkedin</th>
    </tr>
    <tr>
      <td>Rebeca Lima</td>
      <td>Product Owner</td>
      <td><a href="https://github.com/rebeca-lima-ti"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a></td>
      <td><a href="https://www.linkedin.com/in/rebeca-lima-925611359"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"></a></td>
    </tr>
    <tr>
      <td>Ana Julia Rubim</td>
      <td>Scrum Master</td>
      <td><a href="https://github.com/anajrubim"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a></td>
      <td><a href="https://www.linkedin.com/in/ana-júlia-rubim-41904234b"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"></a></td>
    </tr>
    <tr>
      <td>Enzo Gabriel</td>
      <td>Desenvolvedor</td>
      <td><a href="https://github.com/EnzoGabrielCode"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a></td>
      <td><a href="https://www.linkedin.com/in/enzo-gabriel-de-paula-8795a8332/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"></a></td>
    </tr>
    <tr>
      <td>Rafael Sette</td>
      <td>Desenvolvedor</td>
      <td><a href="https://github.com/Sette0o0"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a></td>
      <td><a href="https://www.linkedin.com/in/rafael-sette-de-araujo-229b88334/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"></a></td>
    </tr>
    <tr>
      <td>João Vitor Moura</td>
      <td>Desenvolvedor</td>
      <td><a href="https://github.com/JoaooMoura"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a></td>
      <td><a href="https://www.linkedin.com/in/joaoomoura"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"></a></td>
    </tr>
    <tr>
      <td>Gabriel Lázaro</td>
      <td>Desenvolvedor</td>
      <td><a href="https://github.com/gabsact4"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a></td>
      <td><a href="https://www.linkedin.com/in/gabriel-henrique-a1330a26a/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"></a></td>
    </tr>
  </table>
</div>



