const TMDB_API_KEY = 'e3be2e8014650e64639df1fddba946fb';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3/';

async function fetchTMDB(endpoint, params = {}) {
	const url = new URL(TMDB_BASE_URL + endpoint);
	url.searchParams.append('api_key', TMDB_API_KEY);
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.append(key, value);
	}
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error('Network response was not ok');
		return await response.json();
	} catch (error) {
		console.error('TMDB fetch error:', error);
		return null;
	}
}


async function renderTrendingMovies() {
	const grid = document.querySelector('.movie-grid');
	if (!grid) return;
	grid.innerHTML = '<p>Loading...</p>';
	const data = await fetchTMDB('trending/movie/day');
	if (!data || !data.results) {
		grid.innerHTML = '<p>Failed to load movies.</p>';
		return;
	}
	grid.innerHTML = '';
	data.results.slice(0, 8).forEach(movie => {
		const posterUrl = movie.poster_path
			? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
			: '';
		const card = document.createElement('article');
		card.className = 'card';
		card.innerHTML = `
			<div class="poster">
				<div class="poster-inner">
					${posterUrl ? `<img src="${posterUrl}" alt="${movie.title}"/>` : 'No Image'}
				</div>
			</div>
			<h3 class="movie-title">${movie.title || movie.name}</h3>
		`;
		grid.appendChild(card);
	});
}

window.addEventListener('DOMContentLoaded', renderTrendingMovies);

async function renderTrendingTVShows() {
	const grid = document.querySelector('.tv-grid');
	if (!grid) return;
	grid.innerHTML = '<p>Loading...</p>';
	const data = await fetchTMDB('trending/tv/day');
	if (!data || !data.results) {
		grid.innerHTML = '<p>Failed to load TV shows.</p>';
		return;
	}
	grid.innerHTML = '';
	data.results.slice(0, 8).forEach(show => {
		const posterUrl = show.poster_path
			? `https://image.tmdb.org/t/p/w300${show.poster_path}`
			: '';
		const card = document.createElement('article');
		card.className = 'card';
		card.innerHTML = `
			<div class="poster">
				<div class="poster-inner">
					${posterUrl ? `<img src="${posterUrl}" alt="${show.name}"/>` : 'No Image'}
				</div>
			</div>
			<h3 class="movie-title">${show.name}</h3>
		`;
		grid.appendChild(card);
	});
}

window.addEventListener('DOMContentLoaded', renderTrendingTVShows);

async function searchMoviesAndTV(query) {
    const movieGrid = document.querySelector('.movie-grid');
    const tvGrid = document.querySelector('.tv-grid');
    if (movieGrid) movieGrid.innerHTML = '<p>Searching movies...</p>';
    if (tvGrid) tvGrid.innerHTML = '<p>Searching TV shows...</p>';

    const movieData = await fetchTMDB('search/movie', { query });
    if (movieGrid) {
        if (!movieData || !movieData.results || movieData.results.length === 0) {
            movieGrid.innerHTML = '<p>No movies found.</p>';
        } else {
            movieGrid.innerHTML = '';
            movieData.results.forEach(movie => {
                const posterUrl = movie.poster_path
                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                    : '';
                const card = document.createElement('article');
                card.className = 'card';
                card.innerHTML = `
                    <div class="poster">
                        <div class="poster-inner">
                            ${posterUrl ? `<img src="${posterUrl}" alt="${movie.title}"/>` : 'No Image'}
                        </div>
                    </div>
                    <h3 class="movie-title">${movie.title || movie.name}</h3>
                `;
                movieGrid.appendChild(card);
            });
        }
    }

    const tvData = await fetchTMDB('search/tv', { query });
    if (tvGrid) {
        if (!tvData || !tvData.results || tvData.results.length === 0) {
            tvGrid.innerHTML = '<p>No TV shows found.</p>';
        } else {
            tvGrid.innerHTML = '';
            tvData.results.forEach(show => {
                const posterUrl = show.poster_path
                    ? `https://image.tmdb.org/t/p/w300${show.poster_path}`
                    : '';
                const card = document.createElement('article');
                card.className = 'card';
                card.innerHTML = `
                    <div class="poster">
                        <div class="poster-inner">
                            ${posterUrl ? `<img src="${posterUrl}" alt="${show.name}"/>` : 'No Image'}
                        </div>
                    </div>
                    <h3 class="movie-title">${show.name}</h3>
                `;
                tvGrid.appendChild(card);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.search-wrap');
    const searchInput = document.querySelector('.search');
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                searchMoviesAndTV(query);
            } else {
                renderTrendingMovies();
                renderTrendingTVShows();
            }
        });
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    searchMoviesAndTV(query);
                } else {
                    renderTrendingMovies();
                    renderTrendingTVShows();
                }
            }
        });
    }
});


