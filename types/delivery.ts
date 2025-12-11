export enum DeliveryStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface DeliveryData {
  trackingId: string
  recipient: string
  destination: string
  items: string
  status: DeliveryStatus
  owner: string
  createdAt: number
  deliveredAt?: number
}
