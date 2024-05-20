import { MdOutlineRateReview } from "react-icons/md";
import { FaRegBuilding, FaRegFileAlt, FaDollarSign } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { IoWarningOutline } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import type { StatusWColor } from "../types";

export const barData = [
  { month: "January", Smartphones: 1200, Laptops: 900, Tablets: 200 },
  { month: "February", Smartphones: 1900, Laptops: 1200, Tablets: 400 },
  { month: "March", Smartphones: 400, Laptops: 1000, Tablets: 200 },
  { month: "April", Smartphones: 1000, Laptops: 200, Tablets: 800 },
];

export const salesData = [
  {
    date: "Jan",
    Sales: 50,
  },
  {
    date: "Feb",
    Sales: 60,
  },
  {
    date: "Mar",
    Sales: 40,
  },
  {
    date: "Apr",
    Sales: 30,
  },
];

export const customerData = [
  {
    date: "Jan",
    Customers: 60,
  },
  {
    date: "Feb",
    Customers: 80,
  },
  {
    date: "Mar",
    Customers: 85,
  },
  {
    date: "Apr",
    Customers: 110,
  },
];

export const segmentedData = [
  {
    label: "Day",
    value: "day",
  },
  {
    label: "Week",
    value: "week",
  },
  {
    label: "Month",
    value: "month",
  },
  {
    label: "Year",
    value: "year",
  },
  {
    label: "All",
    value: "all",
  },
];

export const statsData = [
  {
    key: "sales",
    title: "Sales",
    color: "green",
    icon: FaDollarSign,
  },
  {
    key: "lowStock",
    title: "Low stock products",
    color: "orange",
    icon: IoWarningOutline,
  },
  {
    key: "customers",
    title: "Customers",
    color: "blue",
    icon: FiUsers,
  },
  {
    key: "returns",
    title: "Order returns",
    color: "red",
    icon: IoIosCloseCircleOutline,
  },
];

export const donutData = [
  { name: "House appliances", value: 400, color: "indigo" },
  { name: "Healthcare", value: 300, color: "yellow" },
  { name: "Office supplies", value: 100, color: "teal" },
  { name: "Food", value: 200, color: "red" },
  { name: "Sports", value: 100, color: "green" },
  { name: "Toys", value: 100, color: "pink" },
  { name: "Other", value: 200, color: "gray" },
];

export const statusTabs = [
  {
    key: "orders",
    title: "Order status",
    icon: FaRegFileAlt,
    progress: {
      total: (ss: StatusWColor[]) => ss.reduce((a, b) => a + b.total, 0),
      fragments: (s: StatusWColor) => ({
        label: s.status,
        count: s.total,
        color: s.color,
      }),
      // [
      //   { label: "Delivered", count: 200, color: "teal" },
      //   { label: "Shipped", count: 5, color: "yellow" },
      //   { label: "Cancelled", count: 5, color: "pink" },
      // ],
    },
  },
  {
    key: "merchants",
    title: "Merchant status",
    icon: FaRegBuilding,
    progress: {
      total: (ss: StatusWColor[]) => ss.reduce((a, b) => a + b.total, 0),
      fragments: (s: StatusWColor) => ({
        label: s.status,
        count: s.total,
        color: s.color,
      }),
      // [
      //   { label: "Approved", count: 40, color: "teal" },
      //   { label: "Pending", count: 5, color: "yellow" },
      //   { label: "Rejected", count: 5, color: "pink" },
      // ],
    },
  },
  {
    key: "reviews",
    title: "Review status",
    icon: MdOutlineRateReview,
    progress: {
      total: (ss: StatusWColor[]) => ss.reduce((a, b) => a + b.total, 0),
      fragments: (s: StatusWColor) => ({
        label: s.status,
        count: s.total,
        color: s.color,
      }),
      // [
      //   { label: "Approved", count: 30, color: "teal" },
      //   { label: "Pending", count: 7, color: "yellow" },
      //   { label: "Rejected", count: 3, color: "pink" },
      // ],
    },
  },
];

export const initStatuses = {
  merchants: [
    { status: "APPROVED", total: 0, color: "teal" },
    { status: "REJECTED", total: 0, color: "pink" },
    { status: "WAITING_APPROVAL", total: 0, color: "yellow" },
  ],
  reviews: [
    { status: "APPROVED", total: 0, color: "teal" },
    { status: "REJECTED", total: 0, color: "pink" },
    { status: "WAITING_APPROVAL", total: 0, color: "yellow" },
  ],
  orders: [
    { status: "DELIVERED", total: 0, color: "teal" },
    { status: "CANCELLED", total: 0, color: "pink" },
    { status: "PROCESSING", total: 0, color: "yellow" },
  ],
};
