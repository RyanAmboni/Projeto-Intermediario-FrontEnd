let receitas = [];
let despesas = [];

const btnCalculadora = document.getElementById('btnCalculadora');
const btnSimulador = document.getElementById('btnSimulador');
const secCalculadora = document.getElementById('calculadora');
const secSimulador = document.getElementById('simulador');

btnCalculadora.addEventListener('click', () => {
  secCalculadora.classList.add('active');
  secSimulador.classList.remove('active');
  btnCalculadora.classList.add('active');
  btnSimulador.classList.remove('active');
});

btnSimulador.addEventListener('click', () => {
  secSimulador.classList.add('active');
  secCalculadora.classList.remove('active');
  btnSimulador.classList.add('active');
  btnCalculadora.classList.remove('active');
});

function atualizarListas() {
  const listaReceitas = document.getElementById('listaReceitas');
  const listaDespesas = document.getElementById('listaDespesas');

  listaReceitas.innerHTML = receitas.map(r => `<li>${r.desc}: R$ ${r.valor.toFixed(2)}</li>`).join('');
  listaDespesas.innerHTML = despesas.map(d => `<li>${d.desc}: R$ ${d.valor.toFixed(2)}</li>`).join('');
}

function atualizarTotais() {
  const totalReceitas = receitas.reduce((soma, r) => soma + r.valor, 0);
  const totalDespesas = despesas.reduce((soma, d) => soma + d.valor, 0);
  const saldo = totalReceitas - totalDespesas;

  document.getElementById('totalReceitas').textContent = totalReceitas.toFixed(2);
  document.getElementById('totalDespesas').textContent = totalDespesas.toFixed(2);

  const saldoSpan = document.getElementById('saldo');
  saldoSpan.textContent = saldo.toFixed(2);
  saldoSpan.style.color = saldo > 0 ? 'limegreen' : saldo < 0 ? 'red' : 'orange';

  return { totalReceitas, totalDespesas, saldo };
}

const btnAddReceita = document.getElementById('addReceita');
btnAddReceita.addEventListener('click', () => {
  const desc = document.getElementById('descReceita').value;
  const valor = parseFloat(document.getElementById('valorReceita').value);
  if (!desc || isNaN(valor)) return;
  receitas.push({ desc, valor });
  document.getElementById('descReceita').value = '';
  document.getElementById('valorReceita').value = '';
  atualizarListas();
  atualizarTotais();
});

const btnAddDespesa = document.getElementById('addDespesa');
btnAddDespesa.addEventListener('click', () => {
  const desc = document.getElementById('descDespesa').value;
  const valor = parseFloat(document.getElementById('valorDespesa').value);
  if (!desc || isNaN(valor)) return;
  despesas.push({ desc, valor });
  document.getElementById('descDespesa').value = '';
  document.getElementById('valorDespesa').value = '';
  atualizarListas();
  atualizarTotais();
});

const btnCopiarResumo = document.getElementById('btnCopiarResumo');
btnCopiarResumo.addEventListener('click', () => {
  const { totalReceitas, saldo } = atualizarTotais();
  const totalDespesas = despesas.reduce((soma, d) => soma + d.valor, 0);
  const situacao = saldo > 0 ? 'Positiva' : saldo < 0 ? 'Negativa' : 'Neutra';

  const resumo = `Resumo do Orçamento:\n\nReceitas: R$ ${totalReceitas.toFixed(2)}\nDespesas: R$ ${totalDespesas.toFixed(2)}\nSaldo:    R$ ${saldo.toFixed(2)}\nSituação: ${situacao}`;

  navigator.clipboard.writeText(resumo);
});

const btnSimular = document.getElementById('btnSimular');
btnSimular.addEventListener('click', () => {
  const valorItem = parseFloat(document.getElementById('valorItem').value);
  const parcelas = parseInt(document.getElementById('parcelas').value, 10);
  const resultadoDiv = document.getElementById('resultadoSimulacao');
  
  resultadoDiv.textContent = 'Analisando...';
  document.getElementById('valorItem').value = '';
  document.getElementById('parcelas').value = '';

  setTimeout(() => {
    const { totalReceitas, totalDespesas, saldo } = atualizarTotais();
    const economia = totalReceitas - totalDespesas; 

    const valorParcela = valorItem / parcelas;

    let recomendacao = '';
    if (valorParcela <= economia * 0.4) {
      recomendacao = 'Compra Consciente';
    } else if (valorParcela > economia * 0.4 && valorParcela <= economia * 0.7) {
      recomendacao = 'Pensar mais';
    } else {
      recomendacao = 'Nem pensar nisso agora';
    }

    resultadoDiv.innerHTML = `
      <strong>Decisão de Compra:</strong><br>
      Valor do item: R$ ${valorItem.toFixed(2)}<br>
      Parcelas: ${parcelas} x R$ ${valorParcela.toFixed(2)}<br>
      Renda mensal: R$ ${totalReceitas.toFixed(2)}<br>
      Economia líquida: R$ ${economia.toFixed(2)}<br>
      Recomendação: ${recomendacao}
    `;
  }, 1000); 
});

const btnCopiarSimulacao = document.getElementById('btnCopiarSimulacao');
btnCopiarSimulacao.addEventListener('click', () => {
  const resultadoDiv = document.getElementById('resultadoSimulacao');
  if (resultadoDiv.textContent.trim()) {
    navigator.clipboard.writeText(resultadoDiv.textContent.trim());
  }
});
