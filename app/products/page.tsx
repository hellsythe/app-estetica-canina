'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductForm from '@/components/forms/ProductForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Trash2
} from 'lucide-react';
import { Product } from '@/lib/api/services/product/product';
import { useProducts } from '@/hooks/useProduct';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(new Product());
  // const [products, setProducts] = useState([
  //   {
  //     id: 1,
  //     name: 'Champú Antipulgas Premium',
  //     category: 'Higiene',
  //     price: 25.99,
  //     stock: 15,
  //     minStock: 5,
  //     supplier: 'PetCare Solutions',
  //     status: 'Disponible',
  //     sku: 'HIG-0001',
  //     description: 'Champú especializado para eliminar pulgas y garrapatas'
  //   },
  //   {
  //     id: 2,
  //     name: 'Acondicionador Hidratante',
  //     category: 'Higiene',
  //     price: 18.50,
  //     stock: 8,
  //     minStock: 10,
  //     supplier: 'PetCare Solutions',
  //     status: 'Stock Bajo',
  //     sku: 'HIG-0002',
  //     description: 'Acondicionador para pelo seco y maltratado'
  //   },
  //   {
  //     id: 3,
  //     name: 'Cortauñas Profesional',
  //     category: 'Herramientas',
  //     price: 45.00,
  //     stock: 3,
  //     minStock: 2,
  //     supplier: 'GroomTech',
  //     status: 'Disponible',
  //     sku: 'HER-0001',
  //     description: 'Cortauñas de acero inoxidable para uso profesional'
  //   },
  //   {
  //     id: 4,
  //     name: 'Cepillo Desenredante',
  //     category: 'Herramientas',
  //     price: 22.75,
  //     stock: 12,
  //     minStock: 5,
  //     supplier: 'GroomTech',
  //     status: 'Disponible',
  //     sku: 'HER-0002',
  //     description: 'Cepillo especial para desenredar pelo largo'
  //   },
  //   {
  //     id: 5,
  //     name: 'Perfume Canino Lavanda',
  //     category: 'Fragancias',
  //     price: 15.99,
  //     stock: 0,
  //     minStock: 8,
  //     supplier: 'Aroma Pets',
  //     status: 'Agotado',
  //     sku: 'FRA-0001',
  //     description: 'Perfume con aroma a lavanda, larga duración'
  //   }
  // ]);
  const { products, createProduct, updateProduct, deleteProduct } = useProducts();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setSelectedProduct(new Product());
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleSaveProduct = async (productData: any) => {
    if (selectedProduct.id) {
      await updateProduct(selectedProduct.id, productData);
      toast.success('Producto actualizado correctamente');
    } else {
      await createProduct(productData);
      toast.success('Producto guardado correctamente');
    }
  };

  const handleDeleteProduct = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-2">
        <p className="font-semibold">¿Estás seguro de que quieres eliminar este Producto?</p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              deleteProduct(id);
              toast.dismiss(t.id);
              toast.success('Producto eliminado correctamente');
            }}
          >
            Eliminar
          </Button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
      style: {
        background: '#fff',
        padding: '1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-800';
      case 'Stock Bajo':
        return 'bg-yellow-100 text-yellow-800';
      case 'Agotado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStock && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
            <p className="text-gray-600">Gestiona el inventario de productos para tu estética</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Producto
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar productos por nombre, categoría o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Todos</Button>
            <Button variant="outline">Higiene</Button>
            <Button variant="outline">Herramientas</Button>
            <Button variant="outline">Fragancias</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-gray-500">En catálogo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-gray-500">Valor total stock</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockCount}</div>
              <p className="text-xs text-gray-500">Requieren reposición</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos Agotados</CardTitle>
              <ShoppingCart className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{outOfStockCount}</div>
              <p className="text-xs text-gray-500">Sin stock disponible</p>
            </CardContent>
          </Card>
        </div>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>Inventario de Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <Badge className={getStatusColor(product.status)}>
                          {product.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {product.sku}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{product.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">Categoría: {product.category}</p>
                          <p className="text-sm text-gray-600">Proveedor: {product.supplier}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            Precio: <span className="font-semibold text-green-600">${product.price}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Valor total: <span className="font-semibold">${(product.price * product.stock).toFixed(2)}</span>
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            Stock: <span className={`font-semibold ${
                              product.stock === 0 ? 'text-red-600' :
                              product.stock <= product.minStock ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {product.stock} unidades
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">Stock mínimo: {product.minStock}</p>
                        </div>

                        <div className="space-y-1">
                          {product.stock <= product.minStock && product.stock > 0 && (
                            <div className="flex items-center text-yellow-600">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              <span className="text-xs">Reposición necesaria</span>
                            </div>
                          )}
                          {product.stock === 0 && (
                            <div className="flex items-center text-red-600">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              <span className="text-xs">Producto agotado</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Product Form Modal */}
        <ProductForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          product={selectedProduct}
          onSave={handleSaveProduct}
        />
      </div>
    </DashboardLayout>
  );
}