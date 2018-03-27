import { ProductInfo } from "../event-signup/product.model";
import { DiscountInfo } from "../../event-signup/discount.model";

export class ProductSelection {
    product: ProductInfo;
    discount?: DiscountInfo;
}
