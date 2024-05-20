interface Summary {
  customers: number;
  sales: number;
  lowStock: number;
  returns: number;
}

interface Status {
  total: number;
  status: string;
}

interface StatusProgress {
  orders: Status[];
  merchants: Status[];
  reviews: Status[];
}

interface StatusWColor {
  status: string;
  total: number;
  color: string;
}

export type { Summary, StatusProgress, StatusWColor };
