const form = document.getElementById('cep-form');
const cepInput = document.getElementById('cep-input');
const submitBtn = document.getElementById('submit-btn');
const resultsDiv = document.getElementById('results');
const mapContainer = document.getElementById('map-container');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const cep = cepInput.value.replace(/\D/g, '');
    if (cep.length !== 8) {
        showError('CEP inválido!');
        return;
    }

    submitBtn.disabled = true;
    document.body.style.cursor = 'wait';

    fetch(`https://cep.awesomeapi.com.br/json/${cep}`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                showError('CEP não encontrado!');
                return;
            }

            const { address, district, state, lat, lng, city} = data;

            const allAddress = `
                <p><strong>Endereço:</strong> ${address}</p>
                <p><strong>Bairro:</strong> ${district}</p>
                <p><strong>Cidade:</strong> ${city}</p>
                <p><strong>Estado:</strong> ${state}</p>
                <p><strong>CEP:</strong> ${cep}</p>
                <button id="show-map-btn" onclick="showMap(${lat}, ${lng})">Exibir mapa</button>
            `;
            resultsDiv.innerHTML = allAddress;
        })
        .catch(error => {
            showError('Erro ao consultar CEP!');
            console.error('Erro:', error);
        })
        .finally(() => {
            submitBtn.disabled = false;
            document.body.style.cursor = 'default';
        });
});

function showError(message) {
    resultsDiv.innerHTML = `<p>${message}</p>`;
    mapContainer.style.display = 'none';
}

function showMap(latitude, longitude) {
    const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=pt&z=14&output=embed`;
    const mapFrame = `
        <iframe
            id="map"
            width="100%"
            height="400"
            frameborder="0"
            style="border:0"
            src="${mapUrl}"
            allowfullscreen
        ></iframe>
    `;
    mapContainer.innerHTML = mapFrame;
    mapContainer.style.display = 'block';
}