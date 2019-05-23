import { LightningElement, wire,track} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getAccounts  from '@salesforce/apex/AccountController.getAccounts';

export default class AccountList extends NavigationMixin(LightningElement) {
    @track error;
    @track accounts ;
    @track labelsMap = [];
    @track shownPageRecordsList;
    @track showSpinner = false;

    @track currentPageNumber = 1;
    @track totalRecordNumber;
    recordPerPage = 3;
    @track arrowDirection = 'arrowup';
    @track selectedColumn = 'name';
    @track isAsc = false;


    connectedCallback(){
        this.showSpinner = true;
    }

    /** Wired Apex result so it can be refreshed programmatically */
    wiredAccountResult;

    @wire(getAccounts)
    wiredAccounts({data, error}) {
        this.wiredAccountResult = data;

        if (data) {
            this.accounts = data.accounts;
            this.totalRecordNumber = data.accounts.length;
            this.labelsMap = data.labelsMap;
            this.showRecordsForPage();
            this.error = undefined;
            this.showSpinner = false;
        } else if (error) {
            this.error = error;
            this.accounts = undefined;
        }
    }

    showRecordsForPage() {
        let allRecordsList = this.accounts;
        if(allRecordsList !== undefined){

            let recordsPerPage = this.recordPerPage;

            let shownPageRecordsList = [];
            let leftBracket = (this.currentPageNumber - 1) * recordsPerPage;
            let rightBracket = leftBracket + recordsPerPage;
            if (rightBracket > allRecordsList.length) rightBracket = allRecordsList.length;

            for (let i = leftBracket; i < rightBracket; i++) {
                shownPageRecordsList.push(allRecordsList[i]);
            }
            this.shownPageRecordsList = shownPageRecordsList;
        }

    }

    handlePageControlClick(event){
        this.currentPageNumber = event.detail.pageNumber;
        this.showRecordsForPage();
    }

    get ifShowPagination(){
        return this.totalRecordNumber > this.recordPerPage;
    }

    goToAccountRecord(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.currentTarget.dataset.accountId,  //currentTarget if it's a link or target for the button
                objectApiName: 'Account',
                actionName: 'view'
            }
        });
    }

    
}