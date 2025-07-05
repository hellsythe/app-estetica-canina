'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Save,
  Package,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { Product } from '@/lib/api/services/product/product';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  onSave: (product: any) => void;
}

export default function ProductForm({ isOpen, onClose, product, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>(product);

  useEffect(() => {
    setFormData(product);
    setErrors({});
  }, [product]);

  const [errors, setErrors] = useState<any>({});

  const categories = [
    'Higiene',
    'Herramientas',
    'Fragancias',
    'Alimentación',
    'Juguetes',
    'Accesorios',
    'Medicamentos',
    'Otros'
  ];

  const suppliers = [
    'PetCare Solutions',
    'GroomTech',
    'Aroma Pets',
    'Pet Supplies Co.',
    'Canine Care',
    'Otro'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const generateSKU = () => {
    const categoryCode = formData.category.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const sku = `${categoryCode}-${randomNum}`;
    setFormData(prev => ({ ...prev, sku }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const stock = formData.stock;
      const minStock = formData.minStock;

      let status = 'Disponible';
      if (stock === 0) {
        status = 'Agotado';
      } else if (stock <= minStock) {
        status = 'Stock Bajo';
      }

      const productData = {
        ...formData,
        id: product?.id || Date.now(),
        price: Number(formData.price),
        stock: stock,
        minStock: minStock,
        status: status,
        sku: formData.sku || `PRD-${Date.now()}`
      };

      await onSave(productData);
      onClose();
    } catch (error: any) {
      if (error?.errors) {
        setErrors(error.errors);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {product ? 'Editar Producto' : 'Agregar Producto'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre del Producto *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej: Champú Antipulgas Premium"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Precio ($) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="25.99"
                      className={`pl-10 ${errors.price ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descripción detallada del producto..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>

            {/* Inventory Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Inventario</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Stock Actual *</label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    placeholder="15"
                    className={errors.stock ? 'border-red-500' : ''}
                  />
                  {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Stock Mínimo *</label>
                  <Input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => handleInputChange('minStock', e.target.value)}
                    placeholder="5"
                    className={errors.minStock ? 'border-red-500' : ''}
                  />
                  {errors.minStock && <p className="text-red-500 text-xs mt-1">{errors.minStock}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">SKU</label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      placeholder="PRD-0001"
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={generateSKU}>
                      Generar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stock Warning */}
              {formData.stock && formData.minStock && formData.stock <= formData.minStock && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    {formData.stock === 0
                      ? 'Producto agotado - Se marcará como no disponible'
                      : 'Stock bajo - Se marcará para reposición'
                    }
                  </span>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {product.id ? 'Actualizar' : 'Guardar'} Producto
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}