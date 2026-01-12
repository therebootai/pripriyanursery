export interface Customer {
  _id: string;
  customerId: string;
  name: string;
  email: string;
  gender: string;
  mobile: string;
  avatar: {
    public_id: string;
    url: string;
  };
  addresses: Array<{
    _id: string;
    type: string;
    name: string;
    mobile: string;
    area: string;
    city: string;
    state: string;
    pin: string;
    alternateMobile: string;
  }>;
  cart: Array<{
    productId: string | ProductType;
    variantId?: string | ProductType;
    quantity: number;
    priceAtTime: number;
  }>;
  wishlist: ProductType[];
  totalOrders: number;
  totalSpent: number;
  rewards: {
    points: number;
    tier: string;
  };
  giftCards: Array<{
    code: string;
    balance: number;
    expiry: Date;
  }>;
  // recentlyViewed: mongoose.Types.ObjectId[];
  notifications: Array<{
    title: string;
    message: string;
    createdAt: Date;
  }>;

  status: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  status: boolean;
  expirationDate: string;
  usageLimit: number;
  createdAt: string;
  updatedAt: string;
}

export type ImageType = {
  public_id: string;
  url: string;
};

export type SpecificationType = {
  name: string;
  details: string;
};

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

export interface CartType {
  productId: ProductType;
  variantId?: ProductType;
  quantity: number;
  priceAtTime: number;
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

export interface AddressType {
  _id: string;
  type: string;
  name: string;
  mobile: string;
  area: string;
  city: string;
  state: string;
  pin: string;
  landmark: string;
  alternateMobile: string;
}

export interface OrderType {
  orderId: string;
  customer: Customer;
  mobile: string;
  address: AddressType;
  couponCode: string;
  couponDiscount: number;
  razorPayPaymentId: string;
  razorPayOrderId: string;
  razorPaySignature: string;
  paymentMethod: string;
  orderValue: number;
  items: Array<{
    product: ProductType;
    quantity: number;
  }>;
  status: string;
  paymentStatus: string;
  shipping: {
    shipmozoOrderId?: string;
    courierId?: number;
    courierName?: string;
    awbNumber?: string;
    trackingUrl?: string;
    labelGenerated?: boolean;
    currentStatus?: string;
    expectedDeliveryDate?: string;
    lastStatusTime?: string;

    trackingHistory?: [
      {
        date: string;
        status: string;
        location: string;
      }
    ];
  };

  createdAt: Date;
  updatedAt: Date;
}
