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
  status: boolean;
  expirationDate: string;
  usageLimit: number;
  createdAt: string;
  updatedAt: string;
}

export type ImageType = {
  public_id: string;
  url: string;
}

export type SpecificationType = {   
    name: string;
    details: string;
}

export type ProductType = {
  _id: string;
  productId: string;
  slug: string;

  parentProduct?: ProductType | null;
  isVariant?: boolean;
  variants?: ProductType[];

  name: string;
  shortDescription: string;
  longDescription: string;

  coverImage: ImageType;
  images?: ImageType[];
  video?: ImageType;
  
  category: string;
  subCategory: string;
  brand: string;
  attributes: string[];
  variables?: {
    name: string;
    values: string[];
  }[];
  pickup?: string;
  averageRating: number;
  ratingCount: number;
  ratingBreakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };

  specifications: SpecificationType[];

  mrp: number;
  price: number;
  discount: number;
  stock: number;

  status: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface Level {
  id?: string;
  type: string;
  name?: string;
  image?: ImageType;
  children?: Level[];
  status?: boolean;
}

export interface WishlistType {
  _id: string;
  product: ProductType;
  status: boolean;  
}

export interface CategoryType {
  categoryId: string;
  name: string;
  image: ImageType;
  status: boolean;
  children: Level[];
  createdAt: Date;
  updatedAt: Date;
}