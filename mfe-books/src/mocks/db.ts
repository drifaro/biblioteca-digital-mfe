import type { Author, Book } from "../types";

// ============================================================
//  BANCO DE DADOS EM MEMÓRIA
//  Simula a persistência que existiria num backend real.
//  Os dados são resetados a cada reload — comportamento
//  esperado e documentado para a versão de desenvolvimento.
// ============================================================

const authors: Author[] = [
  {
    id: 1,
    name: "Machado de Assis",
    nationality: "Brasileira",
    birthYear: 1839,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Machado_de_Assis_by_Marc_Ferrez.jpg/250px-Machado_de_Assis_by_Marc_Ferrez.jpg",
  },
  {
    id: 2,
    name: "Clarice Lispector",
    nationality: "Brasileira",
    birthYear: 1920,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/%281920-1977%29_Clarice_Lispector_6zxkp_please_credit%28palette.fm%29_%28cropped%29.png",
  },
  {
    id: 3,
    name: "Jorge Amado",
    nationality: "Brasileira",
    birthYear: 1912,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Jorge_Amado%2C_Portrait_2%2C_1988.png/250px-Jorge_Amado%2C_Portrait_2%2C_1988.png",
  },
  {
    id: 4,
    name: "Guimarães Rosa",
    nationality: "Brasileira",
    birthYear: 1908,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/99/Guimar%C3%A3es_Rosa%2C_anos_1960.jpg",
  },
  {
    id: 5,
    name: "Carlos Drummond de Andrade",
    nationality: "Brasileira",
    birthYear: 1902,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Foto_Carlos_Drummond_de_Andrade_%28restaurada%29.png/960px-Foto_Carlos_Drummond_de_Andrade_%28restaurada%29.png",
  },
  {
    id: 6,
    name: "Fernando Pessoa",
    nationality: "Portuguesa",
    birthYear: 1888,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Pessoa_chapeu.jpg/250px-Pessoa_chapeu.jpg",
  },
  {
    id: 7,
    name: "José Saramago",
    nationality: "Portuguesa",
    birthYear: 1922,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/87/JSJoseSaramago_%28cropped%29.jpg",
  },
  {
    id: 8,
    name: "Gabriel García Márquez",
    nationality: "Colombiana",
    birthYear: 1927,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Gabriel_Garcia_Marquez.jpg/250px-Gabriel_Garcia_Marquez.jpg",
  },
  {
    id: 9,
    name: "Jorge Luis Borges",
    nationality: "Argentina",
    birthYear: 1899,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Jorge_Luis_Borges_1951%2C_by_Grete_Stern.jpg/250px-Jorge_Luis_Borges_1951%2C_by_Grete_Stern.jpg",
  },
  {
    id: 10,
    name: "Franz Kafka",
    nationality: "Alemã",
    birthYear: 1883,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Franz_Kafka%2C_1923.jpg/250px-Franz_Kafka%2C_1923.jpg",
  },
  {
    id: 11,
    name: "Fiódor Dostoiévski",
    nationality: "Russa",
    birthYear: 1821,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Dostoevsky.jpg/250px-Dostoevsky.jpg",
  },
  {
    id: 12,
    name: "Liev Tolstói",
    nationality: "Russa",
    birthYear: 1828,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/L.N.Tolstoy_Prokudin-Gorsky.jpg/250px-L.N.Tolstoy_Prokudin-Gorsky.jpg",
  },
  {
    id: 13,
    name: "George Orwell",
    nationality: "Britânica",
    birthYear: 1903,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/George_Orwell_press_photo.jpg/250px-George_Orwell_press_photo.jpg",
  },
  {
    id: 14,
    name: "Aldous Huxley",
    nationality: "Britânica",
    birthYear: 1894,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Aldous_Huxley_psychical_researcher.png/250px-Aldous_Huxley_psychical_researcher.png",
  },
  {
    id: 15,
    name: "Ernest Hemingway",
    nationality: "Americana",
    birthYear: 1899,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/ErnestHemingway.jpg/250px-ErnestHemingway.jpg",
  },
  {
    id: 16,
    name: "F. Scott Fitzgerald",
    nationality: "Americana",
    birthYear: 1896,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Francis_Scott_Fitzgerald_1937_June_4_%281%29_%28photo_by_Carl_van_Vechten%29.jpg/250px-Francis_Scott_Fitzgerald_1937_June_4_%281%29_%28photo_by_Carl_van_Vechten%29.jpg",
  },
  {
    id: 17,
    name: "Emily Brontë",
    nationality: "Britânica",
    birthYear: 1818,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Emily_Bront%C3%AB_by_Patrick_Branwell_Bront%C3%AB_restored.jpg/250px-Emily_Bront%C3%AB_by_Patrick_Branwell_Bront%C3%AB_restored.jpg",
  },
  {
    id: 18,
    name: "Haruki Murakami",
    nationality: "Japonesa",
    birthYear: 1949,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Murakami_Haruki_%282009%29.jpg/250px-Murakami_Haruki_%282009%29.jpg",
  },
  {
    id: 19,
    name: "Isabel Allende",
    nationality: "Chilena",
    birthYear: 1942,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Isabel_allende.jpg/250px-Isabel_allende.jpg",
  },
  {
    id: 20,
    name: "Cora Coralina",
    nationality: "Brasileira",
    birthYear: 1889,
    image:
      "https://upload.wikimedia.org/wikipedia/pt/thumb/d/db/Cora_Coralina.jpg/250px-Cora_Coralina.jpg",
  },
];

const books: Book[] = [
  // ── Machado de Assis ──
  {
    id: 101,
    title: "Dom Casmurro",
    authorId: 1,
    year: 1899,
    genre: "Romance",
    isbn: "978-85-359-0277-5",
  },
  {
    id: 102,
    title: "Memórias Póstumas de Brás Cubas",
    authorId: 1,
    year: 1881,
    genre: "Romance",
    isbn: "978-85-359-0101-3",
  },
  {
    id: 103,
    title: "Quincas Borba",
    authorId: 1,
    year: 1891,
    genre: "Romance",
    isbn: "978-85-359-0188-4",
  },
  {
    id: 104,
    title: "Papéis Avulsos",
    authorId: 1,
    year: 1882,
    genre: "Conto",
    isbn: "978-85-359-0212-6",
  },

  // ── Clarice Lispector ──
  {
    id: 201,
    title: "A Hora da Estrela",
    authorId: 2,
    year: 1977,
    genre: "Ficção Científica",
    isbn: "978-85-359-0111-2",
  },
  {
    id: 202,
    title: "A Paixão Segundo G.H.",
    authorId: 2,
    year: 1964,
    genre: "Romance",
    isbn: "978-85-359-0222-5",
  },
  {
    id: 203,
    title: "Laços de Família",
    authorId: 2,
    year: 1960,
    genre: "Conto",
    isbn: "978-85-359-0333-8",
  },
  {
    id: 204,
    title: "Perto do Coração Selvagem",
    authorId: 2,
    year: 1943,
    genre: "Romance",
    isbn: "978-85-359-0444-1",
  },

  // ── Jorge Amado ──
  {
    id: 301,
    title: "Gabriela, Cravo e Canela",
    authorId: 3,
    year: 1958,
    genre: "Romance",
    isbn: "978-85-359-0456-4",
  },
  {
    id: 302,
    title: "Capitães da Areia",
    authorId: 3,
    year: 1937,
    genre: "Romance",
    isbn: "978-85-359-0567-7",
  },
  {
    id: 303,
    title: "Dona Flor e Seus Dois Maridos",
    authorId: 3,
    year: 1966,
    genre: "Romance",
    isbn: "978-85-359-0678-0",
  },
  {
    id: 304,
    title: "Tieta do Agreste",
    authorId: 3,
    year: 1977,
    genre: "Romance",
    isbn: "978-85-359-0789-3",
  },

  // ── Guimarães Rosa ──
  {
    id: 401,
    title: "Grande Sertão: Veredas",
    authorId: 4,
    year: 1956,
    genre: "Romance",
    isbn: "978-85-359-0890-6",
  },
  {
    id: 402,
    title: "Sagarana",
    authorId: 4,
    year: 1946,
    genre: "Conto",
    isbn: "978-85-359-0901-9",
  },
  {
    id: 403,
    title: "Primeiras Estórias",
    authorId: 4,
    year: 1962,
    genre: "Conto",
    isbn: "978-85-359-1012-2",
  },

  // ── Carlos Drummond de Andrade ──
  {
    id: 501,
    title: "Alguma Poesia",
    authorId: 5,
    year: 1930,
    genre: "Poesia",
    isbn: "978-85-359-1123-5",
  },
  {
    id: 502,
    title: "A Rosa do Povo",
    authorId: 5,
    year: 1945,
    genre: "Poesia",
    isbn: "978-85-359-1234-8",
  },
  {
    id: 503,
    title: "Sentimento do Mundo",
    authorId: 5,
    year: 1940,
    genre: "Poesia",
    isbn: "978-85-359-1345-1",
  },

  // ── Fernando Pessoa ──
  {
    id: 601,
    title: "Mensagem",
    authorId: 6,
    year: 1934,
    genre: "Poesia",
    isbn: "978-85-359-1456-4",
  },
  {
    id: 602,
    title: "Livro do Desassossego",
    authorId: 6,
    year: 1982,
    genre: "Ensaio",
    isbn: "978-85-359-1567-7",
  },
  {
    id: 603,
    title: "Ficções do Interlúdio",
    authorId: 6,
    year: 1942,
    genre: "Poesia",
    isbn: "978-85-359-1678-0",
  },

  // ── José Saramago ──
  {
    id: 701,
    title: "Ensaio sobre a Cegueira",
    authorId: 7,
    year: 1995,
    genre: "Romance",
    isbn: "978-85-359-1789-3",
  },
  {
    id: 702,
    title: "O Evangelho Segundo Jesus Cristo",
    authorId: 7,
    year: 1991,
    genre: "Romance",
    isbn: "978-85-359-1890-6",
  },
  {
    id: 703,
    title: "Memorial do Convento",
    authorId: 7,
    year: 1982,
    genre: "Romance",
    isbn: "978-85-359-1901-9",
  },

  // ── Gabriel García Márquez ──
  {
    id: 801,
    title: "Cem Anos de Solidão",
    authorId: 8,
    year: 1967,
    genre: "Romance",
    isbn: "978-85-359-2012-2",
  },
  {
    id: 802,
    title: "Amor nos Tempos do Cólera",
    authorId: 8,
    year: 1985,
    genre: "Romance",
    isbn: "978-85-359-2123-5",
  },
  {
    id: 803,
    title: "Crônica de uma Morte Anunciada",
    authorId: 8,
    year: 1981,
    genre: "Crônica",
    isbn: "978-85-359-2234-8",
  },

  // ── Jorge Luis Borges ──
  {
    id: 901,
    title: "Ficções",
    authorId: 9,
    year: 1944,
    genre: "Conto",
    isbn: "978-85-359-2345-1",
  },
  {
    id: 902,
    title: "O Aleph",
    authorId: 9,
    year: 1949,
    genre: "Conto",
    isbn: "978-85-359-2456-4",
  },
  {
    id: 903,
    title: "Labirintos",
    authorId: 9,
    year: 1962,
    genre: "Ensaio",
    isbn: "978-85-359-2567-7",
  },

  // ── Franz Kafka ──
  {
    id: 1001,
    title: "A Metamorfose",
    authorId: 10,
    year: 1915,
    genre: "Conto",
    isbn: "978-85-359-2678-0",
  },
  {
    id: 1002,
    title: "O Processo",
    authorId: 10,
    year: 1925,
    genre: "Romance",
    isbn: "978-85-359-2789-3",
  },
  {
    id: 1003,
    title: "O Castelo",
    authorId: 10,
    year: 1926,
    genre: "Romance",
    isbn: "978-85-359-2890-6",
  },

  // ── Dostoiévski ──
  {
    id: 1101,
    title: "Crime e Castigo",
    authorId: 11,
    year: 1866,
    genre: "Romance",
    isbn: "978-85-359-2901-9",
  },
  {
    id: 1102,
    title: "O Idiota",
    authorId: 11,
    year: 1869,
    genre: "Romance",
    isbn: "978-85-359-3012-2",
  },
  {
    id: 1103,
    title: "Os Irmãos Karamazov",
    authorId: 11,
    year: 1880,
    genre: "Romance",
    isbn: "978-85-359-3123-5",
  },

  // ── Tolstói ──
  {
    id: 1201,
    title: "Guerra e Paz",
    authorId: 12,
    year: 1869,
    genre: "Romance",
    isbn: "978-85-359-3234-8",
  },
  {
    id: 1202,
    title: "Anna Karênina",
    authorId: 12,
    year: 1878,
    genre: "Romance",
    isbn: "978-85-359-3345-1",
  },

  // ── George Orwell ──
  {
    id: 1301,
    title: "1984",
    authorId: 13,
    year: 1949,
    genre: "Ficção Científica",
    isbn: "978-85-359-3456-4",
  },
  {
    id: 1302,
    title: "A Revolução dos Bichos",
    authorId: 13,
    year: 1945,
    genre: "Fantasia",
    isbn: "978-85-359-3567-7",
  },

  // ── Aldous Huxley ──
  {
    id: 1401,
    title: "Admirável Mundo Novo",
    authorId: 14,
    year: 1932,
    genre: "Ficção Científica",
    isbn: "978-85-359-3678-0",
  },
  {
    id: 1402,
    title: "Contraponto",
    authorId: 14,
    year: 1928,
    genre: "Romance",
    isbn: "978-85-359-3789-3",
  },

  // ── Hemingway ──
  {
    id: 1501,
    title: "O Velho e o Mar",
    authorId: 15,
    year: 1952,
    genre: "Romance",
    isbn: "978-85-359-3890-6",
  },
  {
    id: 1502,
    title: "Por Quem os Sinos Dobram",
    authorId: 15,
    year: 1940,
    genre: "Romance",
    isbn: "978-85-359-3901-9",
  },

  // ── F. Scott Fitzgerald ──
  {
    id: 1601,
    title: "O Grande Gatsby",
    authorId: 16,
    year: 1925,
    genre: "Romance",
    isbn: "978-85-359-4012-2",
  },
  {
    id: 1602,
    title: "Suave é a Noite",
    authorId: 16,
    year: 1934,
    genre: "Romance",
    isbn: "978-85-359-4123-5",
  },

  // ── Emily Brontë ──
  {
    id: 1701,
    title: "O Morro dos Ventos Uivantes",
    authorId: 17,
    year: 1847,
    genre: "Romance",
    isbn: "978-85-359-4234-8",
  },

  // ── Haruki Murakami ──
  {
    id: 1801,
    title: "Norwegian Wood",
    authorId: 18,
    year: 1987,
    genre: "Romance",
    isbn: "978-85-359-4345-1",
  },
  {
    id: 1802,
    title: "Kafka à Beira-Mar",
    authorId: 18,
    year: 2002,
    genre: "Fantasia",
    isbn: "978-85-359-4456-4",
  },
  {
    id: 1803,
    title: "O Assassinato do Comendador",
    authorId: 18,
    year: 2017,
    genre: "Fantasia",
    isbn: "978-85-359-4567-7",
  },

  // ── Isabel Allende ──
  {
    id: 1901,
    title: "A Casa dos Espíritos",
    authorId: 19,
    year: 1982,
    genre: "Romance",
    isbn: "978-85-359-4678-0",
  },
  {
    id: 1902,
    title: "Eva Luna",
    authorId: 19,
    year: 1987,
    genre: "Romance",
    isbn: "978-85-359-4789-3",
  },

  // ── Cora Coralina ──
  {
    id: 2001,
    title: "Poemas dos Becos de Goiás",
    authorId: 20,
    year: 1965,
    genre: "Poesia",
    isbn: "978-85-359-4890-6",
  },
  {
    id: 2002,
    title: "Meu Livro de Cordel",
    authorId: 20,
    year: 1976,
    genre: "Poesia",
    isbn: "978-85-359-4901-9",
  },
];

// ── Exportação do "banco" mutável ────────────────────────────
// Usamos um objeto com getters/setters para simular
// que os handlers lêem e escrevem no mesmo "banco".

export const db = {
  get authors(): Author[] {
    return authors;
  },
  get books(): Book[] {
    return books;
  },

  nextId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  },

  // Authors
  findAuthor(id: number): Author | undefined {
    return authors.find((a) => a.id === id);
  },
  addAuthor(author: Author): void {
    authors.push(author);
  },
  updateAuthor(id: number, patch: Partial<Author>): Author | null {
    const index = authors.findIndex((a) => a.id === id);
    if (index === -1) return null;
    authors[index] = { ...authors[index], ...patch };
    return authors[index];
  },
  deleteAuthor(id: number): boolean {
    const index = authors.findIndex((a) => a.id === id);
    if (index === -1) return false;
    authors.splice(index, 1);
    return true;
  },

  // Books
  findBook(id: number): Book | undefined {
    return books.find((b) => b.id === id);
  },
  addBook(book: Book): void {
    books.push(book);
  },
  updateBook(id: number, patch: Partial<Book>): Book | null {
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) return null;
    books[index] = { ...books[index], ...patch };
    return books[index];
  },
  deleteBook(id: number): boolean {
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) return false;
    books.splice(index, 1);
    return true;
  },
};
