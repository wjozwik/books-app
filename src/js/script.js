/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      books: '#template-book',
    },
    wrapper: {
      booksList: '.books-list',
      filtersWrap: '.filters',
    },

  };

  const classNames = {
    favorite: 'favorite',
    bookImage: 'book__image',
  };



  const templates = {
    books: Handlebars.compile(document.querySelector(select.templateOf.books).innerHTML),
  };

  const render = function(){
    for (let book of dataSource.books){
      book.ratingBgc = determineRatingBgc(book.rating);
      book.ratingWidth= book.rating * 10;
      const generatedHTML = templates.books(book);
      const domElement = utils.createDOMFromHTML(generatedHTML);
      const booksContainer = document.querySelector(select.wrapper.booksList);
      booksContainer.appendChild(domElement);
    }
  };

  const determineRatingBgc = function(rating){
    let background;

    if(rating < 6){
      background = 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
    } else if(rating <= 8){
      background = 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)';
    } else if(rating <= 9){
      background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
    } else if(rating > 9){
      background = 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)';
    }
    return background;
  };
  
  const favoriteBooks = [];
  const filters = [];

  const filterBooks = function(){
    
    for (const book of dataSource.books){
      let shouldBeHidden = false;

      for(const filter of filters) {
               
        if(!book.details[filter]) {
          shouldBeHidden = true;
          break;
        }
      }

      const bookImages = document.querySelectorAll('.book__image');

      if(shouldBeHidden === true){
        
        for(let image of bookImages){
          if(book.id == image.getAttribute('data-id')){
            image.classList.add('hidden');
          }
        } 

      } else {
        for(let image of bookImages){
          if(book.id == image.getAttribute('data-id')){
            image.classList.remove('hidden');
          }
        } 
      }

    }

  };
  
  const initActions = function(){
    const booksList = document.querySelector(select.wrapper.booksList);
    // console.log('booksList', booksList);
      
    booksList.addEventListener('dblclick', function(event){
      event.preventDefault();

      const bookId = Number(event.target.offsetParent.getAttribute('data-id'));
      // console.log('bookId', bookId);

      const bookArrIndex = favoriteBooks.indexOf(bookId);
      // console.log('bookArrIndex', bookArrIndex);

      
      if(event.target.offsetParent.classList.contains(classNames.bookImage)){
        // console.log('event.target', event.target);
        // console.log('event.target.offsetParent', event.target.offsetParent);
        // console.log('classList.contains', event.target.offsetParent.classList.contains(classNames.bookImage));

        if(bookArrIndex == -1 ){          
          event.target.offsetParent.classList.add(classNames.favorite);
          favoriteBooks.push(bookId);
          // console.log('---add---');
  
        } else {
          event.target.offsetParent.classList.remove(classNames.favorite);
          favoriteBooks.splice(bookArrIndex, 1);
          // console.log('---remove---');
        }
      }

      // console.log('------favoriteBooks------', favoriteBooks);
    });

    const filtersWrapper = document.querySelector(select.wrapper.filtersWrap);

    filtersWrapper.addEventListener('click', function(event){
      
      if(event.target.tagName === 'INPUT' &&
      event.target.type === 'checkbox' &&
      event.target.name === 'filter'
      ){ 
        if(event.target.checked){
          filters.push(event.target.value);
        } else {
          const valueIndex = filters.indexOf(event.target.value);
          filters.splice(valueIndex, 1);
        }

        // console.log(event.target.value);
        console.log('filters', filters);
        filterBooks();
      }
      
    });
  };



  render();
  initActions();

}