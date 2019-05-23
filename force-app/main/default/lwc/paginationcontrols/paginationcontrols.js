/**
 * Created by dibocor on 16/05/2019.
 */

import {LightningElement, track, api} from 'lwc';

export default class Paginationcontrols extends LightningElement {
    @api currentPageNumber;
    @api totalRecordNumber;
    @api recordPerPage;
    @api textPosition;
    @track totalPageNumber;
    @track firstLabel = '|<';
    @track previousLabel = '<';
    @track nextLabel = '>';
    @track lastLabel = '>|';
    @track resultsLabel = 'Results';
    @track buttonList ;
    @track showTotalRecordNumberWarning = false;

    generateButtonList() {
        let buttonList = [];
        let startPageNumber = this.currentPageNumber < 3 ? 1 : this.currentPageNumber - 2;
        let endPageNumber = this.currentPageNumber > this.totalPageNumber - 3 ? this.totalPageNumber : this.currentPageNumber + 2;
        for (let i = startPageNumber; i <= endPageNumber; i++) {
            buttonList.push({
                label: String(i),
                pageNumber: i,
                disabled: false,
                variant : i === this.currentPageNumber ? 'brand' : 'neutral'
            });
        }
        this.buttonList = buttonList;
    }

    // initialize component
    connectedCallback(){
        this.totalPageNumber = Math.ceil(this.totalRecordNumber / this.recordPerPage);
        this.generateButtonList();
    }

    handleButtonClick(event){
        event.preventDefault();

        let currentPageNumber = this.currentPageNumber;
        let totalPageNumber = this.totalPageNumber;
        let buttonName = event.target.name;
        let pageNumber =
            buttonName === "first" ? 1 :
            buttonName === "previous" ? currentPageNumber - 1 :
            buttonName === "next" ? currentPageNumber + 1 :
            buttonName === "last" ? totalPageNumber : parseInt(buttonName, 10);
        if(pageNumber !== currentPageNumber) {
            this.currentPageNumber = pageNumber;
            this.generateButtonList();
            const paginationControlClickEvent = new CustomEvent('paginationclick', {
                detail: {pageNumber : pageNumber}
            });
            this.dispatchEvent(paginationControlClickEvent);
        }
    }

    get hasRecords(){
        return this.totalPageNumber > 0;
    }

    get onLastPage(){
        return this.currentPageNumber === this.totalPageNumber;
    }

    get onFirstPage(){
        return this.currentPageNumber === 1;
    }

    get isTextAboveTheButtons(){
        return this.textPosition === 'top';
    }

    get isTextBelowTheButtons(){
        return this.textPosition === 'bottom';
    }

    get showTheThreePointsLeft(){
        return this.currentPageNumber > 3;
    }

    get showTheThreePointsRight(){
        let totalPageNumber = this.totalPageNumber -2;
        return  totalPageNumber > this.currentPageNumber;
    }

    get showTextPagination(){
        return `${this.totalRecordNumber} ${this.resultsLabel} - ${this.currentPageNumber} / ${this.totalPageNumber} pages`;
    }

}