export interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

export interface CategoryTree {
  mainCategories: Category[];
}
