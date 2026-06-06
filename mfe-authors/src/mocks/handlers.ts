import { http, HttpResponse } from "msw";
import { db } from "./db";
import type { Book, CreateAuthorPayload, UpdateAuthorPayload } from "../types";

type CreateBookPayload = Omit<Book, "id">;
type UpdateBookPayload = Partial<Omit<Book, "id">>;

// Simula latência de rede (ms) — útil para testar loading states
const DELAY = 300;

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const handlers = [
  // ════════════════════════════════════════
  //  AUTHORS
  // ════════════════════════════════════════

  // GET /api/authors — lista todos
  http.get("/api/authors", async () => {
    await wait(DELAY);
    return HttpResponse.json(db.authors);
  }),

  // GET /api/authors/:id — busca um autor
  http.get("/api/authors/:id", async ({ params }) => {
    await wait(DELAY);
    const id = Number(params.id);
    const author = db.findAuthor(id);
    if (!author) {
      return HttpResponse.json(
        { error: `Autor com id ${id} não encontrado` },
        { status: 404 },
      );
    }
    return HttpResponse.json(author);
  }),

  // POST /api/authors — cria novo autor
  http.post("/api/authors", async ({ request }) => {
    await wait(DELAY);
    const body = (await request.json()) as CreateAuthorPayload;

    if (!body.name?.trim()) {
      return HttpResponse.json(
        { error: "O campo 'name' é obrigatório" },
        { status: 400 },
      );
    }

    const author = {
      id: db.nextId(),
      name: body.name.trim(),
      nationality: body.nationality ?? null,
      birthYear: body.birthYear ?? null,
    };
    db.addAuthor(author);
    return HttpResponse.json(author, { status: 201 });
  }),

  // PUT /api/authors/:id — atualiza autor existente
  http.put("/api/authors/:id", async ({ params, request }) => {
    await wait(DELAY);
    const id = Number(params.id);
    const body = (await request.json()) as UpdateAuthorPayload;
    const updated = db.updateAuthor(id, body);

    if (!updated) {
      return HttpResponse.json(
        { error: `Autor com id ${id} não encontrado` },
        { status: 404 },
      );
    }
    return HttpResponse.json(updated);
  }),

  // DELETE /api/authors/:id — remove autor
  http.delete("/api/authors/:id", async ({ params }) => {
    await wait(DELAY);
    const id = Number(params.id);
    const deleted = db.deleteAuthor(id);

    if (!deleted) {
      return HttpResponse.json(
        { error: `Autor com id ${id} não encontrado` },
        { status: 404 },
      );
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // ════════════════════════════════════════
  //  BOOKS
  // ════════════════════════════════════════

  // GET /api/books — lista todos
  http.get("/api/books", async () => {
    await wait(DELAY);
    return HttpResponse.json(db.books);
  }),

  // GET /api/books/:id — busca um livro
  http.get("/api/books/:id", async ({ params }) => {
    await wait(DELAY);
    const id = Number(params.id);
    const book = db.findBook(id);
    if (!book) {
      return HttpResponse.json(
        { error: `Livro com id ${id} não encontrado` },
        { status: 404 },
      );
    }
    return HttpResponse.json(book);
  }),

  // POST /api/books — cria novo livro
  http.post("/api/books", async ({ request }) => {
    await wait(DELAY);
    const body = (await request.json()) as CreateBookPayload;

    if (!body.title?.trim()) {
      return HttpResponse.json(
        { error: "O campo 'title' é obrigatório" },
        { status: 400 },
      );
    }
    if (!body.authorId) {
      return HttpResponse.json(
        { error: "O campo 'authorId' é obrigatório" },
        { status: 400 },
      );
    }
    if (!db.findAuthor(body.authorId)) {
      return HttpResponse.json(
        { error: `Autor com id ${body.authorId} não encontrado` },
        { status: 422 },
      );
    }

    const book = {
      id: db.nextId(),
      title: body.title.trim(),
      authorId: body.authorId,
      year: body.year ?? null,
      genre: body.genre ?? null,
      isbn: body.isbn ?? null,
    };
    db.addBook(book);
    return HttpResponse.json(book, { status: 201 });
  }),

  // PUT /api/books/:id — atualiza livro existente
  http.put("/api/books/:id", async ({ params, request }) => {
    await wait(DELAY);
    const id = Number(params.id);
    const body = (await request.json()) as UpdateBookPayload;
    const updated = db.updateBook(id, body);

    if (!updated) {
      return HttpResponse.json(
        { error: `Livro com id ${id} não encontrado` },
        { status: 404 },
      );
    }
    return HttpResponse.json(updated);
  }),

  // DELETE /api/books/:id — remove livro
  http.delete("/api/books/:id", async ({ params }) => {
    await wait(DELAY);
    const id = Number(params.id);
    const deleted = db.deleteBook(id);

    if (!deleted) {
      return HttpResponse.json(
        { error: `Livro com id ${id} não encontrado` },
        { status: 404 },
      );
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
