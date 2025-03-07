# 📌 Teste de Carga com K6

Este repositório contém um **script de teste de carga** utilizando a biblioteca [K6](https://k6.io/) para testar uma API protegida por `Ocp-Apim-Subscription-Key`.

O script segue **três etapas principais**:
1. **Envia um CPF via POST** e recebe um `id`.
2. **Consulta o status** desse `id` via POST.
3. **Obtém o resultado final** usando esse `id` via POST.

O objetivo é medir o desempenho da API sob carga e gerar relatórios detalhados.

---

## ⚠️ Requisitos

Este projeto requer **Node.js** instalado.

Verifique sua versão com:

```sh
node --version
```

Se necessário, instale uma versão compatível [aqui](https://nodejs.org/).

Além disso, o **K6** precisa estar instalado.

---

## 🔧 Instalação

1. **Clone este repositório**:

   ```sh
   git clone https://github.com/seu-usuario/k6-api-test.git
   cd k6-api-test
   ```

2. **Instale o K6** (caso ainda não tenha):

   ```sh
   sudo apt install k6   # Linux
   choco install k6      # Windows (usando Chocolatey)
   brew install k6       # macOS (usando Homebrew)
   ```

---

## 📜 Como Usar

### 🔹 Configurar o Script

Antes de rodar o teste, defina as seguintes variáveis de ambiente ou edite diretamente no script:

```sh
export K6_API_URL="https://sua-api.com"  # URL base da API
export K6_API_KEY="sua-chave"             # Chave de autenticação
```

Ou substitua no código:

```javascript
const BASE_URL = "https://sua-api.com";
const API_KEY = "sua-chave";
```

### 🔹 Executar o Teste

Para iniciar o teste, execute:

```sh
k6 run k6-test.js
```

Se quiser gerar um **relatório em HTML**, use:

```sh
k6 run k6-test.js && open Relatório_do_Teste.html
```

---

## 🖥️ Fluxo do Script

1. **Autenticação**  
   - Adiciona o cabeçalho `Ocp-Apim-Subscription-Key`.

2. **Envio do CPF (POST)**  
   - O CPF é enviado para a API.  
   - Se a resposta for **200**, um `id` é retornado.

3. **Consulta de Status (POST)**  
   - O script consulta o status do `id` periodicamente.  
   - Se o status for **PENDING**, continua esperando.  
   - Se o status for **FAILED**, o teste falha.  
   - Se o status for **SUCCESS**, passa para a próxima etapa.

4. **Obtenção do Resultado Final (POST)**  
   - A API retorna os dados finais.  
   - Se o status for **200**, o resultado é impresso.  
   - Se houver erro, ele é exibido.

5. **Gera um relatório HTML**  
   - Um relatório visual é salvo automaticamente.

---

## 📊 Exemplo de Saída

Durante a execução, o console pode exibir algo como:

```
Usando API: https://sua-api.com
Resposta da API (SEARCH_URL): {"id": "12345"}
ID Gerado: 12345
Status atual: PENDING
Aguardando 5 segundos antes da próxima consulta...
Status atual: SUCCESS
Resultado Final: {"score": 850, "status": "APROVADO"}
```

---

## 🛠️ Personalizações

Se precisar **ajustar os tempos de espera**, edite:

```javascript
const WAIT_TIME = 5; // Segundos entre cada requisição
```

Caso queira **alterar o número de usuários e tempo do teste**, modifique:

```javascript
export let options = {
  vus: 5,        // Número de usuários simultâneos
  duration: '45s', // Tempo total do teste
  iterations: 1   // Cada VU executa apenas uma iteração
};
```

---

## 📌 Referências

- [Documentação Oficial do K6](https://k6.io/docs/)
- [Testes de Carga com K6](https://medium.com/)

---

## 📝 Autor

📌 **Gabriel Martins**  
🔗 [GitHub](https://github.com/Lazy-Town)  
📧 gabriel.silvamartins@yahoo.com.br  

---

