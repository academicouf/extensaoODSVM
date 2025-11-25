// Carrega e renderiza os dados dos municípios
async function carregarMunicipios() {
    try {
        const response = await fetch('data/municipio.json');
        const data = await response.json();
        
        const container = document.getElementById('carrossel-municipios');
        
        data.municipios.forEach(municipio => {
            const card = document.createElement('div');
            card.className = 'municipio-card';
            
            card.innerHTML = `
                <img src="${municipio.foto}" alt="${municipio.nome}" class="municipio-foto">
                <h3>${municipio.nome}</h3>
                <div class="municipio-info">
                    <p><img src="assets/populacao.png" alt="População" class="info-icon"><strong>População:</strong> ${municipio.populacao_2022.toLocaleString('pt-BR')}</p>
                    <p><img src="assets/area.png" alt="Área" class="info-icon"><strong>Área:</strong> ${municipio.area_km2} km²</p>
                    <p><img src="assets/territorio.png" alt="Território" class="info-icon"><strong>UF:</strong> ${municipio.uf}</p>
                </div>
                <p class="municipio-sobre">${municipio.sobre}</p>
                <a href="${municipio.maps}" target="_blank" class="btn-maps">Ver no Maps</a>
            `;
            
            container.appendChild(card);
        });
        
        iniciarCarrossel();
    } catch (error) {
        console.error('Erro ao carregar dados dos municípios:', error);
    }
}

// Controla o carrossel
function iniciarCarrossel() {
    const track = document.getElementById('carrossel-municipios');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const cards = track.querySelectorAll('.municipio-card');
    
    let currentIndex = 0;
    const cardWidth = 320;
    const totalCards = cards.length;
    
    function updateCarrossel() {
        const translateX = -currentIndex * cardWidth;
        track.style.transform = `translateX(${translateX}px)`;
    }
    
    btnPrev.addEventListener('click', () => {
        currentIndex = currentIndex === 0 ? totalCards - 1 : currentIndex - 1;
        updateCarrossel();
    });
    
    btnNext.addEventListener('click', () => {
        currentIndex = currentIndex === totalCards - 1 ? 0 : currentIndex + 1;
        updateCarrossel();
    });
    
    updateCarrossel();
}

// Carrega os municípios quando a página for carregada
document.addEventListener('DOMContentLoaded', carregarMunicipios);