/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      books: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
    },
    book: {
      images: '.book__image',
    }
  };

  const classNames = {
    favorite: 'favorite',
  };



  const templates = {
    books: Handlebars.compile(document.querySelector(select.templateOf.books).innerHTML),
  };

  const render = function(){
    for (let book of dataSource.books){
      const generatedHTML = templates.books(book);
      const domElement = utils.createDOMFromHTML(generatedHTML);
      const booksContainer = document.querySelector(select.containerOf.booksList);
      booksContainer.appendChild(domElement);
    }
  };

  
  const favoriteBooks = [];

  const initActions = function(){
    const allBooks = document.querySelectorAll(select.book.images);

    for (let book of allBooks){
      const bookId = Number(book.getAttribute('data-id'));
      
      book.addEventListener('dblclick', function(event){
        event.preventDefault();
        const bookArrIndex = favoriteBooks.indexOf(bookId);
        if(bookArrIndex == -1 ){          
          book.classList.add(classNames.favorite);
          favoriteBooks.push(bookId);

        } else {
          book.classList.remove(classNames.favorite);
          favoriteBooks.splice(bookArrIndex, 1);
        }
      });

    }

  };



  render();
  initActions();

}