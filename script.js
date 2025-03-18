const API_KEY = '481d61e01ba10c7f638c865016c964f8';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const searchInput = document.getElementById('search');
const content = document.getElementById('content');

// Fetch popular movies and series initially
getMovies(`${BASE_URL}/trending/all/day?api_key=${API_KEY}`);

searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value;
        if (query) {
            getMovies(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        }
    }
});

function getMovies(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            displayMovies(data.results);
        })
        .catch(err => console.error(err));
}

function displayMovies(items) {
    content.innerHTML = '';
    items.forEach(item => {
        if (item.media_type === 'person') return; // Skip persons

        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${item.poster_path ? IMG_URL + item.poster_path : ''}" alt="${item.title || item.name}">
            <h3>${item.title || item.name}</h3>
        `;

        card.addEventListener('click', () => {
            playContent(item);
        });

        content.appendChild(card);
    });
}

function playContent(item) {
    content.innerHTML = '';

    const backBtn = document.createElement('div');
    backBtn.classList.add('back-btn');
    backBtn.textContent = '← Back';
    backBtn.addEventListener('click', () => {
        getMovies(`${BASE_URL}/trending/all/day?api_key=${API_KEY}`);
    });

    const iframe = document.createElement('iframe');

    if (item.media_type === 'movie') {
        iframe.src = `https://embed.su/embed/movie/${item.id}`;
    } else if (item.media_type === 'tv') {
        iframe.src = `https://embed.su/embed/tv/${item.id}/1/1`;
    }

    content.appendChild(backBtn);
    content.appendChild(iframe);
}