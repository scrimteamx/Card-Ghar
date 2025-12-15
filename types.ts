
export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  validity: string; // e.g., "30 Days", "Lifetime"
  stock: number; // New field for inventory
}

export interface Review {
  id: string;
  user: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Product {
  id: number;
  name: string;
  category: 'gift-cards' | 'subscriptions' | 'games';
  delivery: string;
  image: string;
  description: string;
  requiresAccountId: boolean;
  plans: Plan[];
  reviews: Review[];
}

export interface EBill {
  id: string;
  date: string;
  productName: string;
  planName: string;
  email: string;
  username?: string;
  price: number;
  originalPrice: number;
  pointsUsed: number;
  pointsEarned: number;
  couponCode?: string;
  couponDiscountAmount?: number;
  currency: 'NPR' | 'INR';
  expiryDate: string; // New field for the bill
}

export interface CheckoutState {
  isOpen: boolean;
  step: 1 | 2 | 3 | 4;
  product: Product | null;
  selectedPlanId: string | null;
  processingPlanId: string | null; // For animation
  email: string;
  username: string;
  pointsToUse: number;
  couponInput: string;
  appliedCoupon: { code: string; percent: number } | null;
  isApplyingCoupon: boolean; // For loading indicator
  couponError: string | null;
  generatedBill: EBill | null;
  isCheckingPayment: boolean;
}

export interface TrackerState {
  selectedOrderId: string | null;
  stage: 'payment' | 'moving_to_supplier' | 'supplier' | 'moving_to_delivery' | 'delivered';
  uPressCount: number; // For stage 1 (needs 3)
  lastUPressTime: number; // For stage 2 (double press)
  showNotification: boolean;
}
