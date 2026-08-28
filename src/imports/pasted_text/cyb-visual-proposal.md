Crie uma proposta visual completa de um **Web App responsivo** chamado **Check Your Breath (CYB)**, da Hality.

Já foram adicionados neste projeto do Figma:

* logo do projeto;
* referências visuais e designs de inspiração.

**Use esses materiais como principal referência de identidade visual.**
Não crie uma identidade visual completamente diferente.

## Objetivo do produto

O Check Your Breath é uma plataforma web que utiliza Inteligência Artificial para auxiliar no diagnóstico de halitose a partir de imagens da língua.

O sistema será utilizado por três perfis:

1. **Paciente / Usuário Free**
2. **Profissional de saúde**
3. **Administrador Hality**

Quero inicialmente **wireframes de alta fidelidade / telas de referência visual**, mostrando como o sistema pode funcionar.

O projeto deve parecer um **Web App moderno**, e não um site institucional.

Priorize:

* interface limpa;
* aparência profissional e relacionada à saúde;
* facilidade de uso;
* poucos elementos por tela;
* hierarquia visual clara;
* acessibilidade;
* experiência simples para pessoas não técnicas.

---

# RESPONSIVIDADE

O sistema deve funcionar em desktop e mobile.

Para o **paciente**, priorize experiência **mobile-first**, principalmente no fluxo de captura da imagem da língua.

Para **profissional e administrador**, priorize uma boa experiência desktop, mantendo responsividade.

Utilize componentes reutilizáveis e mantenha consistência entre todas as telas.

---

# FLUXO 1 — AUTENTICAÇÃO

O sistema deve obrigatoriamente começar na tela de login.

## 01 — Login

Criar a primeira tela do sistema com:

* logo CYB / Hality;
* título de acesso;
* campo E-mail;
* campo Senha;
* opção de mostrar/ocultar senha;
* botão **Entrar**;
* link **Esqueci minha senha**;
* opção **Criar uma conta**.

Depois da autenticação, o sistema deverá direcionar o usuário conforme seu perfil:

* paciente → área do paciente;
* profissional → área profissional;
* administrador → painel administrativo.

Não criar três páginas de login diferentes.

---

## 02 — Criar conta

Cadastro simples do usuário/paciente.

Campos de referência:

* Nome;
* E-mail;
* Telefone;
* Senha;
* Confirmar senha;
* aceite dos termos;
* botão **Criar conta**;
* link para voltar ao Login.

Não criar sistema de pagamento ou escolha de plano nessa etapa.

---

## 03 — Esqueci minha senha

Tela simples com:

* E-mail;
* botão para solicitar recuperação;
* voltar para Login.

---

## 04 — Redefinir senha

* Nova senha;
* Confirmar nova senha;
* botão Salvar nova senha.

---

# FLUXO 2 — PACIENTE / USUÁRIO FREE

O principal objetivo do paciente é conseguir realizar um novo diagnóstico de forma muito simples.

Criar uma navegação principal contendo, quando fizer sentido:

* Início;
* Novo diagnóstico;
* Meus diagnósticos;
* Avisos;
* Perfil.

No mobile, utilizar uma navegação apropriada para aplicativo web, como bottom navigation ou menu compacto.

---

## 05 — Home / Início do paciente

Criar dashboard simples e amigável.

Exibir:

* saudação ao usuário;
* botão principal e destacado **Fazer novo diagnóstico**;
* último diagnóstico, caso exista;
* acesso a **Meus diagnósticos**;
* avisos recentes;
* acesso às orientações/dicas disponíveis.

Não sobrecarregar essa tela com gráficos administrativos.

O CTA principal deve ser **Fazer novo diagnóstico**.

---

# FLUXO PRINCIPAL DO PRODUTO

A experiência deve deixar muito clara a sequência:

**Início → Novo diagnóstico → Anamnese → Preparação → Calibragem → Captura → Confirmação → Processamento → Resultado → Orientações**

Criar indicação visual de progresso durante esse fluxo.

---

## 06 — Iniciar novo diagnóstico

Tela introdutória explicando brevemente o processo.

Exemplo visual:

**Seu diagnóstico será realizado em algumas etapas**

1. Responder algumas perguntas;
2. Preparar a câmera;
3. Fotografar a língua;
4. Aguardar a análise;
5. Visualizar o resultado.

Botão principal:

**Começar diagnóstico**

---

## 07 — Anamnese

Criar tela de questionário.

O sistema deve ser preparado para diferentes tipos de pergunta, como:

* Sim/Não;
* múltipla escolha;
* seleção única;
* texto;
* escala.

Não inventar perguntas médicas definitivas.

Utilizar perguntas fictícias apenas como placeholder visual.

Mostrar:

* título da etapa;
* progresso;
* pergunta;
* alternativas;
* botão Próximo;
* botão Voltar.

Caso seja necessário mais de uma tela, criar o questionário em etapas, evitando formulário muito longo.

---

## 08 — Orientações para captura

Tela educativa antes de abrir a câmera.

Mostrar instruções visuais sobre como realizar corretamente a foto da língua.

Pode apresentar cards ou ilustrações indicando exemplos como:

* ambiente iluminado;
* posicionamento correto;
* rosto/celular na posição adequada;
* língua completamente visível;
* evitar imagem desfocada.

Não definir regras clínicas não fornecidas.

Usar textos genéricos de exemplo.

CTA:

**Preparar câmera**

---

## 09 — Calibragem da captura

Criar uma experiência visual de calibração da câmera antes da foto.

Pode utilizar:

* enquadramento;
* guia visual;
* indicador de iluminação;
* indicador de posicionamento;
* mensagens de orientação.

Exemplo:

**Posicione sua língua dentro da área indicada.**

Mostrar estados visuais como:

* Ajuste a iluminação;
* Aproxime um pouco;
* Mantenha o celular parado;
* Pronto para capturar.

Esta tela é apenas uma referência de UX; não é necessário implementar tecnicamente a detecção.

---

## 10 — Captura da imagem

Tela com grande destaque para a câmera.

Criar:

* área de preview;
* guia visual de enquadramento;
* botão grande de captura;
* botão cancelar/voltar;
* instrução curta.

No mobile, essa tela deve lembrar a experiência nativa de câmera.

---

## 11 — Revisar fotografia

Após capturar a imagem, mostrar a foto e perguntar:

**A imagem está boa?**

Ações:

* **Usar esta foto**
* **Tirar novamente**

A foto deve ser o elemento principal da tela.

---

## 12 — Processando diagnóstico

Tela de espera clara e tranquila.

Mostrar:

* indicador de carregamento;
* mensagem como **Estamos analisando sua imagem**;
* pequena explicação de que a análise pode levar alguns instantes.

Evitar mostrar resultados falsos durante o processamento.

---

## 13 — Resultado do diagnóstico

Esta é uma das telas mais importantes do produto.

Criar uma apresentação clara contendo áreas para:

* classificação do diagnóstico;
* possível escala/nível;
* confiança da análise por IA, caso aplicável;
* imagem utilizada;
* data do diagnóstico;
* status;
* informação caso exista ou seja necessária revisão de um profissional.

Não inventar nomenclaturas clínicas definitivas.

Use dados fictícios claramente ilustrativos.

Criar CTA para:

* **Ver orientações**
* **Voltar para o início**

---

## 14 — Orientações / Dicas relacionadas ao diagnóstico

Criar uma página preparada para conteúdos em diferentes formatos:

* texto;
* imagem;
* vídeo.

Organizar em cards ou blocos.

Exemplo:

**Orientações para o seu resultado**

Não produzir conteúdo médico definitivo.

Utilizar placeholders para demonstrar o layout.

---

# HISTÓRICO

## 15 — Meus diagnósticos

Criar tela contendo todos os diagnósticos realizados pelo paciente.

Cada item pode mostrar:

* data;
* classificação;
* status;
* miniatura da imagem, quando adequado;
* botão ou ação para visualizar.

Permitir diferenciação visual de estados como:

* concluído;
* aguardando análise;
* aguardando revisão;
* revisado.

---

## 16 — Detalhe de diagnóstico anterior

Ao selecionar um diagnóstico do histórico, mostrar:

* data;
* imagem;
* resultado;
* classificação;
* status;
* orientações;
* eventual revisão profissional;
* observações, caso existam.

---

# AVISOS

## 17 — Avisos e atualizações

Criar uma caixa de entrada simples de comunicados.

Mostrar:

* título;
* resumo;
* data;
* indicação visual de lido/não lido.

---

## 18 — Detalhe do aviso

Mostrar:

* título;
* data;
* mensagem completa;
* ação para voltar.

---

# PERFIL DO PACIENTE

## 19 — Meu perfil

Mostrar os principais dados cadastrais.

Ações:

* **Editar dados**
* **Alterar senha**
* **Sair**

---

## 20 — Editar perfil

Formulário com os dados editáveis do usuário.

Manter uma experiência simples.

---

# ÁREA DO PROFISSIONAL

A interface do profissional deve ser mais orientada para análise de informações e revisão de diagnósticos.

Criar navegação própria, utilizando o mesmo Design System.

Opções principais:

* Dashboard;
* Diagnósticos;
* Pacientes;
* Perfil.

---

## 21 — Dashboard profissional

Mostrar de forma resumida:

* diagnósticos aguardando revisão;
* diagnósticos revisados;
* pacientes vinculados;
* diagnósticos recentes.

CTA principal:

**Ver diagnósticos pendentes**

---

## 22 — Lista de diagnósticos

Criar tabela no desktop e cards adaptados para mobile.

Mostrar informações de referência como:

* paciente;
* data;
* resultado da IA;
* status;
* revisão;
* ação **Visualizar**.

Adicionar busca e filtros simples, caso visualmente faça sentido.

---

## 23 — Revisão do diagnóstico

Tela muito importante para o profissional.

Organizar informações em seções.

### Paciente

* nome;
* dados básicos.

### Anamnese

* respostas fornecidas pelo paciente.

### Imagens

* imagem ou imagens capturadas.

### Resultado da IA

* classificação;
* escala;
* confiança;
* status.

### Revisão profissional

Criar área para:

* definir/confirmar classificação;
* observações;
* status da revisão;
* salvar revisão.

Deixar visualmente clara a diferença entre:

**Resultado gerado pela IA**

e

**Avaliação do profissional**

---

## 24 — Pacientes vinculados

Criar lista de pacientes relacionados ao profissional.

Mostrar:

* nome;
* último diagnóstico;
* quantidade de diagnósticos;
* ação Visualizar.

---

## 25 — Detalhe do paciente

Mostrar:

* informações básicas;
* histórico de diagnósticos;
* últimas avaliações.

Não transformar essa área em prontuário médico completo.

---

## 26 — Perfil profissional

Mostrar informações como:

* nome;
* e-mail;
* registro profissional;
* especialidade;
* vínculo Hality;
* plano, quando aplicável.

---

# ÁREA ADMINISTRATIVA — HALITY

Criar interface administrativa desktop-first.

Menu lateral sugerido:

* Dashboard;
* Usuários;
* Diagnósticos;
* Conteúdos/Dicas;
* Avisos;
* Anamnese.

---

## 27 — Dashboard administrativo

Apresentar visão operacional simples.

Exemplos de cards:

* usuários cadastrados;
* profissionais;
* diagnósticos;
* diagnósticos pendentes.

Não criar ferramentas avançadas de Business Intelligence.

---

# GERENCIAMENTO DE USUÁRIOS

## 28 — Usuários

Tabela com:

* nome;
* e-mail;
* tipo de usuário;
* status ativo/inativo;
* data de cadastro;
* ação visualizar/editar.

Adicionar busca e filtros.

---

## 29 — Detalhe / edição de usuário

Permitir visualizar dados e editar informações administrativas necessárias.

Incluir opção visual para ativar/desativar usuário.

---

# GERENCIAMENTO DE CONTEÚDOS / DICAS

## 30 — Lista de conteúdos

Mostrar:

* título;
* classificação relacionada;
* tipo de conteúdo;
* status;
* ações.

---

## 31 — Criar / editar conteúdo

Formulário preparado para conteúdo dos tipos:

* texto;
* imagem;
* vídeo.

Permitir relacionar conteúdo a uma classificação de diagnóstico quando necessário.

Não criar o conteúdo real, somente a estrutura da interface.

---

# GERENCIAMENTO DE DIAGNÓSTICOS

## 32 — Diagnósticos administrativos

Tabela geral com:

* paciente;
* data;
* classificação;
* status;
* profissional revisor;
* ação visualizar.

---

## 33 — Detalhe administrativo do diagnóstico

Mostrar:

* paciente;
* anamnese;
* imagem;
* resultado IA;
* revisão profissional;
* status;
* datas.

---

# GERENCIAMENTO DE AVISOS

## 34 — Avisos e atualizações

Lista dos avisos cadastrados.

Mostrar:

* título;
* publicação;
* público;
* status;
* ações editar/visualizar.

---

## 35 — Criar / editar aviso

Campos de referência:

* título;
* mensagem;
* data de publicação;
* público;
* status;
* botão Publicar/Salvar.

---

# GERENCIAMENTO DE ANAMNESE

## 36 — Administração da anamnese

Criar apenas uma proposta visual inicial para gerenciamento da anamnese.

Pode conter:

* lista de perguntas;
* ordem;
* tipo da pergunta;
* status;
* editar;
* adicionar pergunta.

IMPORTANTE:

Esta funcionalidade ainda precisa ser validada com o cliente.

Portanto, não aprofundar regras complexas de criação de questionários.

---

# ESTADOS IMPORTANTES

Também crie exemplos dos principais estados da interface:

* vazio: nenhum diagnóstico;
* carregando;
* erro;
* sucesso;
* diagnóstico aguardando processamento;
* aguardando revisão;
* concluído;
* usuário sem avisos.

Não é necessário criar uma página independente para cada estado. Eles podem aparecer como variações das telas existentes.

---

# PADRÃO VISUAL E COMPONENTES

Criar um Design System simples e consistente com as referências visuais já fornecidas.

Criar componentes reutilizáveis para:

* botões;
* inputs;
* selects;
* cards;
* badges de status;
* tabelas;
* modal;
* alertas;
* cabeçalho;
* sidebar;
* navegação mobile;
* indicador de etapas/progresso;
* upload/captura de imagem.

Priorizar legibilidade e acessibilidade.

---

# ORGANIZAÇÃO NO FIGMA

Organize as telas em páginas ou seções:

**00 — Design System**

**01 — Autenticação**

**02 — Paciente**

**03 — Fluxo de Diagnóstico**

**04 — Profissional**

**05 — Administrador**

Dentro de **03 — Fluxo de Diagnóstico**, coloque as telas lado a lado seguindo exatamente esta sequência:

**Home → Novo diagnóstico → Anamnese → Orientações → Calibragem → Captura → Revisar foto → Processamento → Resultado → Orientações do resultado**

Conecte essas telas em um protótipo navegável básico.

---

# REGRAS DE ESCOPO

NÃO adicionar:

* pagamentos;
* checkout;
* assinatura paga;
* e-commerce;
* chat;
* videochamada;
* prontuário médico completo;
* ferramentas avançadas de gestão;
* funcionalidades não solicitadas.

Quando alguma regra de negócio não estiver especificada, prefira a solução mais simples para demonstrar o fluxo e utilize conteúdo placeholder.

O objetivo desta entrega é principalmente **entender visualmente todas as telas necessárias e o fluxo do Web App**, e não definir regras médicas ou implementar o produto final.

Comece obrigatoriamente pela **Tela 01 — Login** e depois construa os fluxos na ordem definida acima.
