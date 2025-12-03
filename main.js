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
					${posterUrl ? `<img src="${posterUrl}" alt="${movie.title}" style="width:100%;height:auto;max-height:120px;object-fit:cover;" />` : 'No Image'}
				</div>
			</div>
			<h3 class="movie-title">${movie.title || movie.name}</h3>
			<p class="movie-details">${movie.release_date || ''}<br>${movie.overview || ''}</p>
		`;
		grid.appendChild(card);
	});
}

window.addEventListener('DOMContentLoaded', renderTrendingMovies);


