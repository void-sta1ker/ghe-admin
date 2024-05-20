interface Review extends ReviewData {
  id: string;
}

interface ReviewData {
  product: string;
  user: string;
  title: string;
  rating: number;
  review: string;
  isRecommended: boolean;
  status: string;
}

export type { Review, ReviewData };
