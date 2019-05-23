public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static Map<String,Object> getAccounts(){
        Map<String, Object> response = new Map< String, Object>();
        response.put('labelsMap', new Map<String, String> {
                'name' => Schema.getGlobalDescribe().get('Account').getDescribe().fields.getMap().get('Name').getDescribe().getLabel(),
                'phone' => Schema.getGlobalDescribe().get('Account').getDescribe().fields.getMap().get('Phone').getDescribe().getLabel(),
                'website' => Schema.getGlobalDescribe().get('Account').getDescribe().fields.getMap().get('Website').getDescribe().getLabel()
        });
        response.put('accounts', [SELECT Id, Name, Phone, Website From Account Limit 10]);
        
        return response;
    }
    
}
