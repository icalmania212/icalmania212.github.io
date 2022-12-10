/*
 * This script part of Adsense AGC Movie 3.0
 * Demo: https://theflix.us
 * Copyright (c) 2020 Yan <yanhooligan.com>
 *
 * Free copy without remove author credits.
 */
const LP = 'https://percuanan.xyz';
const KEY = '3ed72f657ce5c5779383b2191d6d0111';
const TMDB = 'https://api.themoviedb.org/3';
const RESULTS = TMDB + '/discover/movie?sort_by=popularity.desc&api_key=' + KEY;
const POSTER = 'https://image.tmdb.org/t/p/w300';
const SEARCH = TMDB + '/search/movie?api_key=' + KEY;
const GENRES = [
  {
		"id": 28,
		"name": "Action"
	},
	{
		"id": 12,
		"name": "Adventure"
	},
	{
		"id": 16,
		"name": "Animation"
	},
	{
		"id": 35,
		"name": "Comedy"
	},
	{
		"id": 80,
		"name": "Crime"
	},
	{
		"id": 99,
		"name": "Documentary"
	},
	{
		"id": 18,
		"name": "Drama"
	},
	{
		"id": 10751,
		"name": "Family"
	},
	{
		"id": 14,
		"name": "Fantasy"
	},
	{
		"id": 36,
		"name": "History"
	},
	{
		"id": 27,
		"name": "Horror"
	},
	{
		"id": 10402,
		"name": "Music"
	},
	{
		"id": 9648,
		"name": "Mystery"
	},
	{
		"id": 10749,
		"name": "Romance"
	},
	{
		"id": 878,
		"name": "Science Fiction"
	},
	{
		"id": 10770,
		"name": "TV Movie"
	},
	{
		"id": 53,
		"name": "Thriller"
	},
	{
		"id": 10752,
		"name": "War"
	},
	{
		"id": 37,
		"name": "Western"
	}
]

const main = document.getElementById('root');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('genre');

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;

var selectedGenre = []
setGenre();

function setGenre() {
	tagsEl.innerHTML = '';
	GENRES.forEach(genre => {
		const t = document.createElement('div');
		t.classList.add('genre');
		t.id = genre.id;
		t.innerText = genre.name;
		t.addEventListener('click', () => {
			if (selectedGenre.length == 0) {
				selectedGenre.push(genre.id);
			} else {
				if (selectedGenre.includes(genre.id)) {
					selectedGenre.forEach((id, idx) => {
						if (id == genre.id) {
							selectedGenre.splice(idx, 1);
						}
					})
				} else {
					selectedGenre.push(genre.id);
				}
			}
			getMovies(RESULTS + '&with_genres=' + encodeURI(selectedGenre.join(',')))
			highlightSelection()
		})
		tagsEl.append(t);
	})
}

function highlightSelection() {
	const tags = document.querySelectorAll('.genre');
	tags.forEach(tag => {
		tag.classList.remove('highlight')
	})
	clearBtn()
	if (selectedGenre.length != 0) {
		selectedGenre.forEach(id => {
			const hightlightedTag = document.getElementById(id);
			hightlightedTag.classList.add('highlight');
		})
	}

}

function clearBtn() {
	let clearBtn = document.getElementById('clear');
	if (clearBtn) {
		clearBtn.classList.add('highlight')
	} else {

		let clear = document.createElement('div');
		clear.classList.add('genre', 'clear', 'highlight');
		clear.id = 'clear';
		clear.innerText = 'Clear x';
		clear.addEventListener('click', () => {
			selectedGenre = [];
			setGenre();
			getMovies(RESULTS);
		})
		tagsEl.append(clear);
	}

}

getMovies(RESULTS);

function getMovies(url) {
	lastUrl = url;
	fetch(url).then(res => res.json()).then(data => {
		if (data.results.length !== 0) {
			showMovies(data.results);
			currentPage = data.page;
			nextPage = currentPage + 1;
			prevPage = currentPage - 1;
			totalPages = data.total_pages;
			current.innerText = currentPage;

			if (currentPage <= 1) {
				prev.classList.add('disabled');
				next.classList.remove('disabled')
			} else if (currentPage >= totalPages) {
				prev.classList.remove('disabled');
				next.classList.add('disabled')
			} else {
				prev.classList.remove('disabled');
				next.classList.remove('disabled')
			}

			tagsEl.scrollIntoView({
				behavior: 'smooth'
			})
		} else {
			main.innerHTML = `<h1 class="no-results">No Results Found</h1>`
		}
	})

}

function convertToSlug(Title) {
	return Title
		.toLowerCase()
		.replace(/ /g, '-')
		.replace(/[^\w-]+/g, '');
}

function showMovies(data) {
	main.innerHTML = '';
	data.forEach(movie => {
		const {
			title,
      release_date,
			poster_path,
			vote_average,
			overview,
			id
		} = movie;
 var plot = overview;
plot = plot.substring(0,500);
    const release = new Date(release_date);
		const URL = LP + "/movie/" + id + "/" + convertToSlug(title);
		const movieEl = document.createElement('div');
		movieEl.classList.add('movie');
		movieEl.innerHTML = `
            <img src="${poster_path? POSTER+poster_path: "https://via.placeholder.com/300x450&text=Not+found" }" width="300" height="450" alt="${title}">
            <div class="movie-title">
                <h3>${title + " (" + release.getFullYear() + ")"}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${plot}
                <a id="${id}" class="watch-now button" href="${URL}">Watch Now</a>
            </div>
        `
		main.appendChild(movieEl);
		document.getElementById(id).addEventListener('click', () => {
			openNav(movie)
		})
	})
}

function getColor(vote) {
	if (vote >= 8) {
		return 'green'
	} else if (vote >= 5) {
		return "orange"
	} else {
		return 'red'
	}
}

form.addEventListener('submit', (e) => {
	e.preventDefault();
	const searchTerm = search.value;
	selectedGenre = [];
	setGenre();
	if (searchTerm) {
		getMovies(SEARCH + '&query=' + searchTerm)
	} else {
		getMovies(RESULTS);
	}

})

prev.addEventListener('click', () => {
	if (prevPage > 0) {
		pageCall(prevPage);
	}
})

next.addEventListener('click', () => {
	if (nextPage <= totalPages) {
		pageCall(nextPage);
	}
})

function pageCall(page) {
	let urlSplit = lastUrl.split('?');
	let queryParams = urlSplit[1].split('&');
	let key = queryParams[queryParams.length - 1].split('=');
	if (key[0] != 'page') {
		let url = lastUrl + '&page=' + page
		getMovies(url);
	} else {
		key[1] = page.toString();
		let a = key.join('=');
		queryParams[queryParams.length - 1] = a;
		let b = queryParams.join('&');
		let url = urlSplit[0] + '?' + b
		getMovies(url);
	}
}
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js');
}