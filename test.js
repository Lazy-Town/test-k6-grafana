import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "Relatório_do_Teste.html": htmlReport(data),
  };
}

// Criar o payload (dados a serem enviados)
let payload = JSON.stringify({
  cpf: "03148250109"
});


// URLs da API (Defina no ambiente ou altere aqui diretamente)
const BASE_URL = __ENV.K6_API_URL || 'https://snap-api.azure-api.net';
const SEARCH_URL = `${BASE_URL}/snap/informacoes/cpf`; // Criar a requisição e obter o ID
const STATUS_URL = `${BASE_URL}/status`; // Verificar o status do ID
const RESULT_URL = `${BASE_URL}/result`; // Obter o resultado final

const API_KEY = __ENV.K6_API_KEY || '46e1a1e36e414f10b4da9a0e10ce0e92';

// Configuração do tempo de espera entre consultas
const WAIT_TIME = 5; // Segundos entre cada requisição

export let options = {
  vus: 1,        // 5 usuários simultâneos
  duration: '45s', // Teste por 45 segundos
  iterations: 1 // Cada VU só executa uma iteração
};

export default function () {
  console.log(`Usando API: ${BASE_URL}`);

  // Fazer a requisição para obter o ID
  let createRes = http.post(SEARCH_URL, payload, {
  headers: {
    'Ocp-Apim-Subscription-Key': API_KEY,
    'Content-Type': 'application/json'
  }
});

  check(createRes, {
    'Criou ID com sucesso': (r) => r.status === 200
  });

  let responseBody = createRes.json();
  let requestId = responseBody.id;

  console.log(`Resposta da API (SEARCH_URL): ${createRes.body}`);
  console.log(`ID Gerado: ${requestId}`);

  if (!requestId) {
    console.error("Erro: ID não gerado!");
    return;
  }

  // Loop até obter um status final
  let status = '';
  while (status !== 'SUCCESS' && status !== 'FAILED' && status !== 'PENDING') {
    let statusPayload = JSON.stringify({ id: requestId }); // Payload correto para STATUS_URL

    let statusRes = http.post(STATUS_URL, statusPayload, {
      headers: { 'Ocp-Apim-Subscription-Key': API_KEY, 'Content-Type': 'application/json' }
    });

    status = statusRes.json();
    console.log(statusRes.json())
    console.log(`Status atual: ${status}`);

    if (status === 'SUCCESS' || status === 'FAILED' || status === 'PENDING') {
      break;
    }

    console.log(`Aguardando ${WAIT_TIME} segundos antes da próxima consulta...`);
    sleep(WAIT_TIME);
  }

  // Se o status final for "SUCCESS", pega o resultado
  if (status === 'SUCCESS') {
    let resultPayload = JSON.stringify({ id: requestId }); // Payload correto para RESULT_URL

    let resultRes = http.post(RESULT_URL, resultPayload, {
      headers: { 'Ocp-Apim-Subscription-Key': API_KEY, 'Content-Type': 'application/json' }
    });

    check(resultRes, {
      'Pegou resultado com sucesso': (r) => r.status === 200
    });

    console.log(`Resultado Final: ${JSON.stringify(resultRes.json())}`);
  } else {
    console.log(`Status final atingido: ${status}. Nenhuma consulta adicional necessária.`);
  }
}
