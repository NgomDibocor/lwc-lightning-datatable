import { LightningElement ,wire,track} from 'lwc';
import getAllOpps from '@salesforce/apex/GetAllOpportunities.getAllOpps';

export default class DatatableEx extends LightningElement {
    @track columns = [{
        label: 'Opportunity name',
        fieldName: 'Name',
        type: 'text',
        sortable: true
    },
    {
        label: 'Stage Name',
        fieldName: 'StageName',
        type: 'text',
        sortable: true
    },
    {
        label: 'Close date',
        fieldName: 'CloseDate',
        type: 'date',
        sortable: true
    }

];
@track error;
@track data = [];
@track sortedBy  = 'Name';
@track sortedDirection = 'asc';
@track shownPageRecordsList;
@track currentPageNumber = 1;
@track totalRecordNumber;
recordPerPage = 2;

@wire(getAllOpps)
wiredOpps({error,data}) {
    if (data) {
        this.data = data;
        this.totalRecordNumber = data.length;
        this.showRecordsForPage();
    } else if (error) {
        this.error = error;
    }
}

showRecordsForPage() {
    let allRecordsList = this.data;
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

sortData(fieldName, sortDirection){
    var data = this.data;
    //function to return the value stored in the field
    var key =(a) => a[fieldName]; 
    var reverse = sortDirection === 'asc' ? 1: -1;
    data.sort((a,b) => {
        let valueA = key(a) ? key(a).toLowerCase() : '';
        let valueB = key(b) ? key(b).toLowerCase() : '';
        return reverse * ((valueA > valueB) - (valueB > valueA));
    });
    
    //set sorted data to accountData attribute
    this.data = data;
    this.showRecordsForPage();
}

updateColumnSorting(event){
    this.sortedBy = event.detail.fieldName;
    this.sortedDirection = event.detail.sortDirection;
    this.sortData(this.sortedBy,this.sortedDirection);
    
}

handlePageControlClick(event){
    this.currentPageNumber = event.detail.pageNumber;
    this.showRecordsForPage();
}

get ifShowPagination(){
    return this.totalRecordNumber > this.recordPerPage;
}

}