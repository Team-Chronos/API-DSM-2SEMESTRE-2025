# Plataforma Integrada para Gestão Administrativa, Comercial e Operacional \- Newe

## Equipe Chronos

Backlog da Sprint com Critérios de Aceitação:

| Rank | Prioridade | User Story | Estimativa (Planning Poker) | Sprint | Critérios de Aceitação |
| :---: | :---: | :---: | :---: | :---: | ----- |
| 1 | ALTA | Como um usuário cadastrado, eu quero fazer login na plataforma utilizando meu e-mail empresarial para acessar o sistema de forma segura e utilizar suas funcionalidades. | 5 | 1 | CA1: O usuário deve inserir e-mail e senha válidos. CA2: Apenas e-mails com domínio empresarial são aceitos. CA3: O sistema deve validar credenciais e exibir mensagem de erro em caso de falha. CA4: O login bem-sucedido redireciona para a página inicial da plataforma. CA5: Sessão deve expirar após período de inatividade configurável. |
| 2 | ALTA | Como um administrador, eu quero cadastrar colaboradores com nome e informações básicas para ter um registro centralizado da equipe. | 5 | 1 | CA1: O administrador deve inserir nome e informações básicas (ex.: e-mail, cargo, telefone). CA2: O sistema deve validar campos obrigatórios antes de salvar. CA3: O colaborador cadastrado deve ser listado em uma tela de consulta. CA4: Não deve ser permitido cadastrar dois colaboradores com o mesmo e-mail. |
| 6 | ALTA | Como um agregado, eu quero me cadastrar e que me seja enviada uma devolutiva automática, para saber se fui cadastrado corretamente. | 4 | 1 | CA1: O agregado deve preencher formulário de cadastro. CA2: O sistema deve validar campos obrigatórios antes de salvar. CA3: O sistema deve enviar mensagem automática de confirmação de cadastro (e-mail ou notificação). |
| 7 | ALTA | Como um gestor, eu quero ter uma visão centralizada de todos os checklists e cadastros para simplificar o acesso e padronizar as operações. | 3 | 1 | CA1: O gestor deve visualizar em um único painel todos os checklists e cadastros realizados. CA2: O sistema deve permitir filtros por tipo, data e responsável. CA3: O painel deve mostrar status de conclusão de cada checklist. |
| 8 | MÉDIA | Como um organizador de eventos, eu quero que o sistema envie notificações automáticas sobre novos eventos, presenciais ou online (com link) para os colaboradores, para garantir que todos sejam informados. | 4 | 1 | CA1: Ao cadastrar um evento, o sistema deve disparar notificações automáticas para todos os colaboradores ativos. CA2: Para eventos online, a notificação deve conter o link de acesso. CA3: Para eventos presenciais, a notificação deve conter data, horário e local. CA4: As notificações devem ser enviadas por e-mail e/ou sistema (push). |
| 9 | MÉDIA | Como um colaborador, eu quero poder confirmar ou recusar a participação de um evento e, caso recuse, informar o motivo, para que a organização tenha visibilidade. | 2 | 1 | CA1: O colaborador deve visualizar os eventos pendentes de resposta. CA2: Deve existir opção de confirmar ou recusar participação. CA3: Em caso de recusa, o campo “motivo” deve ser obrigatório. CA4: A decisão do colaborador deve ser registrada no sistema. |
| 10 | MÉDIA | Como um colaborador, eu quero marcar um evento ou treinamento como "concluído" após sua realização, para manter meu histórico de participação atualizado. | 1 | 1 | CA1: O colaborador deve ter acesso a eventos confirmados e passados. CA2: Deve existir opção de marcar o evento como “concluído”. CA3: O status do evento deve ser atualizado no histórico do colaborado. |
| 11 | MÉDIA | Como um colaborador, eu quero acessar um documento padrão gerado automaticamente após um evento, contendo data, duração e um campo para descrever o conhecimento adquirido, para registrar meu desenvolvimento. | 3 | 1 | CA1: Após o evento, o sistema deve gerar automaticamente um documento com: data, duração, e campo de descrição de aprendizado. CA2: O colaborador deve poder acessar e editar apenas o campo de “conhecimento adquirido”. CA3: O documento deve ser salvo e associado ao histórico do colaborador. |
| 19 | BAIXA | Como um administrador, eu quero visualizar a localização de um colaborador para que eu possa saber quem está disponível para alocação de tarefas. | 3 | 1 | CA1: O administrador deve visualizar em mapa a localização atual de colaboradores ativos. CA2: A localização deve ser atualizada em tempo real ou em intervalos configuráveis. CA3: O sistema deve garantir que apenas administradores tenham acesso a essa informação. |

Cenários das User Stories:  
US1 \- Como um usuário cadastrado, eu quero fazer login na plataforma utilizando meu e-mail empresarial para acessar o sistema de forma segura e utilizar suas funcionalidades.

| Cenário 1 | Cenário 2 | Cenário 3 |
| :---- | :---- | :---- |
| **Login bem-sucedido** | **Tentativa de login com senha incorreta** | **Tentativa de login com e-mail não cadastrado** |
| **Dado** que eu sou um usuário cadastrado e estou na página de login. **Quando** eu insiro meu e-mail empresarial e minha senha correta, depois clico no botão "Entrar". **Então** eu sou autenticado com sucesso e redirecionado para a página inicial da plataforma. |  **Dado** que eu sou um usuário cadastrado e estou na página de login.  **Quando** eu insiro meu e-mail empresarial e uma senha incorreta, depois clico no botão "Entrar". **Então** o sistema exibe uma mensagem de erro informando "E-mail ou senha inválidos". |  **Dado** que estou na página de login.  **Quando** eu insiro um e-mail que não está registrado no sistema, depois clico no botão "Entrar".  **Então** o sistema exibe uma mensagem de erro informando "Usuário não encontrado". |

US2 \- Como um administrador, eu quero cadastrar colaboradores com nome e informações básicas para ter um registro centralizado da equipe.

| Cenário 1 | Cenário 2 |
| :---- | :---- |
| **Cadastro de novo colaborador bem-sucedido** | **Tentativa de cadastrar um e-mail já existente** |
|  **Dado** que eu sou um administrador logado no sistema. **Quando** eu acesso a área de "Gestão de Colaboradores" e clico em "Adicionar Novo". Eu preencho o nome, e-mail e outras informações básicas do colaborador, e depois clico em "Salvar".  **Então** o novo colaborador é adicionado à lista de registros da equipe. |  **Dado** que eu sou um administrador logado no sistema.  **Quando** eu tento cadastrar um novo colaborador com um e-mail que já existe na base de dados.  **Então** o sistema exibe uma mensagem de erro informando que "O e-mail informado já está em uso". |

US6 \- Como um colaborador, eu quero acessar um documento padrão gerado automaticamente após um evento, contendo data, duração e um campo para descrever o conhecimento adquirido, para registrar meu desenvolvimento.

| Cenário 1 |
| :---- |
| **Gerar documento de aprendizado** |
| **Dado** que eu participei de um evento e o marquei como "Concluído".  **Quando** eu clico na opção "Gerar Documento de Aprendizado".  **Então** um documento é gerado com a data e a duração pré-preenchidas, e há um campo editável para eu descrever o que aprendi. **Quando** eu preencho o campo e clico em "Salvar". **Então** o documento é salvo no meu histórico de desenvolvimento.  |

US7 \- Como um gestor, eu quero consultar os eventos pendentes de confirmação e os já realizados pelos colaboradores, para ter um controle sobre a participação da equipe.

| Cenário 1 |
| :---- |
| **Visualizar status de participação da equipe** |
|  **Dado** que eu sou um gestor logado no sistema.  **Quando** eu acesso o "Dashboard da Equipe" e seleciono um evento específico.  **Então** eu visualizo uma lista dos membros da minha equipe com o status de cada um: "Confirmado", "Recusado" ou "Pendente", e posso ver os motivos das recusas. |

US8 \- Como um vendedor, eu quero registrar o cadastro completo de clientes (nome, endereço, atividade, segmento, contatos, departamento) para centralizar as informações do contato.

| Cenário 1 | Cenário 2 |
| :---- | :---- |
| **Cadastro de novo cliente** | **Cliente já cadastrado** |
|  **Dado** que eu sou um vendedor logado na plataforma.  **Quando** eu acesso a seção de "Clientes", clico em "Novo Cliente", preencho todas as informações solicitadas no formulário (nome, endereço, segmento, etc.) e depois clico em "Salvar". **Então** o novo cliente é adicionado à base de dados e fica visível na minha lista de clientes.  |  **Dado** que eu sou um vendedor logado na plataforma.  **Quando** eu acesso a seção de "Clientes" e clico em "Novo Cliente", preencho todas as informações solicitadas no formulário (nome, endereço, segmento, etc.) com dados de um cliente já existente e clico em "Salvar". **Então** o sistema exibe uma mensagem de erro informando que "Cliente já está cadastrado\!”.  |

US9 \- Como um vendedor, eu quero registrar o histórico completo de interações com os clientes (data, forma de contato, relatório detalhado) para acompanhar o relacionamento.

| Cenário 1 |
| :---- |
| **Adicionar nova interação a um cliente** |
|  **Dado** que eu sou um vendedor e estou na página de um cliente existente.  **Quando** eu clico em "Adicionar Interação" e seleciono a data, a forma de contato (e-mail, telefone, reunião), escrevo um relatório detalhado sobre a interação e clico em "Salvar".  **Então** a nova interação é adicionada ao histórico daquele cliente, ordenada pela data mais recente.  |

US10 \- Como um gerente de vendas, eu quero visualizar e classificar os clientes em um funil de vendas (Prospects, Inicial, Potencial, Manutenção, Em Negociação, Follow Up) para gerenciar o processo comercial.

| Cenário 1 |
| :---- |
| **Mover cliente no funil de vendas** |
|  **Dado** que eu sou um gerente de vendas visualizando o funil (Kanban).  **Quando** eu arrasto o card de um cliente da coluna "Potencial" para a coluna "Em Negociação".  **Então** o status do cliente é atualizado automaticamente no sistema.  |

US11 \- Como um vendedor, eu quero agendar tarefas e receber lembretes para próximos contatos com clientes, para não perder oportunidades de negócio.

| Cenário 1 |
| :---- |
| **Agendar e receber lembrete de uma tarefa** |
|  **Dado** que eu sou um vendedor e estou na página de um cliente.  **Quando** eu crio uma nova tarefa, como "Ligar para Follow Up", defino a data e a hora para a tarefa e salvo a tarefa.  **Então** no dia e hora agendados, eu recebo uma notificação (lembrete) sobre a tarefa.  |

US19 \- Como um administrador, eu quero visualizar a localização de um colaborador para que eu possa saber quem está disponível para alocação de tarefas.

| Cenário 1 |
| :---- |
| **Visualizar localização de colaboradores ativos** |
|  **Dado** que eu sou um administrador logado na plataforma.  **Quando** eu acesso a funcionalidade "Mapa da Equipe".  **Então** o sistema exibe uma área com quadrados/retângulos representando uma localização (evento, home office, empresa e afins) e pinos que representam os colaboradores que estão alocados a um local.  |

Design no Canva:  
[https://www.canva.com/design/DAGxdC0HqKY/B9I4Aa3dzlMcNzc57Sta6Q/edit?utm\_content=DAGxdC0HqKY\&utm\_campaign=designshare\&utm\_medium=link2\&utm\_source=sharebutton](https://www.canva.com/design/DAGxdC0HqKY/B9I4Aa3dzlMcNzc57Sta6Q/edit?utm_content=DAGxdC0HqKY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

