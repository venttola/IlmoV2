export class DiscountInfo {
    id: number;
    name: string;
    amount: number;
}

export class Discount extends DiscountInfo {
    selected: boolean = false;

    static fromJSON(json: any): Discount {
        let discount = Object.create(Discount.prototype);
        Object.assign(discount, json);

        if(discount.selected == undefined) discount.selected = false;

        return discount;
    }
}
