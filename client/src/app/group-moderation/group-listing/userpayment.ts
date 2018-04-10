import { Product } from "../events/shared/product.model";
import { ProductSelection } from "./productselection";

export class UserPayment {
    products: ProductSelection[];
    isPaid: boolean;
    paidOn: Date;
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

    static fromJSON(json: any): UserPayment {
        let payment = Object.create(UserPayment.prototype);
        Object.assign(payment, json);
        return payment;
    }
}
