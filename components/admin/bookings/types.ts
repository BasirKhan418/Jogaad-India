export interface User {
  _id: string;
  name: string;
  email: string;
  img?: string;
  phone?: string;
  address?: string;
  pincode?: string;
}

export interface Category {
  _id: string;
  categoryName: string;
  img?: string;
  categoryType?: string;
  categoryUnit?: string;
  categoryDescription?: string;
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  img?: string;
}

export type BookingStatus = "pending" | "confirmed" | "in-progress" | "started" | "completed" | "cancelled" | "refunded";

export interface Booking {
  _id: string;
  userid: User;
  categoryid: Category;
  employeeid?: Employee;
  status: BookingStatus;
  bookingDate: string;
  intialamount: number;
  bookingAmount?: number;
  orderid: string;
  paymentid?: string;
  paymentStatus?: string;
  intialPaymentStatus?: string;
  feedback?: string;
  rating?: number;
  refundStatus?: string;
  refundAmount?: number;
  refundDate?: string;
  refundid?: string;
  renderPaymentButton?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  _id: string;
  bookingid: string;
  employeeid: Employee;
  isAccepted: boolean;
  createdAt: string;
}
