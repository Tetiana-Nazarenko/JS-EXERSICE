import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

const select = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

//*** ***/
const api_key =
  'live_OrsjlPQ3YjfkZQGYgkMjtBJYuyZLDMqEPy2D3Mz8o2Fz0UEnM4L6Vz9mbhPrgOzf';
const url = 'https://api.thecatapi.com/v1';

function fetchBreeds() {
  return fetch(`${url}/breeds?api_key=${api_key}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
function fetchCatByBreed(breedId) {
  return fetch(
    `${url}/images/search?breed_ids=${breedId}?api_key=${api_key}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
//*** */
loader.classList.add('is-hidden');
error.classList.add('is-hidden');

const arr = [];

fetchBreeds()
  .then(data => {
    data.forEach(el => {
      arr.push({ text: el.name, value: el.id });
    });
    new SlimSelect({
      select: select,
      data: arr,
    });
  })
  .catch(err => {
    console.log(err);
  });
select.addEventListener('change', onselectBreed);
function onselectBreed(event) {
  loader.classList.replace('is-hidden', 'loader');
  select.classList.add('is-hidden');
  catInfo.classList.add('is-hidden');

  const breedId = event.currentTarget.value;

  fetchCatByBreed(breedId)
    .then(data => {
      loader.classList.replace('loader', 'is-hidden');
      select.classList.remove('is-hidden');
      const { url, breeds } = data[0];

      //   catInfo.innerHTML = `<div>       <img src="${url}" alt="${breeds[0].name}">
      // <h1 class="name-cat"> ${breeds[0].name}</h1>
      // <p class="description">${breeds[0].description} </p>
      // <p class="temperament"> ${breeds[0].temperament} </p> </div>`;
      catInfo.innerHTML = `<div class="box-img"><img src="${url}" alt="${breeds[0].name}" width="400"/></div><div class="box"><h1>${breeds[0].name}</h1><p>${breeds[0].description}</p><p><b>Temperament:</b> ${breeds[0].temperament}</p></div>`;
      catInfo.classList.remove('is-hidden');
    })
    .catch(onError);
}
function onError(error) {
  select.classList.remove('is-hidden');
  loader.classList.replace('loader', 'is-hidden');
  console.log('Ops! Something went wrong!');
}
