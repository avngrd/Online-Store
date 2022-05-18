'use strict'

var mySlider = new rSlider({
  target: '#sampleSlider',
  values: [10000, 1000000],
  range: true,
  tooltip: true,
  scale: true,
  labels: false,
  step: 10000
});

const CARDS_NUMBER = 7;

const MIN_PRICE = 250000;
const MAX_PRICE = 2000000;

const MIN_RATING = 0;
const MAX_RAITING = 5;

const MIN_BUILDING = 1;
const MAX_BUILDING = 40;

const MIN_AREA = 30;
const MAX_AREA = 250;

const MIN_ROOMS_COUNT = 1;
const MAX_ROOMS_COUNT = 7;

const CATEGORY = 'Недвижимость';

const NAME = [
  'Двушка в центре Питера',
  'Однушка в спальнике Питера',
  'Трешка рядом с Кремлём',
  'Студия для аскетов',
  'Аппартаменты',
];

const DESCRIPTION = [
  'Студия с лаконичным дизайном возле Ангары',
  'Трехкомнатная квартира для большой семьи рядом с Крёмлем',
  '2 минуты до набережной и прекрасного вида на Волгу',
  'В квартире есть сауна, джакузи и домашний кинотеатр',
  'Уютная однушка в тихом спальном районе. Рядом лес и озёра',
];

const FULL_NAMES = [
  'Бюро Семёна',
  'Виталий Петрович',
  'Марья Андреевна',
  'Вадим Лазук'
];

const currentDate = new Date();

const PHOTOS = [
  'img/house_1.png',
  'img/house_2.png',
  'img/house_3.png',
  'img/house_4.png',
  'img/apt_1.png',
  'img/apt_2.png',
  'img/apt_3.png',
  'img/apt_4.png',
  'img/apt_5.png',
  'img/apt_6.png'
];

const СITIES = [
  'Минск',
  'Иркутск',
  'Москва',
  'Красноярск'
];

const STREETS = [
  'ул. Шахтёров',
  'ул. Полярная',
  'ул. Лиственная',
  'ул. Мира',
  'ул. Советская'
];

const TYPES = [
  'house',
  'apartament',
  'flat'
];

function randomPhotosCount(photo) {
  const photosArray = [];

  for (let i = 0; i < photo; i++) {
    photosArray.push(PHOTOS[getRandomNumber(PHOTOS)])
  }
  return photosArray
};

const getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

function nameRender() {
  const object = {
    name: NAME[getRandomNumber(0, NAME.length)],
    description: DESCRIPTION[getRandomNumber(0, DESCRIPTION.length)],
    price: getRandomNumber(MIN_PRICE, MAX_PRICE / 100) * 100,
    category: 'Недвижимость',
    seller: {
      fullname: FULL_NAMES[getRandomNumber(0, FULL_NAMES.length)],
      raiting: getRandomNumber(MIN_RATING, MAX_RAITING * 10) / 10,
    },
    publishdate: new Date(currentDate.getFullYear(), getRandomNumber(0, currentDate.getMonth()), getRandomNumber(1, currentDate.getDate())),
    address: {
      city: СITIES[getRandomNumber(0, СITIES.length)],
      street: STREETS[getRandomNumber(0, STREETS.length)],
      building: 'Д.' + getRandomNumber(MIN_BUILDING, MAX_BUILDING),
    },
    photos: PHOTOS[getRandomNumber(0, PHOTOS.length)],
    filters: {
      type: TYPES[getRandomNumber(0, TYPES.length)],
      area: getRandomNumber(MIN_AREA, MAX_AREA),
      roomscount: getRandomNumber(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT),
    }
  }
  return object
};

const currentData = [];

function createRenderData() {
  for (let i = 0; i < CARDS_NUMBER; i++) {
    currentData.push(nameRender());
  }
}
createRenderData();

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
      <img src="${cardData.photos}" width="318" height="220" alt="Загородный дом с видом на озеро">
    </div>
    <div class="product__content">
      <h3 class="product__title">
        <a href="#">${cardData.name}</a>
      </h3>
      <div class="product__price"> ${cardData.price}₽</div>
      <div class="product__address">${cardData.address.city}</div>
      <div class="product__date">${makeUpDate(cardData.publishdate)}</div>
    </div>
  </li>`
  }).join('');

  renderMarkup(cardsList, cards)
};
renderCards();

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
      popUpDate.textContent = makeUpDate(cardData.publishdate);
      popUpSellerName.textContent = cardData.seller.fullname;
      popUpSellerRating.textContent = cardData.seller.raiting;
      popUpDescription.textContent = cardData.description;
      popUpAddress.textContent = cardData.address.city + ', ' + cardData.address.street + ', ' + cardData.address.building;
      
      function popUpCharsItemsData(){
          const mark =  `<ul class="popup__chars chars">
          <li class="chars__item">
            <div class="chars__name">Площадь</div>
            <div class="chars__value">${cardData.filters.area}</div>
          </li>
          <li class="chars__item">
            <div class="chars__name">Количество комнат</div>
            <div class="chars__value">${cardData.filters.roomscount}</div>
          </li>
          <li class="chars__item">
            <div class="chars__name">Тип недвижимости</div>
            <div class="chars__value">${cardData.filters.type}</div>
          </li>
        </ul>`
        renderMarkup(popUpChars, mark);
      };
      popUpCharsItemsData();
    }
  };
  cardTitle.addEventListener('click', onTitlePopUpClick);
};

popUpDataRender();

function onPopUpCloseClick() {
  popUpMenu.style.display = 'none';
};

closePopUpMenu.addEventListener('click', onPopUpCloseClick);

function escClosePopUp (){
  document.addEventListener('keydown', function(evt){
    if(evt.key === 'Escape'){
      onPopUpCloseClick()
    }else if(evt.key ==='Enter'){
      onPopUpCloseClick()
    }
  });
};
escClosePopUp();
