import { Product } from "../event-signup/product";
import { ProductSelection } from "./productselection";

export class UserPayment {
    products: ProductSelection[];
    isPaid: boolean;
    paidOn: Date;

    static fromJSON(json: any): UserPayment {
        let payment = Object.create(UserPayment.prototype);
        Object.assign(payment, json);
        return payment;
    }
}
