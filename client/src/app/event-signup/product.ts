import { Discount } from "./discount";

export class Product {
    id: number;
    name: string;
    price: number;

    selected: boolean;

    discounts: Discount[];

    static fromJSON(json: any): Product {
        let product = Object.create(Product.prototype);
        Object.assign(product, json);

        if(product.selected == undefined) product.selected = false;
        return product;
    }
}
