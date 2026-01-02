export interface ProductType {
    _id: string;
    name: string;
    slug: string;
    category: string;
    image: string;
    price: number;
    countInStock: number;
    brand: string;
    rating: number;
    numReviews: number;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface CouponType {
  _id: string;
  couponId: string;
  name: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  startDate: string;
  expirationDate : string;
  usageLimit : number;
  createdAt: string;
  updatedAt: string;
}