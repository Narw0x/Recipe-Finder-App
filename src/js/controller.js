import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if(module.hot){
//   module.hot.accept();
// }



const recipeContainer = document.querySelector('.recipe');



// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function(){
  try{
    const id = window.location.hash.slice(1);
    if(!id) return;
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());  

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
    bookmarksView.update(model.state.bookmarks);

  }catch(err){

    recipeView.renderError();
  }

}

const controlSearchResults = async function(){
  try{
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if(!query) return;

    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);

  }catch(err){
    console.log(err);
  }
}

const controlPagination = function(goToPage){
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
}

const controlServings = function(newServings){
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
  
}

const controlAddBookmark = function(){
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  
  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try {
    addRecipeView.renderSpinner();


    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    setTimeout(function(){
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);


    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    
    
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
}

const init = function(){
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  bookmarksView.addHandlerRender(controlBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();

