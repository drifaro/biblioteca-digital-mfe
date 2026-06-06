# Contexto do TCC

## Objetivo

Este projeto é a **implementação Micro Frontend** de uma análise comparativa de
arquiteturas frontend. Serve como contraponto à versão monolítica (`biblioteca-digital-monolitica`),
permitindo a comparação direta entre as duas abordagens usando a mesma aplicação
e funcionalidades idênticas.

---

## Características da Arquitetura MFE

| Característica            | Como se manifesta neste projeto                                |
| ------------------------- | -------------------------------------------------------------- |
| **Composição em runtime** | Module Federation carrega módulos dinamicamente pelo browser   |
| **Builds independentes**  | Cada pacote tem seu próprio `npm run build` e artefato         |
| **Deploy desacoplado**    | Cada pacote pode ser atualizado e reimplantado individualmente |
| **Isolamento de domínio** | Cada MFE tem seus próprios tipos, hooks e mocks                |
| **Comunicação explícita** | Custom Events para dados que cruzam fronteiras de MFE          |

---

## Decisões Arquiteturais

### mfe-shared como biblioteca visual, não de dados

O mfe-shared expõe apenas componentes visuais e ícones — sem hooks, sem tipos de domínio,
sem lógica de negócio. Isso mantém o shared como uma **design system interna** que pode
crescer sem acoplar os MFEs entre si.

Alternativas consideradas e descartadas:

- Expor hooks (ex: `useBooks`) no shared → criaria dependência de dados entre MFEs
- Expor types centralizados → reduziria o isolamento sem benefício real

### Autonomia total dos MFEs

`BooksPage` e `AuthorsPage` são **autossuficientes** — não recebem props de dados do
container. Cada MFE faz seus próprios fetches para a API. Isso implica que quando ambas
as páginas estão ativas, `/api/authors` é chamado duas vezes (pelo mfe-books para o select,
e pelo mfe-authors para o CRUD). Esse double fetch é um trade-off consciente em favor
do isolamento.

### Comunicação via Custom Events

O Header precisa exibir a contagem de livros e autores, mas o mfe-shared (onde o Header
vive) não pode ter lógica de dados, e o container não instancia hooks de CRUD.

A solução adotada:

1. Cada `useBooks`/`useAuthors` dispara um Custom Event após o fetch (`mfe:books:loaded`, `mfe:authors:loaded`)
2. O container escuta esses eventos e mantém os counts no estado local
3. O container passa os counts como props para o Header
4. O container também faz fetches iniciais independentes para garantir que os counts
   estejam corretos antes dos MFEs montarem

Isso demonstra um padrão de comunicação que não existe no monolítico — onde o dado
simplesmente estaria disponível no estado global.

### MSW centralizado no container

O Service Worker só tem autoridade sobre a origem onde foi registrado. Como todos os MFEs
rodam em `localhost:3000` (carregados pelo container), apenas o MSW do container consegue
interceptar as requisições em produção. Os MSWs individuais dos MFEs funcionam apenas
quando os MFEs são executados isoladamente em suas próprias portas (modo dev).

### cssCodeSplit: false

Configuração obrigatória em todos os pacotes. O Vite extrai CSS em arquivos `.css`
separados por padrão, mas o container carrega apenas o JS dos MFEs via Module Federation
— os arquivos `.css` nunca chegam ao DOM. Com `cssCodeSplit: false`, o CSS é embutido
no JS e injetado via `<style>` quando o módulo executa.

---

## Trade-offs documentados

### O que ficou mais complexo no MFE

| Situação                            | Monolítico            | MFE                                              |
| ----------------------------------- | --------------------- | ------------------------------------------------ |
| Subir o ambiente de dev             | `npm run dev`         | 4 terminais com `npm start` na ordem correta     |
| Compartilhar um tipo entre features | Editar 1 arquivo      | Editar N arquivos (um por pacote)                |
| Exibir contagem de livros no Header | Acessar estado global | Custom Events + fetch adicional no container     |
| CSS dos componentes                 | Automático            | Requer `cssCodeSplit: false` em todos os pacotes |
| Tipagem de módulos remotos          | N/A                   | `declarations.d.ts` manual por consumidor        |
| Debugar erros de runtime            | Stack trace direto    | Erros minificados + múltiplas origens            |

### O que ficou mais independente no MFE

- Cada feature pode ser buildada, testada e implantada sem afetar as outras
- Um erro em um MFE não derruba a aplicação inteira
- Times diferentes podem trabalhar em cada MFE sem conflitos de merge
- A feature de livros pode usar uma versão diferente de uma biblioteca da feature de autores

---

## Fluxo de Dados

### Carregamento inicial

```
browser acessa localhost:3000
  └── container carrega
        ├── MSW registrado (intercepta /api/books e /api/authors)
        ├── fetch /api/books → setBookCount
        ├── fetch /api/authors → setAuthorCount
        └── React.lazy carrega Header e Footer do mfe_shared
              └── Header renderiza com bookCount e authorCount iniciais

usuário vê "Acervo de Livros"
  └── React.lazy carrega BooksPage do mfe_books
        ├── useBooks() → fetch /api/books → dispara mfe:books:loaded
        └── useAuthors() → fetch /api/authors (para o select)
```

### Operação de criação (exemplo: novo livro)

```
usuário clica "Cadastrar Livro"
  └── useBooksPage.openAdd()
        └── BookModal renderiza
              └── usuário preenche e confirma
                    └── useBooks.createBook(payload)
                          └── POST /api/books
                                └── MSW do container intercepta
                                      └── db.ts persiste em memória
                                            └── retorna 201 + Book
                                                  └── setBooks atualiza estado local
                                                        └── UI re-renderiza
```

---

## Métricas para o TCC

Para a análise comparativa de desempenho, use o **Google Lighthouse** no Chrome DevTools
em modo **Performance**, com as seguintes configurações:

- Modo: **Desktop** (para consistência entre versões)
- Throttling: **No throttling** (ambiente local)
- Execute 3 vezes cada projeto e use a mediana

### Métricas alvo

| Métrica                          | Descrição                                      | Relevância                             |
| -------------------------------- | ---------------------------------------------- | -------------------------------------- |
| **FCP** (First Contentful Paint) | Tempo até o primeiro conteúdo visível          | Impactado pelo lazy loading do MFE     |
| **TTI** (Time to Interactive)    | Tempo até a página ser interativa              | Impactado pelo número de requisições   |
| **Total Blocking Time**          | Tempo em que o thread principal fica bloqueado | Impactado pelo tamanho dos bundles     |
| **Bundle size**                  | Tamanho total dos arquivos JS                  | Compare `dist/assets/` de cada projeto |

### Como buildar para medir

```bash
# Monolítico
cd biblioteca-digital-monolitica
npm run build
npm run preview  # http://localhost:4173

# MFE — buildar na ordem e subir com serve
cd mfe-shared  && npm start  # :3003
cd mfe-books   && npm start  # :3001
cd mfe-authors && npm start  # :3002
cd container   && npm start  # :3000
```

Meça ambos os projetos no mesmo ambiente e documente as diferenças com justificativa
arquitetural — por que o MFE tem mais/menos requisições, por que o bundle é maior/menor etc.
