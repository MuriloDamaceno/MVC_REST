# 📅 EventHub

Sistema de gestão de eventos acadêmicos/corporativos e controle de inscrições, desenvolvido em arquitetura **MVC** com renderização de páginas no servidor (Node.js + Express + EJS).

🔗 **Aplicação em produção:** https://eventhub-2me4.onrender.com

> ⚠️ O serviço está hospedado no plano gratuito do Render e "dorme" após um período de inatividade. A primeira requisição após um tempo parado pode levar até 50 segundos para responder.

---

## 📖 Sobre o projeto

O EventHub permite que **organizadores** criem, editem e excluam eventos, enquanto **participantes** podem visualizar os eventos disponíveis e se inscrever neles. O controle de acesso diferencia os dois papéis: apenas organizadores podem gerenciar eventos, e apenas usuários autenticados podem se inscrever.

### Funcionalidades

- Cadastro e login de usuários (organizador ou participante), com senha protegida por hash
- Sessão de usuário via cookies `httpOnly`
- Listagem pública de eventos
- Criação, edição e exclusão de eventos (restrito a organizadores)
- Inscrição de participantes em eventos, com bloqueio de inscrição duplicada
- Página de erro amigável para acessos não autorizados

---

## 🏗️ Arquitetura (MVC)

```
├── app.js                     # Ponto de entrada da aplicação
├── config/
│   └── database.js            # Pool de conexões MySQL (mysql2/promise)
├── controllers/
│   ├── authController.js      # Cadastro, login e logout
│   ├── eventoController.js    # CRUD de eventos
│   └── inscricaoController.js # Inscrição em eventos
├── middlewares/
│   ├── authMiddleware.js          # Bloqueia rotas privadas sem sessão ativa
│   ├── organizadorMiddleware.js   # Bloqueia rotas exclusivas de organizador
│   └── logger.js                  # Log de requisições no console
├── models/
│   ├── usuarioModel.js
│   ├── eventoModel.js
│   └── inscricaoModel.js
├── routes/
│   ├── authRoutes.js
│   └── eventoRoutes.js
├── views/
│   ├── partials/               # header.ejs / footer.ejs
│   ├── eventos/                # lista, form, detalhes
│   ├── login.ejs
│   ├── cadastro.ejs
│   └── erro.ejs
└── public/
    └── css/style.css
```

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| [Node.js](https://nodejs.org/) | Ambiente de execução |
| [Express 5](https://expressjs.com/) | Framework web / roteamento |
| [EJS](https://ejs.co/) | Template engine (views renderizadas no servidor) |
| [MySQL2](https://github.com/sidorares/node-mysql2) | Driver MySQL com suporte a Promises e SSL |
| [express-session](https://github.com/expressjs/session) | Gerenciamento de sessão via cookies |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Hash de senhas |
| [dotenv](https://github.com/motdotla/dotenv) | Variáveis de ambiente |
| [nodemon](https://nodemon.io/) | Reinício automático em desenvolvimento |

**Infraestrutura:**
- Banco de dados MySQL gerenciado na **[Aiven](https://aiven.io/)** (conexão via SSL/TLS)
- Deploy da aplicação no **[Render](https://render.com/)**

---

## 🚀 Como rodar o projeto localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) 18 ou superior
- Um banco de dados MySQL acessível (local ou em nuvem, como o Aiven)

### Passo a passo

1. **Clone o repositório**
```bash
git clone https://github.com/MuriloDamaceno/MVC-REST.git
cd MVC-REST
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo de exemplo e preencha com os seus dados:
```bash
cp .env.example .env
```

Veja a seção [Variáveis de ambiente](#-variáveis-de-ambiente) abaixo para o significado de cada uma.

4. **Crie o schema do banco de dados**

Execute no seu cliente MySQL (Workbench, DBeaver, etc.) os comandos abaixo para criar as tabelas necessárias:

```sql
CREATE TABLE usuarios (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('participante', 'organizador') NOT NULL DEFAULT 'participante'
);

CREATE TABLE eventos (
  id_evento INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT,
  data_evento DATE NOT NULL,
  local_evento VARCHAR(150),
  id_organizador INT NOT NULL,
  FOREIGN KEY (id_organizador) REFERENCES usuarios(id_usuario)
);

CREATE TABLE inscricoes (
  id_inscricao INT PRIMARY KEY AUTO_INCREMENT,
  id_evento INT NOT NULL,
  id_participante INT NOT NULL,
  inscrito_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_evento) REFERENCES eventos(id_evento),
  FOREIGN KEY (id_participante) REFERENCES usuarios(id_usuario)
);
```

5. **Rode a aplicação**

Em modo desenvolvimento (com recarregamento automático via nodemon):
```bash
npm run dev
```

Em modo produção:
```bash
npm start
```

6. **Acesse no navegador**
```
http://localhost:3000
```

---

## 🔑 Variáveis de ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `PORT` | Porta em que o servidor Express vai rodar | `3000` |
| `DB_HOST` | Host do banco de dados MySQL | `localhost` ou host da Aiven |
| `DB_PORT` | Porta do banco de dados | `3306` (local) ou porta fornecida pela Aiven |
| `DB_USER` | Usuário do banco de dados | `root` |
| `DB_PASS` | Senha do banco de dados | — |
| `DB_NAME` | Nome do banco de dados | `eventhub_db` |
| `DB_SSL` | Define se a conexão deve usar SSL (obrigatório em provedores como Aiven) | `true` |
| `SESSION_SECRET` | Chave secreta usada para assinar o cookie de sessão | qualquer string aleatória e segura |

O arquivo `.env` **nunca** deve ser versionado (já está listado no `.gitignore`). Use o `.env.example` como referência.

---

## 🔒 Segurança implementada

- Senhas armazenadas com **hash bcrypt** (nunca em texto puro)
- Prepared Statements (`?`) em todas as queries SQL, prevenindo SQL Injection
- Sessão de usuário com cookie `httpOnly: true`
- Tratamento de exceções via `try/catch` em todos os controllers, sem exposição de stack trace ao usuário final
- Controle de acesso por papel: apenas usuários do tipo `organizador` podem criar, editar ou excluir eventos (`organizadorMiddleware`)
- Credenciais e segredos isolados via variáveis de ambiente (`dotenv`), nunca hardcoded no código

---

## 👤 Autor

Desenvolvido por **Murilo Damaceno** como parte da atividade de recuperação trimestral — Sistema Integrado de Gestão Web (MVC & REST).
