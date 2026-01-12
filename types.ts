
export enum RepairStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export interface Part {
  id: string;
  name: string;
  price: number;
}

export interface RepairJob {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  deviceModel: string;
  imei?: string;
  issueDescription: string;
  estimatedCost: number;
  advancePaid: number;
  partsUsed: Part[];
  laborCharge: number;
  status: RepairStatus;
  createdAt: string;
  updatedAt: string;
  notes: string;
  aiDiagnostic?: string;
}

export interface ShopDetails {
  name: string;
  address: string;
  phone: string;
  owner?: string;
}
