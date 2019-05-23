import { LightningElement ,wire,track} from 'lwc';
import getAllOpps from '@salesforce/apex/GetAllOpportunities.getAllOpps';

export default class OpportunityList extends LightningElement {
    @track columns = [
        {
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
    @track opportunities = [];
    @track sortedBy;
    @track sortedDirection = 'asc';

    @wire(getAllOpps)
    wiredOpps({error,data}) {
        if (data) {
            this.opportunities = data;
        } else if (error) {
            this.error = error;
        }
    }

    sortData(fieldName, sortDirection){
        var data = this.opportunities;
        //function to return the value stored in the field
        var key =(a) => a[fieldName]; 
        var reverse = sortDirection === 'asc' ? 1: -1;
        data.sort((a,b) => {
            let valueA = key(a) ? key(a).toLowerCase() : '';
            let valueB = key(b) ? key(b).toLowerCase() : '';
            return reverse * ((valueA > valueB) - (valueB > valueA));
        });
        
        //set sorted data to opportunities attribute
        this.opportunities = data;
    }
    
    updateColumnSorting(event){
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        this.sortData(this.sortedBy,this.sortedDirection);       
    }

}