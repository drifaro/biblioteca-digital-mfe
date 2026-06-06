# 📚 Biblioteca Digital Simplificada — MFE

> Implementação **Micro Frontend** para análise comparativa de arquiteturas frontend — TCC.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![MSW](https://img.shields.io/badge/MSW-2-FF6A33)
![Module Federation](https://img.shields.io/badge/Module%20Federation-@originjs-orange)

---

## Sobre

SPA React com CRUD de **Livros** e **Autores**, implementada como **Micro Frontend** usando composição em tempo de execução via Module Federation. Serve como contraponto arquitetural à versão monolítica no contexto do TCC.

A aplicação é composta por **4 projetos independentes** em um monorepo npm workspaces, cada um com seu próprio processo de build, servidor e ciclo de implantação.

Todas as chamadas HTTP são interceptadas pelo [MSW](https://mswjs.io) — não é necessário nenhum servidor backend para rodar o projeto.

---

## Projetos

| Pacote                            | Porta | Papel                                         |
| --------------------------------- | ----- | --------------------------------------------- |
| `@biblioteca-digital/mfe-shared`  | 3003  | Biblioteca de componentes visuais (Remote)    |
| `@biblioteca-digital/mfe-books`   | 3001  | Feature de livros — autossuficiente (Remote)  |
| `@biblioteca-digital/mfe-authors` | 3002  | Feature de autores — autossuficiente (Remote) |
| `@biblioteca-digital/container`   | 3000  | Orquestrador de layout e navegação (Host)     |

---

## Instalação

```bash
# Na raiz do monorepo — instala dependências de todos os pacotes
npm install

# Inicializar o service worker do MSW no container (já incluso no repositório)
cd container && npx msw init public/ --save
```

---

## Execução

O Module Federation requer que os projetos estejam **buildados** antes de serem consumidos.
Use o script `start` de cada pacote, que faz build e sobe um servidor estático com CORS:

```bash
# Atalho — sobe todos os pacotes de uma vez (na raiz do monorepo)
npm start
```

Ou, para controlar a ordem manualmente (recomendado — mfe-shared deve subir primeiro):

```bash
# Terminal 1 — mfe-shared (deve subir primeiro)
cd mfe-shared && npm start   # build + serve em :3003

# Terminal 2
cd mfe-books && npm start    # build + serve em :3001

# Terminal 3
cd mfe-authors && npm start  # build + serve em :3002

# Terminal 4 — container (deve subir por último)
cd container && npm start    # build + serve em :3000
```

Acesse `http://localhost:3000` após todos os terminais estarem prontos.

> **Por que não usar `npm run dev`?**
> Em modo de desenvolvimento o Vite serve módulos via HMR e não gera o `remoteEntry.js`
> necessário para o Module Federation. O `npm start` usa `serve` (servidor estático)
> que suporta Service Workers e CORS corretamente.

---

## Stack

|                   | Tecnologia                                      |
| ----------------- | ----------------------------------------------- |
| UI                | React 19 + TypeScript 6                         |
| Build             | Vite 8                                          |
| Module Federation | @originjs/vite-plugin-federation 1.4            |
| Fake backend      | MSW 2                                           |
| Estilos           | CSS Modules + CSS global (sem biblioteca de UI) |
| Monorepo          | npm workspaces                                  |

---

## Documentação

| Arquivo                                        | Conteúdo                                             |
| ---------------------------------------------- | ---------------------------------------------------- |
| [`docs/arquitetura.md`](./docs/arquitetura.md) | Estrutura de pastas, camadas e regras de dependência |
| [`docs/api.md`](./docs/api.md)                 | Endpoints REST, payloads e MSW                       |
| [`docs/componentes.md`](./docs/componentes.md) | Componentes do mfe-shared e suas props               |
| [`docs/hooks.md`](./docs/hooks.md)             | Hooks de dados e comunicação entre MFEs              |
| [`docs/tipos.md`](./docs/tipos.md)             | Interfaces e tipos por pacote                        |
| [`docs/tcc.md`](./docs/tcc.md)                 | Contexto acadêmico, decisões e trade-offs            |
