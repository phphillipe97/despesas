class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(d) {
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros() {

		//array de despesas
		let despesas = Array()

		let id = localStorage.getItem('id')

		//recuperar todas as despesas cadastradas em localStorage
		for(let i = 1; i <= id; i++) {

			//recuperar a despesa
			let despesa = JSON.parse(localStorage.getItem(i))

			//existe a possibilidade de haver índices que foram pulados/removidos
			//nestes casos nós vamos pular esses índices
			if(despesa === null) {
				continue
			}
			despesa.id = i
			despesas.push(despesa)
		}

		return despesas
	}

	pesquisar(despesa){

		let despesasFiltradas = Array()
		despesasFiltradas = this.recuperarTodosRegistros()
		console.log(despesasFiltradas);
		console.log(despesa)

		//ano
		if(despesa.ano != ''){
			console.log("filtro de ano");
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}
			
		//mes
		if(despesa.mes != ''){
			console.log("filtro de mes");
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}

		//dia
		if(despesa.dia != ''){
			console.log("filtro de dia");
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}

		//tipo
		if(despesa.tipo != ''){
			console.log("filtro de tipo");
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}

		//descricao
		if(despesa.descricao != ''){
			console.log("filtro de descricao");
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}

		//valor
		if(despesa.valor != ''){
			console.log("filtro de valor");
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		
		return despesasFiltradas

	}

	remover(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd()

// Função para cadastrar DESPESA
function cadastrarDespesa() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value,
		valor.value
	)


	if(despesa.validarDados()) {
		bd.gravar(despesa)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'

		//dialog de sucesso
		$('#modalRegistraDespesa').modal('show') 

		ano.value = '' 
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''
		
	} else {
		
		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		//dialog de erro
		$('#modalRegistraDespesa').modal('show') 
	}
}

// Função para carregar lista DESPESA
function carregaListaDespesas(despesas = Array(), filtro = false) {
    // Se não houver despesas e o filtro não foi ativado, vamos carregar todas as despesas
    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros() 
    }

	/*

	<tr>
		<td>15/03/2018</td>
		<td>Alimentação</td>
		<td>Compras do mês</td>
		<td>444.75</td>
	</tr>

	*/

	let listaDespesas = document.getElementById("listaDespesas")
    listaDespesas.innerHTML = ''

	let totalDespesas = 0; // Variável para armazenar o total das despesas

	despesas.forEach(function(d){

		//Criando a linha (tr)
		var linha = listaDespesas.insertRow();

		//Criando as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

		//Ajustar o tipo
		switch(d.tipo){
			case '1': d.tipo = 'Supermercado'
				break
			case '2': d.tipo = 'Contas Casa'
				break
			case '3': d.tipo = 'Combustível'
				break
			case '4': d.tipo = 'Gastos Lazer'
				break
			case '5': d.tipo = 'Imprevistos'
				break
			
		}
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		// Somar o valor para o total de despesas
		totalDespesas += parseFloat(d.valor);

		//Criar o botão de exclusão
		let btn = document.createElement('button')
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fa fa-times"  ></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function(){
			let id = this.id.replace('id_despesa_','')
			//alert(id)
			bd.remover(id)
			window.location.reload()
		}
		linha.insertCell(4).append(btn)
		console.log(d)
	})
	    
	// Exibir o total das despesas no final
		let totalRow = listaDespesas.insertRow();
		totalRow.insertCell(0).colSpan = 3; // Mesclar células
		totalRow.insertCell(0).innerHTML = "<strong>Total:</strong>";
		totalRow.insertCell(1).innerHTML = totalDespesas.toFixed(2); // Exibir o total com 2 casas decimais

 }

// Função para arquivo.txt lista DESPESA
 function gerarResumoEmTxt(despesas) {
	let conteudo = 'Resumo de Despesas\n\n';

	let totalDespesas = 0;

	despesas.forEach(function(d) {
		let tipoTexto = '';
		switch(d.tipo){
			case '1': tipoTexto = 'Supermercado'; break;
			case '2': tipoTexto = 'Contas Casa'; break;
			case '3': tipoTexto = 'Combustível'; break;
			case '4': tipoTexto = 'Gastos Lazer'; break;
			case '5': tipoTexto = 'Imprevistos'; break;
			default: tipoTexto = 'Outro';
		}

		let data = `${d.dia}/${d.mes}/${d.ano}`;
		conteudo += `${data} - ${tipoTexto} - ${d.descricao} - R$ ${parseFloat(d.valor).toFixed(2)}\n`;
		totalDespesas += parseFloat(d.valor);
	});

	conteudo += `\nTotal: R$ ${totalDespesas.toFixed(2)}\n`;

	// Criar e baixar o arquivo
	let blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
	let link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = 'resumo_despesas.txt';
	link.click();
}

function baixarResumo() {
    let ano = document.getElementById("ano").value;
    let mes = document.getElementById("mes").value;
    let dia = document.getElementById("dia").value;
    let tipo = document.getElementById("tipo").value;
    let descricao = document.getElementById("descricao").value;
    let valor = document.getElementById("valor").value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    // Pesquisar as despesas filtradas
    let despesas = bd.pesquisar(despesa);

    // Se não houver filtro, pegar todas as despesas
    if (despesas.length === 0 && !ano && !mes && !dia && !tipo && !descricao && !valor) {
        despesas = bd.recuperarTodosRegistros();
    }

    gerarResumoEmTxt(despesas);  // Gerar o arquivo .txt com os dados filtrados
}
 
 function pesquisarDespesa(){
	 
	let ano  = document.getElementById("ano").value
	let mes = document.getElementById("mes").value
	let dia = document.getElementById("dia").value
	let tipo = document.getElementById("tipo").value
	let descricao = document.getElementById("descricao").value
	let valor = document.getElementById("valor").value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	let despesas = bd.pesquisar(despesa)
	 
	this.carregaListaDespesas(despesas, true)
	
 }

// Função para obter a lista de itens do localStorage
function getListaItens() {
	let listaItens = localStorage.getItem('listaItens');
	if (listaItens) {
	  return JSON.parse(listaItens);
	} else {
	  return [];
	}
  }
  
  // Função para salvar a lista de itens no localStorage
  function salvarListaItens(listaItens) {
	localStorage.setItem('listaItens', JSON.stringify(listaItens));
  }
  
// Função para adicionar um item na lista
function CadastrarListaItem() {
    // Obtendo os valores inseridos pelo usuário
    var descricao = document.getElementById('descricao').value;
    var quantidade = document.getElementById('quantidade').value;
  
    // Verificando se os campos não estão vazios
    if (descricao.trim() === "" || quantidade === "") {
        alert("Por favor, preencha todos os campos.");
        return;
    }
  
	// Obter a lista atual de itens do localStorage
	let listaItens = getListaItens();
  
	// Criar um objeto com o novo item
	let novoItem = {
	  descricao: descricao,
	  quantidade: quantidade
	};
  
	// Adicionar o novo item à lista
	listaItens.push(novoItem);
  
	// Salvar a lista atualizada no localStorage
	salvarListaItens(listaItens);
  
	// Atualizar a lista exibida na página
	exibirListaItens();
	
	// Limpar os campos
	document.getElementById('descricao').value = '';
	document.getElementById('quantidade').value = '';
  }
  
  // Função para excluir um item
  function excluirItem(index) {
	// Obter a lista de itens do localStorage
	let listaItens = getListaItens();
  
	// Remover o item com o índice fornecido
	listaItens.splice(index, 1);
  
	// Salvar a lista atualizada no localStorage
	salvarListaItens(listaItens);
  
	// Atualizar a lista exibida na página
	exibirListaItens();
  }
  
  function exibirListaItens() {
	let listaItens = getListaItens();
	console.log(listaItens); // Verifique o conteúdo da lista no console
	let listaContainer = document.getElementById('listaItens');
	listaContainer.innerHTML = ''; // Limpar a lista antes de renderizar
	
	if (listaItens.length === 0) {
	  listaContainer.innerHTML = '<tr><td colspan="3">Nenhum item encontrado.</td></tr>';
	}
  
	// Criar a linha de cada item
	listaItens.forEach(function(item, index) {
	  let linha = document.createElement('tr');
  
	  // Criando as células para descrição e quantidade
	  let colDescricao = document.createElement('td');
	  colDescricao.textContent = item.descricao;
  
	  let colQuantidade = document.createElement('td');
	  colQuantidade.textContent = item.quantidade;
  
	  // Criando a célula para o botão de excluir
	  let colBtn = document.createElement('td');
	  let btnExcluir = document.createElement('button');
	  btnExcluir.classList.add('btn', 'btn-danger');
	  btnExcluir.innerHTML = '<i class="fas fa-trash"></i>';
	  btnExcluir.onclick = function() {
		excluirItem(index);
	  };
  
	  // Adicionando o botão à célula
	  colBtn.appendChild(btnExcluir);
  
	  // Adicionando as células à linha
	  linha.appendChild(colDescricao);
	  linha.appendChild(colQuantidade);
	  linha.appendChild(colBtn);
  
	  // Adicionando a linha à tabela
	  listaContainer.appendChild(linha);
	});
  }
  
  // Exibir a lista de itens ao carregar a página
  window.onload = function() {
	exibirListaItens();
  };
  function GerarArquivoListatxt() {
    // Obter a lista de itens
    let listaItens = getListaItens();

    // Cabeçalho
    let conteudo = 'Lista de Itens para Compra\n\n';
    conteudo += 'Descrição                 | Quantidade\n';
    conteudo += '--------------------------|------------\n';

    // Adicionar cada item à lista no arquivo
    listaItens.forEach(function(item) {
        let descricao = item.descricao.padEnd(26, ' ').substring(0, 26); // Alinha a descrição
        let quantidade = item.quantidade.padStart(10, ' '); // Alinha a quantidade à direita

        conteudo += `${descricao} | ${quantidade}\n`;
    });

    // Criar e baixar o arquivo
    let blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'lista_de_itens.txt';
    link.click();
  }
  
  let listaItens = [];
  let itensFiltrados = [];
  
  // Função para carregar os itens do localStorage
  function carregarRoteiro() {
	  const itensSalvos = localStorage.getItem('itens');
	  if (itensSalvos) {
		  listaItens = JSON.parse(itensSalvos);
	  }
	  exibirRoteiro();
  }
  
  // Função para salvar os itens no localStorage
  function salvarRoteiro() {
	  localStorage.setItem('itens', JSON.stringify(listaItens));
  }
  
  // Função para cadastrar um item
  function cadastrarRoteiro() {
	  const descricao = document.getElementById('descricao').value;
	  const prioridade = document.getElementById('prioridade').value;
	  const dataExecucao = document.getElementById('dataExecucao').value;
	  const categoria = document.getElementById('categoria').value;
  
	  if (!descricao || !prioridade || !dataExecucao || !categoria) {
		  alert('Por favor, preencha todos os campos!');
		  return;
	  }
  
	  const item = {
		  descricao,
		  prioridade,
		  dataExecucao: formatarData(dataExecucao), // Formata a data antes de salvar
		  categoria,
		  concluido: false
	  };
  
	  listaItens.push(item);
	  salvarRoteiro();
  
	  document.getElementById('descricao').value = '';
	  document.getElementById('prioridade').value = '';
	  document.getElementById('dataExecucao').value = '';
	  document.getElementById('categoria').value = '';
  
	  exibirRoteiro();
  }
  
  // Função para formatar a data no formato dd/mm/aaaa
  function formatarData(data) {
	  const d = new Date(data);
	  const dia = d.getDate().toString().padStart(2, '0');
	  const mes = (d.getMonth() + 1).toString().padStart(2, '0'); // Mes começa de 0
	  const ano = d.getFullYear();
	  return `${dia}/${mes}/${ano}`;
  }
  
  // Função para exibir itens com base nos filtros
  function exibirRoteiro(filtro = {}) {
	  const lista = document.getElementById('listaRoteiro');
	  lista.innerHTML = '';
  
	  itensFiltrados = listaItens.filter(item => {
		  for (let chave in filtro) {
			  if (filtro[chave] && item[chave] !== filtro[chave]) {
				  return false;
			  }
		  }
		  return true;
	  });
  
	  itensFiltrados.forEach((item, index) => {
		  const row = document.createElement('tr');
		  row.classList.toggle('concluido', item.concluido);
  
		  row.innerHTML = `
			  <td>${item.descricao}</td>
			  <td>${item.prioridade}</td>
			  <td>${item.dataExecucao}</td> <!-- Exibe a data já formatada -->
			  <td>${item.categoria}</td>
			  <td>
				  <button class="btn btn-success" onclick="concluirRoteiro(${index})">
					  <i class="fas fa-check"></i> Concluir
				  </button>
				  <button class="btn btn-warning" onclick="editarRoteiro(${index})">Editar</button>
				  <button class="btn btn-danger" onclick="excluirRoteiro(${index})">Excluir</button>
			  </td>
		  `;
		  lista.appendChild(row);
	  });
  }
  
  // Função para concluir um item
  function concluirRoteiro(index) {
	  const item = itensFiltrados[index];
	  const itemOriginal = listaItens.find(i =>
		  i.descricao === item.descricao &&
		  i.dataExecucao === item.dataExecucao &&
		  i.categoria === item.categoria
	  );
  
	  if (itemOriginal) {
		  itemOriginal.concluido = !itemOriginal.concluido;
		  salvarRoteiro();
		  exibirRoteiro();
	  }
  }
  
  // Função para excluir um item
  function excluirRoteiro(index) {
	  const item = itensFiltrados[index];
  
	  listaItens = listaItens.filter(i =>
		  !(i.descricao === item.descricao &&
			i.dataExecucao === item.dataExecucao &&
			i.categoria === item.categoria)
	  );
  
	  salvarRoteiro();
	  exibirRoteiro();
  }
  
  // Função para editar um item
  function editarRoteiro(index) {
	  const item = itensFiltrados[index];
	  document.getElementById('descricao').value = item.descricao;
	  document.getElementById('prioridade').value = item.prioridade;
	  document.getElementById('dataExecucao').value = item.dataExecucao; // A data será exibida no formato dd/mm/aaaa
	  document.getElementById('categoria').value = item.categoria;
  
	  excluirRoteiro(index);
  }
  
  // Função para gerar um arquivo .txt com os itens filtrados
  function GerarArquivoRoteiro() {
	  const conteudo = itensFiltrados.map(item =>
		  `Descrição: ${item.descricao}\nPrioridade: ${item.prioridade}\nData de Execução: ${item.dataExecucao}\nCategoria: ${item.categoria}\nConcluído: ${item.concluido ? 'Sim' : 'Não'}\n\n`
	  ).join('');
  
	  const blob = new Blob([conteudo], { type: 'text/plain' });
	  const link = document.createElement('a');
	  link.href = URL.createObjectURL(blob);
	  link.download = 'roteiro.txt';
	  link.click();
  }
  
  // Função para aplicar filtros
  function filtrarRoteiro() {
	  const filtroPrioridade = document.getElementById('filtroPrioridade').value;
	  const filtroData = document.getElementById('filtroData').value;
	  const filtroCategoria = document.getElementById('filtroCategoria').value;
  
	  const filtro = {};
	  if (filtroPrioridade) filtro.prioridade = filtroPrioridade;
	  if (filtroData) filtro.dataExecucao = filtroData;
	  if (filtroCategoria) filtro.categoria = filtroCategoria;
  
	  exibirRoteiro(filtro);
  }
  
  // Carregar os itens quando a página for carregada
  document.addEventListener('DOMContentLoaded', () => {
	  carregarRoteiro();
  });
  