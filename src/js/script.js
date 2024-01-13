/* global Handlebars, utils, dataSource, app */ // eslint-disable-line no-unused-vars

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

  class BooksList {
    constructor() {
      const thisBookList = this;

      thisBookList.favoriteBooks = [];
      thisBookList.filters = [];
      
      thisBookList.initData();
      thisBookList.getElements();
      thisBookList.render();
      thisBookList.initActions();
    }

    initData() {
      const thisBookList = this;

      thisBookList.data = dataSource.books;
    }

    getElements() {
      const thisBookList = this;

      thisBookList.dom = {};
      thisBookList.dom.bookListWrapper = document.querySelector(select.wrapper.booksList);
      thisBookList.dom.filtersWrapper = document.querySelector(select.wrapper.filtersWrap);
    }

    render() {
      const thisBookList = this;

      for (let book of thisBookList.data){
        book.ratingBgc = thisBookList.determineRatingBgc(book.rating);
        book.ratingWidth= book.rating * 10;

        const generatedHTML = templates.books(book);
        const domElement = utils.createDOMFromHTML(generatedHTML);
        thisBookList.dom.bookListWrapper.appendChild(domElement);
      }
    }
  
    determineRatingBgc(rating) {
      let htmlStyles;
  
      if(rating < 6){
        htmlStyles = 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
      } else if(rating <= 8){
        htmlStyles = 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)';
      } else if(rating <= 9){
        htmlStyles = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if(rating > 9){
        htmlStyles = 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)';
      }
      return htmlStyles;
    }
    
    initActions(){
      const thisBookList = this;
        
      thisBookList.dom.bookListWrapper.addEventListener('dblclick', function(event){
        event.preventDefault();
  
        const bookId = Number(event.target.offsetParent.getAttribute('data-id'));
        // console.log('bookId', bookId);
  
        const bookArrIndex = thisBookList.favoriteBooks.indexOf(bookId);
        // console.log('bookArrIndex', bookArrIndex);
  
        
        if(event.target.offsetParent.classList.contains(classNames.bookImage)){
          // console.log('event.target', event.target);
          // console.log('event.target.offsetParent', event.target.offsetParent);
          // console.log('classList.contains', event.target.offsetParent.classList.contains(classNames.bookImage));
  
          if(bookArrIndex == -1 ){          
            event.target.offsetParent.classList.add(classNames.favorite);
            thisBookList.favoriteBooks.push(bookId);
            // console.log('---add---');
    
          } else {
            event.target.offsetParent.classList.remove(classNames.favorite);
            thisBookList.favoriteBooks.splice(bookArrIndex, 1);
            // console.log('---remove---');
          }
        }
  
        // console.log('------thisBookList.favoriteBooks------', thisBookList.favoriteBooks);
      });
  
      thisBookList.dom.filtersWrapper.addEventListener('click', function(event){
        
        if(event.target.tagName === 'INPUT' &&
        event.target.type === 'checkbox' &&
        event.target.name === 'filter'
        ){ 
          if(event.target.checked){
            thisBookList.filters.push(event.target.value);
          } else {
            const valueIndex = thisBookList.filters.indexOf(event.target.value);
            thisBookList.filters.splice(valueIndex, 1);
          }
  
          // console.log(event.target.value);
          console.log('thisBookList.filters', thisBookList.filters);
          thisBookList.filterBooks();
        }
        
      });
    }

    filterBooks() {
      const thisBookList = this;
      
      for (const book of thisBookList.data){
        let shouldBeHidden = false;
  
        for(const filter of thisBookList.filters) {
                 
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
    }
  }
  
  const app = new BooksList(); // eslint-disable-line no-unused-vars

}