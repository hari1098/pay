export type MainCategory = {
  id: string;

  name: string;

  category_heading_font_color: string;

  categories_color: string;

  font_color: string;

  isActive: boolean;

  subCategories: SubCategory[];

  created_at: Date;

  updated_at: Date;
};

export type SubCategory = {
  id: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  category_heading_font_color: string;
  isActive: boolean;
  categories_color?: string;
  font_color?: string;
  subCategories?: SubCategory[];
};
