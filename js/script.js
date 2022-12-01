'use strict'

var mySlider = new rSlider({
  target: '#sampleSlider',
  values: {min: 300000,max:3100000},
  range: true,
  tooltip: true,
  scale: true,
  labels: false,
  step: 10000,
  onChange: function(values){
    console.log(mySlider.getValue());
  }
});

let priceValues = mySlider.getValue();

console.log(priceValues)

const URL = 'https://morfey216.github.io/online-store-bd/bd.json';
const DEFAULT_CATEGORY = 'popular';
const currentDate = new Date();


let currentData = [];

async function getResponse() {
  async function onError() {
    console.log('Ошибка HTTP: ' + response.status)
  }
  const response = await fetch(URL);
  if (response.ok) {
    const content = await response.json();
    currentData = content.products;
    currentData.map((itData) => {
      itData.publishDate = new Date(Number(itData['publish-date']));
    });
    renderCards(currentData);
    popUpDataRender(currentData);
  } else {
    onError();
  }
}

getResponse();

function getPhotos() {
  const photosArray = [];

  for (let i = 0; i < currentData.photos.length; i++) {
    photosArray.push(currentData.photos)
  }
  return photosArray;
};

function renderMarkup(target, markup) {
  target.innerHTML = " ",
    target.insertAdjacentHTML('afterbegin', markup);
};

const cardsList = document.querySelector('.results__list');

function renderCards(currentCardsData = currentData) {
  const cards = currentCardsData.map(function (cardData, index) {
    return `<li class="results__item product" data-index="${index}">
    <button class="product__favourite fav-add" type="button" aria-label="Добавить в избранное">
      <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 7C3 13 10 16.5 11 17C12 16.5 19 13 19 7C19 4.79086 17.2091 3 15 3C12 3 11 5 11 5C11 5 10 3 7 3C4.79086 3 3 4.79086 3 7Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
      </svg>
    </button>
    <div class="product__image">
      <div class="product__image-more-photo hidden">+2 фото</div>
      <img src="${cardData.photos[0]}" width="318" height="220" alt="Загородный дом с видом на озеро">
    </div>
    <div class="product__content">
      <h3 class="product__title">
        <a href="#">${cardData.name}</a>
      </h3>
      <div class="product__price"> ${cardData.price}₽</div>
      <div class="product__address">${cardData.address.city}</div>
      <div class="product__date">${cardData.publishDate}</div>
    </div>
  </li>`
  }).join('');

  renderMarkup(cardsList, cards);
};

function makeUpDate(date) {
  if (date.getDate() == currentDate.getDate() && date.getFullYear() == currentDate.getFullYear() && date.getMonth() == currentDate.getMonth()) {
    return 'Сегодня';
  } else if (date.getDate() - 1 == currentDate.getDate() && date.getFullYear() == currentDate.getFullYear() && date.getMonth() == currentDate.getMonth()) {
    return 'Вчера';
  }
  return date.getDate() + '.0' + (date.getMonth() + 1) + '.' + date.getFullYear();
};

const cardTitle = document.querySelector('.results__list');
const popUpMenu = document.querySelector('.popup');
const closePopUpMenu = document.querySelector('.popup__close');
const popUpChars = document.querySelector('.popup__chars');


function popUpDataRender() {
  const popUpDate = document.querySelector('.popup__date');
  const popUpTitle = document.querySelector('.popup__title');
  const popUpPrice = document.querySelector('.popup__price');
  const popUpBlock = document.querySelector('.popup');
  const popUpSellerName = popUpBlock.querySelector('.seller__name');
  const popUpSellerRating = popUpBlock.querySelector('.seller__rating span');
  const popUpDescription = popUpBlock.querySelector('.popup__description p');
  const popUpAddress = popUpBlock.querySelector('.popup__address');
  const popUpGallery = popUpBlock.querySelector('.popup__gallery');
  const popUpGalleryList = popUpGallery.querySelector('.gallery__list');

  function onTitlePopUpClick(evt) {
    evt.preventDefault();

    const currentCard = evt.target.closest('li');
    const currentImg = evt.target.closest('img');
    const currentLink = evt.target.closest('a');

    if (currentImg || currentLink) {
      popUpMenu.style.display = 'block';

      const cardData = currentData[currentCard.dataset.index];
      popUpTitle.textContent = cardData.name;
      popUpPrice.textContent = cardData.price + '₽';
      // popUpDate.textContent = makeUpDate(cardData.publishdate);
      popUpSellerName.textContent = cardData.seller.fullname;
      popUpSellerRating.textContent = cardData.seller.rating;
      popUpDescription.textContent = cardData.description;
      popUpAddress.textContent = cardData.address.city + ', ' + cardData.address.street + ', ' + cardData.address.building;

      function popUpCharsItemsData() {
        const mark = `
          <div class="gallery__main-pic">
                  <img src="${cardData.photos[0]}" width="520" height="340" alt="Загородный дом">
                </div>
                <ul class="gallery__list">
                  <li class="gallery__item gallery__item--active">
                    <img src="${cardData.photos[0]}" width="124" height="80" alt="Загородный дом">
                  </li>
                  <li class="gallery__item">
                    <img src="${cardData.photos[1]}" width="124" height="80" alt="Загородный дом">
                  </li>
                  <li class="gallery__item">
                    <img src="${cardData.photos[2]}" width="124" height="80" alt="Загородный дом">
                  </li>
                  <li class="gallery__item">
                    <img src="${cardData.photos[3]}" width="124" height="80" alt="Загородный дом">
                  </li>
          <ul class="popup__chars chars">
          <li class="chars__item">
            <div class="chars__name">Площадь</div>
            <div class="chars__value">${cardData.filters.area}</div>
          </li>
          <li class="chars__item">
            <div class="chars__name">Количество комнат</div>
            <div class="chars__value">${cardData.filters['rooms-count']}</div>
          </li>
          <li class="chars__item">
            <div class="chars__name">Тип недвижимости</div>
            <div class="chars__value">${cardData.filters.type}</div>
          </li>
        </ul>`
        renderMarkup(popUpGallery);
        renderMarkup(popUpChars, mark);
      };
      popUpCharsItemsData();
    }
  };
  cardTitle.addEventListener('click', onTitlePopUpClick);
};

function onPopUpCloseClick() {
  popUpMenu.style.display = 'none';
};

closePopUpMenu.addEventListener('click', onPopUpCloseClick);

function escClosePopUp() {
  document.addEventListener('keydown', function (evt) {
    if (evt.key === 'Escape') {
      onPopUpCloseClick()
    } else if (evt.key === 'Enter') {
      onPopUpCloseClick()
    }
  });
};
escClosePopUp();

const sortList = document.querySelector('.sorting__order-list');
const sortPopularButton = document.querySelector('#sort-popular');
const sortCheapButton = document.querySelector('#sort-cheap');
const sortNewButton = document.querySelector('#sort-new');

function getSortedCheap() {
  return currentData.sort(function (minPrice, maxPrice) {
    if (minPrice['price'] < maxPrice['price']) return -1;
  })
};

function getSortedRaiting() {
  return currentData.sort(function (minRaiting, maxRaiting) {
    if (minRaiting.seller.rating < maxRaiting.seller.rating) return -1;
  })
};

function getSortedTime() {
  return currentData.sort(function (minTime, maxTime) {
    if (minTime['publish-date'] < maxTime['publish-date']) return -1;
  })
};

function onSortingListClick(evt) {
  evt.preventDefault();

  const button = evt.target.closest('li');

  if (button.dataset.cheap) {
    const currentCheap = getSortedCheap();
    renderCards(currentCheap);
    sortCheapButton.checked = true;
    sortNewButton.checked = false;
    sortPopularButton.checked = false;
  };
  if (button.dataset.popular) {
    const currentRaiting = getSortedRaiting();
    renderCards(currentRaiting);
    sortCheapButton.checked = false;
    sortNewButton.checked = false;
    sortPopularButton.checked = true;
  };
  if (button.dataset.newt) {
    const currentTime = getSortedTime();
    renderCards(currentTime);
    sortCheapButton.checked = false;
    sortNewButton.checked = true;
    sortPopularButton.checked = false;
  }
};

sortList.addEventListener('click', onSortingListClick);

const filterInputsList = document.querySelector('.filter__checkboxes-list');
const houseButton = filterInputsList.querySelector('#house');
const flatButton = filterInputsList.querySelector('#flat');
const apartmentsButton = filterInputsList.querySelector('#apartments');

function filtersBarClickHandler(evt) {
  evt.preventDefault();

  const button = evt.target.closest('li');

  if (button.dataset.type === 'house') {
    houseButton.checked = true; 
    flatButton.checked = false;
    apartmentsButton.checked = false;
  };
  if(button.dataset.type === 'flat'){
    houseButton.checked = false; 
    flatButton.checked = true;
    apartmentsButton.checked = false;
  };
  if(button.dataset.type === 'apartments'){
    houseButton.checked = false; 
    flatButton.checked = false;
    apartmentsButton.checked = true;
  }

};
filterInputsList.addEventListener('click', filtersBarClickHandler);
