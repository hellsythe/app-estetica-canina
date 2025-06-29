'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  Receipt,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Printer,
  Download
} from 'lucide-react';

export default function CashRegisterPage() {
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const [cashCount, setCashCount] = useState({
    bills: {
      1000: 0,
      500: 0,
      200: 0,
      100: 0,
      50: 0,
      20: 0
    },
    coins: {
      10: 0,
      5: 0,
      2: 0,
      1: 0,
      0.5: 0
    }
  });

  const dailySales = [
    {
      id: 1,
      time: '09:30 AM',
      client: 'María González',
      service: 'Baño y Corte Completo',
      amount: 45,
      paymentMethod: 'Efectivo',
      status: 'Completado'
    },
    {
      id: 2,
      time: '10:15 AM',
      client: 'Carlos Ruiz',
      service: 'Corte de Uñas',
      amount: 15,
      paymentMethod: 'Tarjeta',
      status: 'Completado'
    },
    {
      id: 3,
      time: '11:00 AM',
      client: 'Ana Martínez',
      service: 'Baño Medicinal + Champú',
      amount: 53,
      paymentMethod: 'Efectivo',
      status: 'Completado'
    },
    {
      id: 4,
      time: '02:30 PM',
      client: 'Luis Fernández',
      service: 'Corte Estilizado',
      amount: 55,
      paymentMethod: 'Tarjeta',
      status: 'Completado'
    },
    {
      id: 5,
      time: '03:45 PM',
      client: 'Carmen Silva',
      service: 'Baño Completo + Productos',
      amount: 67,
      paymentMethod: 'Efectivo',
      status: 'Completado'
    }
  ];

  const expenses = [
    {
      id: 1,
      description: 'Compra de champú antipulgas',
      amount: 120,
      category: 'Productos',
      time: '08:00 AM'
    },
    {
      id: 2,
      description: 'Pago de servicios (luz)',
      amount: 85,
      category: 'Servicios',
      time: '09:00 AM'
    },
    {
      id: 3,
      description: 'Combustible para delivery',
      amount: 40,
      category: 'Transporte',
      time: '11:30 AM'
    }
  ];

  const totalSales = dailySales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const cashSales = dailySales.filter(sale => sale.paymentMethod === 'Efectivo').reduce((sum, sale) => sum + sale.amount, 0);
  const cardSales = dailySales.filter(sale => sale.paymentMethod === 'Tarjeta').reduce((sum, sale) => sum + sale.amount, 0);

  const calculateCashTotal = () => {
    const billsTotal = Object.entries(cashCount.bills).reduce((sum, [denomination, count]) => {
      return sum + (parseFloat(denomination) * count);
    }, 0);
    
    const coinsTotal = Object.entries(cashCount.coins).reduce((sum, [denomination, count]) => {
      return sum + (parseFloat(denomination) * count);
    }, 0);
    
    return billsTotal + coinsTotal;
  };

  const expectedCash = 500 + cashSales - totalExpenses; // 500 es el fondo inicial
  const actualCash = calculateCashTotal();
  const difference = actualCash - expectedCash;

  const updateCashCount = (type: 'bills' | 'coins', denomination: string, value: number) => {
    setCashCount(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [denomination]: Math.max(0, value)
      }
    }));
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Corte de Caja</h1>
            <p className="text-gray-600">Cierre diario y control de efectivo</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Cerrar Caja
            </Button>
          </div>
        </div>

        {/* Date Selection */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Fecha:</span>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalSales}</div>
              <p className="text-xs text-gray-500">{dailySales.length} transacciones</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gastos</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${totalExpenses}</div>
              <p className="text-xs text-gray-500">{expenses.length} gastos registrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efectivo</CardTitle>
              <Banknote className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">${cashSales}</div>
              <p className="text-xs text-gray-500">Ventas en efectivo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarjetas</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">${cardSales}</div>
              <p className="text-xs text-gray-500">Ventas con tarjeta</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cash Count */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Conteo de Efectivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Billetes</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(cashCount.bills).map(([denomination, count]) => (
                      <div key={denomination} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">${denomination}</span>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={count}
                            onChange={(e) => updateCashCount('bills', denomination, parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-center"
                            min="0"
                          />
                          <span className="text-sm text-gray-600 w-12">
                            ${(parseFloat(denomination) * count).toFixed(0)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Monedas</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(cashCount.coins).map(([denomination, count]) => (
                      <div key={denomination} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">${denomination}</span>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={count}
                            onChange={(e) => updateCashCount('coins', denomination, parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-center"
                            min="0"
                          />
                          <span className="text-sm text-gray-600 w-12">
                            ${(parseFloat(denomination) * count).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Total Contado:</span>
                    <span className="text-lg font-bold">${actualCash.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Esperado:</span>
                    <span className="text-lg font-bold">${expectedCash.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Diferencia:</span>
                    <span className={`text-lg font-bold ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${difference.toFixed(2)}
                    </span>
                  </div>
                  {difference !== 0 && (
                    <div className={`mt-2 p-2 rounded-lg flex items-center gap-2 ${
                      difference > 0 ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">
                        {difference > 0 ? 'Sobrante detectado' : 'Faltante detectado'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Summary */}
          <div className="space-y-6">
            {/* Sales Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Resumen de Ventas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {dailySales.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{sale.time}</span>
                        </div>
                        <p className="font-medium text-sm">{sale.client}</p>
                        <p className="text-xs text-gray-600">{sale.service}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${sale.amount}</p>
                        <Badge variant={sale.paymentMethod === 'Efectivo' ? 'default' : 'secondary'} className="text-xs">
                          {sale.paymentMethod}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Expenses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Gastos del Día
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{expense.time}</span>
                        </div>
                        <p className="font-medium text-sm">{expense.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {expense.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">-${expense.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Resumen Final del Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Ingresos Brutos</h3>
                <p className="text-3xl font-bold text-green-600">${totalSales}</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Gastos Totales</h3>
                <p className="text-3xl font-bold text-red-600">${totalExpenses}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Ganancia Neta</h3>
                <p className="text-3xl font-bold text-blue-600">${totalSales - totalExpenses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}