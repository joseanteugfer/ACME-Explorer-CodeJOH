import { Entity } from './entity.model';

export class Actor extends Entity {

    name: string;
    surname: string;
    email: string;
    password: string;
    preferredLanguage: string;
    phone: string;
    address: string;
    paypal: string;
    role: string;
    validated: string;
    banned: boolean;
    created: Date;
    idToken: string;
    customToken: string;

}
