export type Category = {
    id: number;
    category: string;
};

export type CategoriesState = {
    categories: Category[];
    isLoading: boolean;
    fetchCategories: () => Promise<void>;
};