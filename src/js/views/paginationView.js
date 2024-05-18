import View from "./View.js";
import icons from 'url:../../img/icons.svg'; // Parcel 2

class PaginationView extends View {
    _parentElement = document.querySelector(".pagination");

    _generateMarkup() {
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

        if (curPage === 1 && numPages > 1) {
            return this._generateMarkupButton(curPage, 'next');
        }

        if(curPage === numPages && numPages > 1){
            return this._generateMarkupButton(curPage, 'prev');
        }

        if(curPage < numPages){
            return this._generateMarkupButton(curPage, 'prev') + this._generateMarkupButton(curPage, 'next');
        }

        if(numPages === 1){
            return '';
        }

    }

    _generateMarkupButton(page, type) {
        return `
        <button class="btn--inline pagination__btn--${type === 'prev' ? 'prev' : 'next'}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
            <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
        </button>
        `;
    }

    addHandlerClick(handler){
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;

            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        });
    }



}

export default new PaginationView();