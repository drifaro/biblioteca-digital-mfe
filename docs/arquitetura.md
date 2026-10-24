# Arquitetura

## Visão Geral

A versão MFE da Biblioteca Digital é composta por 4 projetos independentes em um
**monorepo npm workspaces**. Cada projeto tem seu próprio `package.json`, `vite.config.ts`,
processo de build e servidor.

A composição entre os projetos acontece em **tempo de execução** via
`@originjs/vite-plugin-federation` — uma reimplementação do Module Federation do Webpack
para o Vite. O container (Host) carrega os componentes dos MFEs (Remotes) dinamicamente
pelo browser, sem que eles precisem estar no mesmo bundle.

---

## Estrutura de Pastas

```
biblioteca-digital-mfe/
├── package.json               ← raiz do monorepo (workspaces e scripts de orquestração)
├── package-lock.json          ← versões das dependências instaladas
├── mfe-shared/                ← Remote — biblioteca de componentes (porta 3003)
│   ├── federation.config.ts   ← lista o que é exposto via Module Federation
│   ├── vite.config.ts
│   └── src/
│       ├── global.css
│       ├── main.tsx
│       ├── App.tsx            ← placeholder (não usado em produção)
│       ├── declarations.d.ts
│       └── shared/
│           ├── components/    ← Modal, SearchBar, StatCard, etc.
│           └── icons/         ← PlusIcon, EditIcon, TrashIcon, etc.
├── mfe-books/                 ← Remote — feature de livros (porta 3001)
│   ├── vite.config.ts
│   └── src/
│       ├── global.css
│       ├── main.tsx
│       ├── App.tsx            ← placeholder
│       ├── types.ts           ← tipos próprios da feature
│       ├── declarations.d.ts  ← declara módulos do mfe_shared
│       ├── mocks/             ← MSW (browser, db, handlers)
│       └── features/books/
│           ├── BooksPage.tsx
│           ├── components/    ← BookTable, BookForm, BookModal, BookDeleteModal
│           └── hooks/         ← useBooks, useAuthors, useBooksPage
├── mfe-authors/               ← Remote — feature de autores (porta 3002)
│   └── ...                    ← estrutura espelhada ao mfe-books
└── container/                 ← Host — orquestrador (porta 3000)
    ├── vite.config.ts
    └── src/
        ├── global.css
        ├── main.tsx           ← ativa MSW (sem guard DEV — roda em produção)
        ├── App.tsx            ← navegação + lazy imports + Custom Events
        ├── types.ts           ← tipos usados pelos mocks
        ├── declarations.d.ts  ← declara todos os módulos remotos
        ├── App.module.css
        └── mocks/             ← MSW completo (handlers de books e authors)
```

---

## Execução Local e Orquestração

O monorepo utiliza **npm workspaces** para gerenciar os pacotes. Na raiz, o script
`npm start` utiliza **`concurrently`** para iniciar os três Remotes e o Host em paralelo.
Os Remotes utilizam **`serve`** para disponibilizar os arquivos compilados com CORS.
Ambos os pacotes devem estar declarados nas dependências de desenvolvimento e registrados
no `package-lock.json`.

```bash
# Na raiz: instala as dependências a partir do lockfile
npm ci

# Inicia todos os projetos em paralelo
npm start
```

| Processo      | Execução                                                         | Porta |
| ------------- | ---------------------------------------------------------------- | ----- |
| `mfe-shared`  | `npm start -w mfe-shared` (build + servidor estático)            | 3003  |
| `mfe-books`   | `npm start -w mfe-books` (build + servidor estático)             | 3001  |
| `mfe-authors` | `npm start -w mfe-authors` (build + servidor estático)           | 3002  |
| `container`   | `npm run dev -w container` (servidor de desenvolvimento do Vite) | 3000  |

Os processos são iniciados em paralelo, mas isso **não garante que os Remotes estejam
prontos antes do Host**. Aguarde a conclusão dos builds antes de acessar
`http://localhost:3000`. As URLs configuradas para o Module Federation devem retornar
JavaScript, por exemplo: `http://localhost:3003/assets/remoteEntry.js`.

O comando anterior `npm run start --workspaces --if-present` iniciava os workspaces
**sequencialmente**. Como o primeiro servidor permanece ativo, os demais não eram
iniciados. O uso de `concurrently` resolve essa limitação para a execução local.

Para iniciar os módulos manualmente, execute cada comando da tabela em um terminal
separado. O comando `npm run dev` na raiz inicia somente o `container`; os Remotes
continuam precisando do build para disponibilizar seus arquivos `remoteEntry.js`.

---

## Camadas e Responsabilidades

```
container (Host — :3000)
  ├── Lazy imports via Module Federation
  │     ├── mfe_shared/Header   → <Header />
  │     ├── mfe_shared/Footer   → <Footer />
  │     ├── mfe_books/BooksPage → <BooksPage />
  │     └── mfe_authors/AuthorsPage → <AuthorsPage />
  ├── Escuta Custom Events (mfe:books:loaded, mfe:authors:loaded)
  ├── Passa bookCount e authorCount para o Header via props
  └── Registra MSW (intercepta /api/books e /api/authors)

mfe-shared (Remote — :3003)
  └── Expõe componentes visuais puros e ícones
        Não tem hooks, não tem lógica de dados

mfe-books (Remote — :3001)
  ├── Expõe BooksPage (autossuficiente, sem props de dados)
  ├── useBooks → fetch /api/books + dispara mfe:books:loaded
  ├── useAuthors → fetch /api/authors (só leitura)
  └── MSW próprio (ativo apenas em desenvolvimento)

mfe-authors (Remote — :3002)
  ├── Expõe AuthorsPage (autossuficiente, sem props de dados)
  ├── useAuthors → fetch /api/authors + dispara mfe:authors:loaded
  ├── useBooks → fetch /api/books (só leitura, para contagem)
  └── MSW próprio (ativo apenas em desenvolvimento)
```

---

## Regras de Dependência

| Pacote        | Pode importar de                                                     |
| ------------- | -------------------------------------------------------------------- |
| `mfe-shared`  | Ninguém — é a camada base                                            |
| `mfe-books`   | `mfe_shared/*` via Module Federation                                 |
| `mfe-authors` | `mfe_shared/*` via Module Federation                                 |
| `container`   | `mfe_shared/*`, `mfe_books/*`, `mfe_authors/*` via Module Federation |
| MFEs entre si | ❌ Não permitido                                                     |

---

## Module Federation — Configuração

### Remote (exemplo: mfe-books)

```ts
// mfe-books/vite.config.ts
federation({
  name: "mfe_books", // identificador — deve usar underscore
  filename: "remoteEntry.js", // arquivo gerado no build
  exposes: {
    "./BooksPage": "./src/features/books/BooksPage",
  },
  remotes: {
    mfe_shared: "http://localhost:3003/assets/remoteEntry.js",
  },
  shared: sharedDeps, // react + react-dom com singleton: true
});
```

### Host (container)

```ts
// container/vite.config.ts
federation({
  name: "container",
  remotes: {
    mfe_books: "http://localhost:3001/assets/remoteEntry.js",
    mfe_authors: "http://localhost:3002/assets/remoteEntry.js",
    mfe_shared: "http://localhost:3003/assets/remoteEntry.js",
  },
  shared: sharedDeps,
});
```

### Shared Dependencies

```ts
const sharedDeps = {
  react: { singleton: true, eager: true, requiredVersion: false as const },
  "react-dom": {
    singleton: true,
    eager: true,
    requiredVersion: false as const,
  },
};
```

`singleton: true` garante uma única instância do React no browser.
`eager: true` inclui o React no bundle inicial do container.
`requiredVersion: false` desabilita verificação de versão entre pacotes.

### cssCodeSplit: false

```ts
build: {
  target: "esnext",
  minify: false,
  cssCodeSplit: false,  // obrigatório
}
```

Por padrão o Vite extrai o CSS em arquivos `.css` separados injetados via `<link>` no
HTML do próprio MFE. Quando o container carrega o módulo via Module Federation (só o JS),
esses arquivos `.css` nunca chegam ao DOM. Com `cssCodeSplit: false`, o CSS fica embutido
no bundle JS e é injetado via `<style>` quando o módulo executa.

---

## Lazy Loading no Container

```tsx
// container/src/App.tsx
const Header = React.lazy(() =>
  import("mfe_shared/Header").then((m) => ({ default: m.default ?? m })),
);
const BooksPage = React.lazy(() =>
  import("mfe_books/BooksPage").then((m) => ({ default: m.default ?? m })),
);
```

O `.then(m => ({ default: m.default ?? m }))` garante compatibilidade com módulos que
expõem tanto named exports quanto default exports — comportamento necessário com o
`@originjs/vite-plugin-federation`.

Cada módulo remoto só é baixado pelo browser quando o componente é renderizado pela
primeira vez — lazy loading automático por rota.
