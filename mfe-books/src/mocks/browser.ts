import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// O service worker intercepta requisições no browser.
// Só é ativado em desenvolvimento (veja main.tsx).
export const worker = setupWorker(...handlers);
