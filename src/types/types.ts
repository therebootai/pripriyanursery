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
  wishlist: WishlistType[];
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
  categoryLevels?:string[];
  subCategory: string;
  brand: {
    brandId: string;
    name: string;
    image: ImageType;
  };
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

  reviews: {
    _id: string;
    user: { name: string, };
    rating: number;
    description: string;
    title: string;
    supporting_files?: ImageType[];
  }[];

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

export interface PaymentType {
  paymentGroupId: string; // internal payment reference (PG-001)

  customer: Customer;

  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;

  amount: string;
  currency: string;

  method: string;
  status: "Created" | "Paid" | "Failed" | "Refunded";

  createdAt: Date;
  updatedAt: Date;
}

export interface OrderType {
  _id: string;
  orderId: string;

  payment: PaymentType; // 🔗 link to Payment
  customer: Customer;

  mobile: string;
  address: AddressType;

  product: ProductType; // 🔥 FINAL SKU
  quantity: number;
  price: number;
  orderValue: number;

  couponCode?: string;
  couponDiscount?: number;

  status:
    | "Processing"
    | "Confirmed"
    | "Shipped"
    | "InTransit"
    | "OutForDelivery"
    | "Delivered"
    | "Cancelled"
    | "RTO";

  paymentStatus: "Paid" | "Unpaid" | "Refunded";

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
    trackingHistory?: {
      date: string;
      status: string;
      location: string;
    }[];
  };

  createdAt: Date;
  updatedAt: Date;
}
