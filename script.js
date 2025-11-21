let cardContainer;
let searchInput;
let searchButton;
let affiliationSelector;
let dados = [];

document.addEventListener('DOMContentLoaded', () => {
    cardContainer = document.querySelector('.card-container');
    searchInput = document.querySelector('input[type="text"]');
    searchButton = document.querySelector('#botao-busca');
    affiliationSelector = document.querySelector('#seletor-afiliacao');

    iniciarBusca();

    searchButton.addEventListener('click', filtrarDados);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            filtrarDados();
        }
    });
    affiliationSelector.addEventListener('change', filtrarDados);
});

async function iniciarBusca() {
    try {
        let resposta = await fetch('data.json');
        dados = await resposta.json();
        renderizarCards(dados);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

function renderizarCards(dados) {
    cardContainer.innerHTML = '';
    for (let dado of dados) {
        let article = document.createElement('article');
        article.classList.add('card');
        article.innerHTML = `
        <h2>${dado["Nome do Personagem"]}</h2>
        <p><strong>Afiliação:</strong> ${dado["Afiliação"]}</p>
        <p><strong>Primeira Aparição:</strong> ${dado["Primeira Aparição"]}</p>
        <p><strong>Ano de Estreia:</strong> ${dado["Ano de Estreia"]}</p>
        <p>${dado["Habilidade Principal"]}</p>
        <a href="${dado["Link da Wiki/Página Oficial"]}" target="_blank">Saiba mais</a>
         `;
        cardContainer.appendChild(article);
    }
}

function getCategoria(afiliacao) {
    const afiliacaoLowerCase = afiliacao.toLowerCase();
    if (afiliacaoLowerCase.includes('liga da justiça') || 
        afiliacaoLowerCase.includes('jovens titãs') || 
        afiliacaoLowerCase.includes('tropa dos lanternas verdes') || 
        afiliacaoLowerCase.includes('família shazam') || 
        afiliacaoLowerCase.includes('bat-família')) {
        return 'heroi';
    } else if (afiliacaoLowerCase.includes('inimigos do batman') || 
               afiliacaoLowerCase.includes('inimigos do superman')) {
        return 'vilao';
    } else {
        return 'neutro';
    }
}

function filtrarDados() {
    let termo = searchInput.value.toLowerCase();
    let afiliacaoSelecionada = affiliationSelector.value;

    let dadosFiltrados = dados.filter(dado => {
        const nome = dado["Nome do Personagem"] ? dado["Nome do Personagem"].toLowerCase() : '';
        const afiliacao = dado["Afiliação"] ? dado["Afiliação"].toLowerCase() : '';
        const habilidade = dado["Habilidade Principal"] ? dado["Habilidade Principal"].toLowerCase() : '';
        
        const atendeTermo = nome.includes(termo) ||
               afiliacao.includes(termo) ||
               habilidade.includes(termo);

        if (afiliacaoSelecionada === 'todos') {
            return atendeTermo;
        }

        const categoria = getCategoria(dado["Afiliação"]);
        return categoria === afiliacaoSelecionada && atendeTermo;
    });
    renderizarCards(dadosFiltrados);
}