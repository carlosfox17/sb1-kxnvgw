# Sistema de Gestão de Projetos

Um sistema completo de gestão de projetos desenvolvido com React, TypeScript e Tailwind CSS.

## Funcionalidades

- Autenticação de usuários
- Gestão de projetos
- Gestão de clientes
- Gestão de usuários
- Dashboard com métricas
- Upload de fotos e documentos
- Configurações do sistema
- Notificações por email

## Tecnologias Utilizadas

- React
- TypeScript
- Tailwind CSS
- Zustand (Gerenciamento de Estado)
- React Router (Roteamento)
- MSW (Mock Service Worker)
- Lucide React (Ícones)
- React Hot Toast (Notificações)

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/sistema-gestao-projetos.git
```

2. Entre no diretório do projeto:
```bash
cd sistema-gestao-projetos
```

3. Instale as dependências:
```bash
npm install
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes React reutilizáveis
  ├── pages/         # Páginas da aplicação
  ├── store/         # Gerenciamento de estado com Zustand
  ├── types/         # Definições de tipos TypeScript
  ├── utils/         # Funções utilitárias
  ├── mocks/         # Configuração do Mock Service Worker
  └── server/        # Lógica do servidor mock
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o linter

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.