import { Product } from "../../events/shared/product.model";
import { ProductSelection } from "./productselection.model";

export class Payment {
    products: ProductSelection[];
    isPaid: boolean;
    paidOn: Date;
    marked: boolean;
    constructor() {
        this.products = [];
        this.isPaid = false;
        this.paidOn = null;
        this.marked = false;
    }
    public sum(): number{
    	let sum: number = 0;
    	 this.products.forEach((p: ProductSelection) => {
    		if(p.discount ) {
    			sum = sum + p.product.price + p.discount.amount;
    		} else {
    			sum = sum + p.product.price;
    		}
    	});
    	return sum;
    }

    static fromJSON(json: any): Payment {
        let payment = Object.create(Payment.prototype);
        Object.assign(payment, json);
        payment.marked = false;
        return payment;
    }
}
