import { ProductInfo } from "../events/shared/product.model";
import { DiscountInfo } from "../events/shared/discount.model";

export class ProductSelection {
    product: ProductInfo;
    discount?: DiscountInfo;
}
