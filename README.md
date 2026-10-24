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
# (incluindo serve e concurrently, declarados nas devDependencies)
npm install
```

---

## Execução

Os **módulos remotos** precisam ser compilados para gerar o `remoteEntry.js` antes de serem consumidos pelo Host.
Na raiz do monorepo, o script `start` usa `concurrently` para iniciar os remotes (build + servidor estático com CORS via `serve`) e o container (Vite em modo de desenvolvimento):

```bash
# Na raiz do monorepo — inicia os 4 projetos em paralelo
npm start
```

Ou, para iniciar manualmente, abra **um terminal por comando**, sempre a partir da raiz do monorepo:

```bash
# Terminal 1 — mfe-shared (build + serve em :3003)
npm start -w mfe-shared

# Terminal 2 — mfe-books (build + serve em :3001)
npm start -w mfe-books

# Terminal 3 — mfe-authors (build + serve em :3002)
npm start -w mfe-authors

# Terminal 4 — container (Host em modo dev, porta :3000)
npm run dev -w container
```

Aguarde os builds dos remotes terminarem e acesse `http://localhost:3000` (ou a URL exibida no terminal do container).

> **Por que usar `npm start` nos remotes e `npm run dev` no container?**
> Com `@originjs/vite-plugin-federation`, os remotes precisam de build para disponibilizar o `remoteEntry.js`, servido pelo `serve`. Já o container pode ser executado pelo Vite em modo de desenvolvimento.
> O `npm start` da raiz combina esses comandos em paralelo. Se o container abrir antes de algum remote ficar pronto, aguarde a conclusão dos builds e atualize a página.

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
| Execução local    | `concurrently` + `serve`                        |

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
