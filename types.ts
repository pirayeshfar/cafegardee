export interface Recipe {
  name: string;
  origin: string; // Country
  city?: string; // Optional city
  description: string;
  ingredients: string[];
  instructions: string[];
  category: 'کلاسیک' | 'کشورها';
  type: 'قهوه' | 'دمنوش' | 'نوشیدنی';
}