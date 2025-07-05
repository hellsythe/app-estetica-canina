import { Product } from '@/lib/api/services/product/product';
import { serviceProduct } from '@/lib/api/services/product/product.service';
import { useState, useEffect } from 'react';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await serviceProduct.getAll();
      setProducts(data.data);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createProduct = async (employeeData: any) => {
    try {
      const newProduct = await serviceProduct.create(employeeData);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const updateProduct = async (id: string, employeeData: any) => {
    try {
      const updatedProduct = await serviceProduct.update(id, employeeData);
      setProducts(prev =>
        prev.map(emp => emp.id === id ? updatedProduct : emp)
      );
      return updatedProduct;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await serviceProduct.delete(id);
      setProducts(prev => prev.filter(emp => emp.id !== id));
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  };
};