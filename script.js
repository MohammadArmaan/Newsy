'use strict';

const countries = document.querySelector('.countries');
const news = document.querySelector('.input');
const search = document.querySelector('.search');
const form = document.querySelector('.form');
const tryDifferent = document.querySelector('.search-other');
let article;
let html;

////////////////////////////////////////////////
// Time Stamp -> Date

const formatDate = function(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

////////////////////////////////////////////////
// Set Default Image

const loadImage = function(src, fallBackSrc){
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;

    img.onload = ()=> resolve(src);
    img.onerror = ()=> resolve(fallBackSrc);
  })
}


////////////////////////////////////////////////
// Fetching News API

const newsAPI = async function(query){
  try{
    const res = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=f36049b76f894001a74c4ef3538116e5&language=en`);
    const data = await res.json()
    console.log(data);
    const articles = data.articles;

    articles.forEach(async (article) => { 
      if(!article || article.urlToImage === null ) return;
      const imageUrl = await loadImage(article.urlToImage, 'img/default.jpg');

      html = `<article class="news">
      <a href="${article.url}" target="_blank" rel="${article.source}">
      <img class="article__img" src="${imageUrl}" alt="${article.source.name}"/>
      </a>
      <div class="article__data">
      <a href="${article.url}" target="_blank" rel="${article.source}" class="news__link">
        <h3 class="article__title">${article.title}</h3>
      </a>
        <p class="article__row"><span>Description:</span>${article.description}</p>
        <p class="article__row"><span>Source:</span>${article.source.name}</p>
        <p class="article__row"><span>Author:</span>${article.author || 'Unknown Author'}</p>
        <p class="article__row"><span>Published At:</span>${formatDate(article.publishedAt)}</p>
      </div>
    </article>`;
    countries.insertAdjacentHTML('beforeend', html);
    countries.style.opacity = 1;


    });
  }
  catch(err){
    console.log(err);
  }

}

////////////////////////////////////////////////
// Event Handlers

form.addEventListener('submit', function(e){
    e.preventDefault();
    article = news.value;
    console.log(article);
    newsAPI(article);
    form.classList.add('hidden');
    tryDifferent.classList.remove('hidden')


});


tryDifferent.addEventListener('click', function(){
    countries.innerHTML = '';
    countries.style.opacity = 0;
    form.classList.remove('hidden');
    tryDifferent.classList.add('hidden');
})
