import { LightningElement, wire, api } from 'lwc';
import getContactsForAccount from '@salesforce/apex/ShowContact.getContactsForAccount';

const COLUMNS = [
    { label: '이름', fieldName: 'Name' },
    { label: '이메일', fieldName: 'Email', type: 'email' },
    { label: '전화번호', fieldName: 'Phone', type: 'phone' }
];

export default class Contact extends LightningElement {
    @api recordId; // 계정 ID
    columns = COLUMNS;
    contactData;

    @wire(getContactsForAccount, { accountId: '$recordId' })
    wiredContacts({ data, error }) {
        if (data) {
            this.contactData = data;
        } else if (error) {
            // 오류 처리
        }
    }


}