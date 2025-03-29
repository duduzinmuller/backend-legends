# Testes - Payment Automation API

Este diretório contém os testes automatizados para o projeto Payment Automation API. A estrutura é organizada para facilitar a manutenção e a compreensão dos testes.

## Estrutura de Diretórios

```
tests/
├── setup.ts                       # Configuração global para testes
├── utils/                         # Utilitários para testes 
│   ├── prisma-mock.ts             # Mock do cliente Prisma
│   └── test-utils.ts              # Funções utilitárias para testes
├── unit/                          # Testes unitários
│   ├── repositories/              # Testes de repositórios
│   │   └── customer.repository.test.ts
│   ├── services/                  # Testes de serviços
│   │   └── email.service.test.ts
│   └── controllers/               # Testes de controladores
│       └── email.controller.test.ts
└── integration/                   # Testes de integração
    └── routes/                    # Testes de rotas da API
        └── email.routes.test.ts
```

## Executando os Testes

Para executar os testes, você pode usar os seguintes comandos:

```bash
# Executar todos os testes
npm test

# Executar testes com relatório de cobertura
npm run test:coverage

# Executar testes em modo de observação (desenvolvimento)
npm run test:watch
```

## Tipos de Testes

### Testes Unitários

Testam componentes individuais isoladamente. Usamos mocks para simular dependências externas.

Exemplo:
```typescript
describe('EmailService', () => {
  it('should send welcome email', async () => {
    // Teste aqui
  });
});
```

### Testes de Integração

Testam a interação entre diferentes componentes (como rotas e controladores).

Exemplo:
```typescript
describe('Email Routes', () => {
  it('should return 200 on successful email send', async () => {
    // Teste aqui
  });
});
```

## Mocks e Utilitários

### Prisma Mock

Usamos `jest-mock-extended` para criar mocks do Prisma Client, permitindo testar os repositórios sem acesso ao banco de dados real.

### Test Utils

Contém funções auxiliares para criar objetos de requisição (req) e resposta (res) do Express para testes.

## Boas Práticas de Teste

1. **Estrutura AAA**: Organize testes em Arrange (preparação), Act (ação) e Assert (verificação)
2. **Isolamento**: Cada teste deve ser independente
3. **Nomeação**: Use nomes descritivos para tests e suites
4. **Cobertura**: Tente cobrir caminhos positivos e negativos
5. **Reset**: Limpe mocks após cada teste

## Adicionando Novos Testes

Siga o padrão existente ao adicionar novos testes:

1. Coloque testes unitários na pasta `unit/` apropriada
2. Coloque testes de integração na pasta `integration/`
3. Use mocks para isolamento
4. Siga o padrão de nomenclatura: `nome-do-arquivo.test.ts`