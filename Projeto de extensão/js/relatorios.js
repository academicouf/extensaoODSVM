// Carrega e gerencia os relatórios
let relatoriosData = [];

async function carregarRelatorios() {
    try {
        const response = await fetch('data/relatorios.json');
        relatoriosData = await response.json();
        
        popularSelectMunicipio();
        configurarEventListeners();
    } catch (error) {
        console.error('Erro ao carregar dados dos relatórios:', error);
    }
}

function popularSelectMunicipio() {
    const select = document.getElementById('select-municipio');
    
    relatoriosData.forEach(item => {
        const option = document.createElement('option');
        option.value = item.municipio;
        option.textContent = item.municipio;
        select.appendChild(option);
    });
}

function configurarEventListeners() {
    const selectMunicipio = document.getElementById('select-municipio');
    const radioRelatorio = document.getElementById('tipo-relatorio');
    const radioSlide = document.getElementById('tipo-slide');
    
    selectMunicipio.addEventListener('change', atualizarViewer);
    radioRelatorio.addEventListener('change', atualizarViewer);
    radioSlide.addEventListener('change', atualizarViewer);
}

function atualizarViewer() {
    const municipioSelecionado = document.getElementById('select-municipio').value;
    const tipoSelecionado = document.querySelector('input[name="tipo-documento"]:checked').value;
    
    const placeholder = document.getElementById('placeholder-relatorio');
    const iframe = document.getElementById('pdf-viewer');
    const erroContainer = document.getElementById('erro-acesso');
    const linkDireto = document.getElementById('link-direto');
    
    // Esconde todos os elementos
    placeholder.style.display = 'none';
    iframe.style.display = 'none';
    erroContainer.style.display = 'none';
    
    if (!municipioSelecionado) {
        placeholder.style.display = 'block';
        return;
    }
    
    const dadosMunicipio = relatoriosData.find(item => item.municipio === municipioSelecionado);
    
    if (dadosMunicipio) {
        const url = tipoSelecionado === 'relatorio' ? dadosMunicipio.relatorio : dadosMunicipio.slide;
        
        // Verifica se o documento está disponível
        if (!url || url.trim() === '') {
            mostrarMensagemIndisponivel(tipoSelecionado);
            return;
        }
        
        // Configura link direto
        const linkUrl = url.replace('/preview', '/view').replace('/embed', '/edit');
        linkDireto.href = linkUrl;
        
        // Mostra aviso de carregamento
        mostrarAvisoCarregamento();
        
        // Tenta carregar no iframe
        iframe.src = url;
        iframe.style.display = 'block';
        
        // Detecta erro de carregamento
        iframe.onload = function() {
            // Se carregou com sucesso, mantém o iframe
        };
        
        iframe.onerror = function() {
            iframe.style.display = 'none';
            erroContainer.style.display = 'block';
        };
        
        // Timeout para detectar problemas de acesso
        setTimeout(() => {
            try {
                // Se não conseguir acessar o conteúdo, mostra erro
                if (iframe.contentDocument === null) {
                    iframe.style.display = 'none';
                    erroContainer.style.display = 'block';
                }
            } catch (e) {
                iframe.style.display = 'none';
                erroContainer.style.display = 'block';
            }
        }, 5000);
    }
}

function mostrarAvisoCarregamento() {
    const placeholder = document.getElementById('placeholder-relatorio');
    
    placeholder.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
            <div style="margin-bottom: 20px;">
                <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #2c3e50; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            </div>
            <p style="margin-bottom: 15px;">Carregando documento...</p>
            <p style="font-size: 0.9em; color: #999;">Se demorar, aguarde um pouquinho para que apareça a opção de abrir em uma nova aba.</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    placeholder.style.display = 'block';
    
    // Remove o aviso após 3 segundos
    setTimeout(() => {
        placeholder.style.display = 'none';
    }, 3000);
}

function mostrarMensagemIndisponivel(tipo) {
    const placeholder = document.getElementById('placeholder-relatorio');
    const tipoDoc = tipo === 'relatorio' ? 'relatório' : 'slide';
    
    placeholder.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
            <h3 style="color: #d9534f; margin-bottom: 20px;">Documento Indisponível</h3>
            <p style="margin-bottom: 15px;">O ${tipoDoc} deste município não está disponível para visualização pública.</p>
            <p style="margin-bottom: 20px;"><strong>Documentos disponíveis:</strong></p>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 10px;">📄 <strong>Baía da Traição</strong> - Relatório disponível</li>
                <li style="margin-bottom: 10px;">📄 <strong>Mamanguape</strong> - Relatório disponível</li>
            </ul>
        </div>
    `;
    placeholder.style.display = 'block';
}

// Carrega os relatórios quando a página for carregada
document.addEventListener('DOMContentLoaded', carregarRelatorios);