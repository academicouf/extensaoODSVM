// Mapeamento dos indicadores com áreas temáticas
const indicadores = {
    'idhm': { nome: 'IDHM (2010)', area: 'Pobreza e vulnerabilidade social', tipo: 'decimal' },
    'desnutricao': { nome: 'Desnutrição < 5 anos', area: 'Desnutrição e segurança alimentar', tipo: 'percentual' },
    'mortalidade_infantil': { nome: 'Mortalidade infantil < 5 anos', area: 'Saúde e bem-estar', tipo: 'percentual' },
    'ideb': { nome: 'IDEB (anos iniciais/finais)', area: 'Educação', tipo: 'texto' },
    'chefia_feminina': { nome: 'Famílias chefiadas por mulheres', area: 'Igualdade de gênero', tipo: 'percentual' },
    'agua': { nome: 'Abastecimento de água', area: 'Água e saneamento', tipo: 'percentual' },
    'energia': { nome: 'Acesso à energia elétrica', area: 'Energia limpa e acessível', tipo: 'percentual' },
    'renda_crescimento': { nome: 'Crescimento da renda', area: 'Trabalho decente e crescimento econômico', tipo: 'percentual' },
    'desigualdade': { nome: 'Desigualdade de renda', area: 'Redução das desigualdades', tipo: 'decimal' },
    'residuos': { nome: 'Gestão de resíduos sólidos', area: 'Cidades e comunidades sustentáveis', tipo: 'percentual' },
    'seguranca': { nome: 'Segurança pública (ocorrências)', area: 'Paz, justiça e instituições eficazes', tipo: 'numero' },
    'meio_ambiente': { nome: 'Proteção ambiental', area: 'Vida terrestre', tipo: 'percentual' }
};

let dadosOriginais = [];
let dadosFiltrados = [];

// Carrega e renderiza os dados dos indicadores
async function carregarResultados() {
    try {
        const response = await fetch('data/indicadores.json');
        dadosOriginais = await response.json();
        dadosFiltrados = [...dadosOriginais];
        
        criarFiltros();
        renderizarTabela();
    } catch (error) {
        console.error('Erro ao carregar dados dos indicadores:', error);
    }
}

// Cria os filtros
function criarFiltros() {
    const filtrosContainer = document.getElementById('filtros-container');
    
    // Filtro por município
    const municipios = [...new Set(dadosOriginais.map(item => item.municipio))].sort();
    const selectMunicipio = document.createElement('select');
    selectMunicipio.id = 'filtro-municipio';
    selectMunicipio.innerHTML = '<option value="">Todos os municípios</option>';
    municipios.forEach(municipio => {
        selectMunicipio.innerHTML += `<option value="${municipio}">${municipio}</option>`;
    });
    
    const labelMunicipio = document.createElement('label');
    labelMunicipio.textContent = 'Município: ';
    labelMunicipio.appendChild(selectMunicipio);
    
    // Filtro por área temática
    const areas = [...new Set(Object.values(indicadores).map(ind => ind.area))].sort();
    const selectArea = document.createElement('select');
    selectArea.id = 'filtro-area';
    selectArea.innerHTML = '<option value="">Todas as áreas temáticas</option>';
    areas.forEach(area => {
        selectArea.innerHTML += `<option value="${area}">${area}</option>`;
    });
    
    const labelArea = document.createElement('label');
    labelArea.textContent = 'Área Temática: ';
    labelArea.appendChild(selectArea);
    
    filtrosContainer.appendChild(labelMunicipio);
    filtrosContainer.appendChild(labelArea);
    
    // Event listeners
    selectMunicipio.addEventListener('change', aplicarFiltros);
    selectArea.addEventListener('change', filtrarColunas);
}

// Aplica os filtros
function aplicarFiltros() {
    const municipioSelecionado = document.getElementById('filtro-municipio').value;
    
    dadosFiltrados = dadosOriginais.filter(item => {
        return !municipioSelecionado || item.municipio === municipioSelecionado;
    });
    
    renderizarTabela();
}

// Renderiza a tabela
function renderizarTabela() {
    const tabela = document.getElementById('tabela-resultados');
    
    // Cabeçalho com todos os indicadores
    let html = `
        <thead>
            <tr>
                <th class="municipio-col">Município</th>
    `;
    
    Object.keys(indicadores).forEach(chave => {
        const indicador = indicadores[chave];
        html += `<th title="${indicador.area}">${indicador.nome}</th>`;
    });
    
    html += `
            </tr>
        </thead>
        <tbody>
    `;
    
    // Dados
    dadosFiltrados.forEach(item => {
        html += `<tr><td class="municipio">${item.municipio}</td>`;
        
        Object.keys(indicadores).forEach(chave => {
            const indicador = indicadores[chave];
            html += `<td>${formatarValor(item[chave], indicador.tipo)}</td>`;
        });
        
        html += '</tr>';
    });
    
    html += '</tbody>';
    tabela.innerHTML = html;
}

// Formata os valores
function formatarValor(valor, tipo) {
    if (valor === null || valor === undefined) {
        return '<span class="sem-dados">Sem dados</span>';
    }
    
    switch (tipo) {
        case 'decimal':
            return typeof valor === 'number' ? valor.toFixed(3) : valor;
        case 'percentual':
            return typeof valor === 'number' ? (valor * 100).toFixed(1) + '%' : valor;
        case 'numero':
            return typeof valor === 'number' ? valor.toString() : valor;
        case 'texto':
        default:
            return valor;
    }
}

// Filtra colunas por área temática
function filtrarColunas() {
    const areaSelecionada = document.getElementById('filtro-area').value;
    const tabela = document.getElementById('tabela-resultados');
    
    if (!tabela) return;
    
    const headers = tabela.querySelectorAll('th');
    const rows = tabela.querySelectorAll('tbody tr');
    
    headers.forEach((header, index) => {
        if (index === 0) return; // Sempre mostra coluna do município
        
        const chaveIndicador = Object.keys(indicadores)[index - 1];
        const indicador = indicadores[chaveIndicador];
        
        if (!areaSelecionada || indicador.area === areaSelecionada) {
            header.style.display = '';
            rows.forEach(row => {
                const cell = row.cells[index];
                if (cell) cell.style.display = '';
            });
        } else {
            header.style.display = 'none';
            rows.forEach(row => {
                const cell = row.cells[index];
                if (cell) cell.style.display = 'none';
            });
        }
    });
}

// Carrega os dados quando a página for carregada
document.addEventListener('DOMContentLoaded', carregarResultados);