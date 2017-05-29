import { Discount } from "./discount";

export class ProductInfo {
    id: number;
    name: string;
    price: number;
}

export class Product extends ProductInfo {
    selected: boolean;

    discounts: Discount[];

    static fromJSON(json: any): Product {
        let product = Object.create(Product.prototype);
        Object.assign(product, json);

        if(product.selected == undefined) product.selected = false;
        return product;
    }
}
