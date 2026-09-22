export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    value === "PENDING" ||
    value === "CONFIRMED" ||
    value === "CANCELLED" ||
    value === "COMPLETED"
  );
}

export type CustomerInfo = {
  customerName: string;
};

export type ProductInfo = {
  productName: string;
  quantity: number;
  totalAmount: number;
};

export type OrderDetails = CustomerInfo & ProductInfo;

export function isOrderDetails(value: unknown): value is OrderDetails {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const order = value as Record<string, unknown>;

  return (
    typeof order.customerName === "string" &&
    typeof order.productName === "string" &&
    typeof order.quantity === "number" &&
    Number.isInteger(order.quantity) &&
    order.quantity > 0 &&
    typeof order.totalAmount === "number" &&
    Number.isFinite(order.totalAmount) &&
    order.totalAmount >= 0
  );
}

export type Order = OrderDetails & {
  orderId: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export function isUuid(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}