# Payment Automation API

API RESTful para gerenciamento de pagamentos e notificações automáticas integrada com Mercado Pago.

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Instalação](#instalação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Uso da API](#uso-da-api)
- [Documentação](#documentação)
- [Testes](#testes)
- [Deploy](#deploy)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Contato](#contato)

## 🔍 Visão Geral

Esta API foi desenvolvida como um sistema de gerenciamento de pagamentos com integração ao Mercado Pago. O sistema processa pedidos, gerencia clientes, gera pagamentos e envia notificações automáticas por e-mail utilizando Resend.

## 🛠️ Tecnologias

- **Backend**: Node.js, TypeScript, Express
- **Banco de Dados**: PostgreSQL, Prisma ORM
- **Processamento de Pagamentos**: Mercado Pago API
- **Envio de E-mails**: Resend
- **Containerização**: Docker, Docker Compose
- **Documentação**: Swagger
- **Cache**: Node-Cache
- **Testes**: Jest, Supertest
- **CI/CD**: GitHub Actions

## ✨ Funcionalidades

- **Gerenciamento de clientes**: Cadastro, atualização e consulta de clientes
- **Catálogo de produtos**: Gerenciamento de produtos disponíveis
- **Gerenciamento de pedidos**: Criação e acompanhamento de pedidos
- **Processamento de pagamentos**: Integração com Mercado Pago
- **Notificações automáticas**: Envio de e-mails para clientes em diferentes etapas do processo
- **Webhook para pagamentos**: Recebimento de notificações do Mercado Pago
- **Autenticação e autorização**: Sistema de controle de acesso baseado em JWT
- **Cache**: Otimização de performance com sistema de cache em memória
- **Documentação interativa**: Interface Swagger para testes e documentação

## 📝 Pré-requisitos

- Node.js (v18 ou superior)
- Docker e Docker Compose
- Conta no Mercado Pago (para obter credenciais)
- Conta no Resend (para envio de e-mails)
- Conta no NeonDB ou banco PostgreSQL local
- Git

## ⚙️ Configuração do Ambiente

### Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```
# Ambiente de execução
NODE_ENV=development
PORT=8000
API_PREFIX=/api

# Banco de Dados
DATABASE_URL=

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=TEST-0000000000000000-000000-00000000000000000000000000000000-000000000
MERCADOPAGO_PUBLIC_KEY=TEST-00000000-0000-0000-0000-000000000000

# Resend (serviço de email)
RESEND_API_KEY=re_0000000000000000000000000000000000
RESEND_FROM_EMAIL=pagamentos@seudominio.com

# URLs de webhooks
WEBHOOK_BASE_URL=http://localhost:8000

# Outras configurações
CACHE_DEFAULT_TTL=300
```

## 🚀 Instalação

### Usando Docker (recomendado)

```bash
# Clone o repositório
git clone https://github.com/duduzinmuller/backend.
cd backend.

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie os containers
docker-compose up -d

# Execute as migrações do banco de dados
docker-compose exec api npx prisma migrate dev
```

### Instalação Local

```bash
# Clone o repositório
git clone https://github.com/duduzinmuller/backend.
cd backend.

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute as migrações do banco de dados
npx prisma migrate dev

# Inicie o servidor de desenvolvimento
npm run dev
```

## 📁 Estrutura do Projeto

```
payment-automation-api/
├── .env.example          # Exemplo de variáveis de ambiente
├── .gitignore            # Arquivos ignorados pelo git
├── docker-compose.yml    # Configuração do Docker Compose
├── Dockerfile            # Configuração do Docker
├── package.json          # Dependências e scripts
├── prisma/               # Configuração do Prisma
│   ├── schema.prisma     # Schema do banco de dados
│   └── migrations/       # Migrações do banco de dados
├── src/
│   ├── config/           # Configurações da aplicação
│   ├── controllers/      # Controladores da API
│   ├── middlewares/      # Middlewares do Express
│   ├── models/           # Definições de tipos e interfaces
│   ├── repositories/     # Camada de acesso a dados
│   ├── routes/           # Rotas da API
│   ├── services/         # Lógica de negócios
│   ├── utils/            # Utilitários e helpers
│   ├── app.ts            # Configuração do Express
│   ├── server.ts         # Ponto de entrada da aplicação
│   └── swagger.ts        # Configuração do Swagger
└── tests/                # Testes automatizados
```

## 🔌 Uso da API

Uma vez que o servidor esteja rodando, a API estará disponível em:

```
http://localhost:8000/api
```

### Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /api/customers | Cria um novo cliente |
| GET | /api/customers | Lista todos os clientes |
| GET | /api/customers/:id | Obtém detalhes de um cliente |
| PUT | /api/customers/:id | Atualiza um cliente |
| DELETE | /api/customers/:id | Remove um cliente |
| POST | /api/products | Cria um novo produto |
| GET | /api/products | Lista todos os produtos |
| POST | /api/orders | Cria um novo pedido |
| GET | /api/orders | Lista todos os pedidos |
| GET | /api/orders/:id | Obtém detalhes de um pedido |
| PATCH | /api/orders/:id/status | Atualiza o status de um pedido |
| POST | /api/payments/create | Cria um novo pagamento |
| GET | /api/payments/:id | Obtém detalhes de um pagamento |
| POST | /api/webhooks/mercadopago | Webhook para notificações do Mercado Pago |

## 📚 Documentação

A documentação completa da API está disponível através do Swagger em:

```
http://localhost:8000/api-docs
```

### Exemplo de Uso com cURL

**Criar um cliente:**
```bash
curl -X POST http://localhost:8000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "+5511999999999",
    "document": "123.456.789-00"
  }'
```

**Criar um pedido:**
```bash
curl -X POST http://localhost:8000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "c0a80121-7ac0-4e3b-9a9f-3a156f86a4d7",
    "items": [
      {
        "productId": "c0a80121-7ac0-4e3b-9a9f-3a156f86a4d8",
        "quantity": 2
      }
    ]
  }'
```

## 🧪 Testes

### Executando Testes

```bash
# Testes unitários
npm run test

# Testes com coverage
npm run test:coverage
```

## 🚢 Deploy

### Deploy no Ambiente de Produção

Para fazer o deploy em produção, configure as variáveis de ambiente apropriadas e execute:

```bash
# Compilar para JavaScript
npm run build

# Iniciar em modo de produção
npm start
```

### Deploy com Docker

```bash
docker build -t payment-automation-api .
docker run -p 8000:8000 --env-file .env payment-automation-api
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato

Desenvolvido em parceria por:

- **Eduardo Muller**: [LinkedIn](https://www.linkedin.com/in/eduardo-muller-052182260)
- **Paulo Roberto**: [LinkedIn](https://www.linkedin.com/in/paulo-roberto-1980)

Para qualquer dúvida ou sugestão, abra uma issue no repositório ou entre em contato com algum dos desenvolvedores.

---