export const roles = {
  admin: "ADMIN",
  merchant: "MERCHANT",
};

export const actions = {
  read: "READ",
  create: "CREATE",
  update: "UPDATE",
  delete: "DELETE",
};

export const features = {
  dashboard: "dashboard",
  products: "products",
  categories: "categories",
  brands: "brands",
  merchants: "merchants",
  users: "users",
  orders: "orders",
  reviews: "reviews",
} as const;

interface Section {
  access: string[];
  readonly: string[];
}

export const sections: Record<keyof typeof features, Section> = {
  dashboard: {
    access: [roles.admin, roles.merchant],
    readonly: [],
  },
  products: {
    access: [roles.admin, roles.merchant],
    readonly: [],
  },
  categories: {
    access: [roles.admin, roles.merchant],
    readonly: [roles.merchant],
  },
  brands: {
    access: [roles.admin],
    readonly: [],
  },
  merchants: {
    access: [roles.admin],
    readonly: [],
  },
  users: {
    access: [roles.admin],
    readonly: [],
  },
  orders: {
    access: [roles.admin, roles.merchant],
    readonly: [roles.merchant],
  },
  reviews: {
    access: [roles.admin, roles.merchant],
    readonly: [roles.merchant],
  },
};
