export class Discount {
    id: number;
    name: string;
    amount: number;

    selected: boolean = false;

    static fromJSON(json: any): Discount {
        let discount = Object.create(Discount.prototype);
        Object.assign(discount, json);

        if(discount.selected == undefined) discount.selected = false;

        return discount;
    }
}
