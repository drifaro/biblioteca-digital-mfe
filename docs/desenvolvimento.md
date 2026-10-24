# Guia de Desenvolvimento — Biblioteca Digital MFE

## 1. Instalação

Execute os comandos na raiz do monorepo:

```bash
npm install
```

Para validar a reprodução das dependências a partir do `package-lock.json`, é possível utilizar:

```bash
npm ci
```

## 2. Inicialização

### Execução completa

```bash
npm start
```

O comando inicia os remotes e o Host em paralelo utilizando `concurrently`.

A inicialização paralela não garante que todos os módulos fiquem disponíveis exatamente ao mesmo tempo. Aguarde a conclusão dos builds dos remotes antes de acessar o Host.

### Execução individual

Caso precise trabalhar com um módulo específico, abra terminais separados:

```bash
npm start -w mfe-shared
npm start -w mfe-books
npm start -w mfe-authors
npm run dev -w container
```

## 3. Build

Para executar os builds dos workspaces:

```bash
npm run build
```

Esse comando executa os scripts `build` disponíveis nos módulos.

## 4. Verificando o Module Federation

Os módulos remotos disponibilizam um arquivo `remoteEntry.js`, utilizado para o carregamento dinâmico pelo Host.

No caso do `mfe-shared`, a URL configurada é:

```text
http://localhost:3003/assets/remoteEntry.js
```

Ao acessar o endereço, o servidor deve retornar conteúdo JavaScript.

As URLs dos demais remotes devem ser consultadas nas configurações do Vite.

## 5. Solução de problemas

### Erro: 'serve' não é reconhecido

**Causa possível:** a dependência `serve` não está instalada.

**Solução:**

Na raiz do monorepo:

```bash
npm install
```

O pacote `serve` deve estar declarado nas dependências apropriadas do projeto.

### Tela branca ao acessar a aplicação

**Causas possíveis:**

- Remote não iniciado
- Build remoto não concluído
- Porta incorreta
- Falha no carregamento do `remoteEntry.js`
- Erro de execução de um componente React

**Verificação:**

Abra o DevTools do navegador e inspecione as abas Console e Network.

Confirme que os endpoints dos módulos remotos estão acessíveis.

### Erro: Failed to fetch dynamically imported module

**Causa possível:** o Host não consegue acessar o JavaScript disponibilizado pelo remote.

**Solução:**

Verifique:

1. Se o módulo remoto está em execução.
2. Se o arquivo `remoteEntry.js` foi gerado.
3. Se a URL configurada no Host está correta.
4. Se a porta está disponível.
5. Se há erros de CORS ou de resposta HTTP.

### Erro: Expected a JavaScript module, but received text/html

**Causa possível:** a URL do módulo remoto está retornando HTML em vez de JavaScript.

Isso pode ocorrer quando o servidor esperado não está atendendo à rota correta, quando existe uma configuração incorreta de caminho ou quando outro servidor responde naquela porta.

Verifique diretamente a URL do `remoteEntry.js` e seu `Content-Type`.

### Apenas o container inicia ao executar npm start

O comando abaixo executa os scripts dos workspaces sequencialmente:

```bash
npm run start --workspaces --if-present
```

Como os servidores permanecem ativos, o primeiro processo impede o avanço normal para os seguintes.

O monorepo utiliza `concurrently` para executar os módulos em paralelo:

```bash
npm start
```

### O Host inicia antes dos remotes

Como o `concurrently` inicia os processos em paralelo, o Host pode ficar disponível antes da conclusão dos builds remotos.

Aguarde os servidores estáticos iniciarem e atualize a página.

## 6. Encerrando os servidores

Para encerrar a execução iniciada com `npm start`, pressione:

```text
Ctrl + C
```

No script da raiz, a opção `-k` do `concurrently` é utilizada para encerrar os demais processos quando um deles termina.

## 7. Recomendações

- Utilize `npm` de forma consistente com o `package-lock.json`.
- Instale as dependências na raiz do monorepo.
- Mantenha os servidores remotos disponíveis durante a execução.
- Não versione as pastas `node_modules` e `dist`.
- Valide a execução após alterações nos scripts ou nas dependências.
- Consulte o README para os comandos principais e a documentação de arquitetura para as decisões técnicas.
