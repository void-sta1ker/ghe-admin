interface Category extends CategoryData {
  id: string;
}

interface CategoryData {
  name?: string;
  description?: string;
  slug?: string;
  isActive?: boolean;
  products?: string[];
}

export type { Category, CategoryData };
