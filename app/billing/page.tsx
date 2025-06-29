'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import InvoiceForm from '@/components/forms/InvoiceForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Receipt, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit,
  Eye,
  Download,
  Printer,
  Send,
  DollarSign,
  FileText,
  Calendar,
  User,
  Filter,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [invoices, setInvoices] = useState([
    {
      id: 1,
      number: 'FAC-2024-001',
      type: 'factura',
      clientType: 'registered',
      clientName: 'María González',
      clientEmail: 'maria.gonzalez@email.com',
      clientPhone: '+1 (555) 123-4567',
      clientAddress: 'Calle Principal 123, Ciudad',
      clientTaxId: 'RFC123456789',
      date: '2024-01-15',
      dueDate: '2024-02-14',
      items: [
        { id: 1, description: 'Baño y Corte Completo - Max', quantity: 1, price: 45, total: 45 },
        { id: 2, description: 'Champú Antipulgas Premium', quantity: 1, price: 25.99, total: 25.99 }
      ],
      subtotal: 70.99,
      tax: 11.36,
      discount: 0,
      total: 82.35,
      status: 'paid',
      paymentMethod: 'Efectivo',
      notes: 'Servicio completado satisfactoriamente'
    },
    {
      id: 2,
      number: 'FAC-2024-002',
      type: 'factura',
      clientType: 'general',
      clientName: 'Cliente General',
      clientEmail: '',
      clientPhone: '+1 (555) 987-6543',
      clientAddress: '',
      clientTaxId: '',
      date: '2024-01-16',
      dueDate: '2024-02-15',
      items: [
        { id: 1, description: 'Corte de Uñas', quantity: 1, price: 15, total: 15 },
        { id: 2, description: 'Baño Básico', quantity: 1, price: 25, total: 25 }
      ],
      subtotal: 40,
      tax: 6.4,
      discount: 0,
      total: 46.4,
      status: 'pending',
      paymentMethod: 'Pendiente',
      notes: ''
    },
    {
      id: 3,
      number: 'TIC-2024-003',
      type: 'ticket',
      clientType: 'general',
      clientName: 'Cliente Ocasional',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      clientTaxId: '',
      date: '2024-01-17',
      dueDate: '2024-01-17',
      items: [
        { id: 1, description: 'Spa Canino Premium', quantity: 1, price: 85, total: 85 }
      ],
      subtotal: 85,
      tax: 13.6,
      discount: 8.5,
      total: 90.1,
      status: 'paid',
      paymentMethod: 'Tarjeta',
      notes: 'Descuento VIP aplicado'
    },
    {
      id: 4,
      number: 'FAC-2024-004',
      type: 'factura',
      clientType: 'registered',
      clientName: 'Carlos Ruiz',
      clientEmail: 'carlos.ruiz@email.com',
      clientPhone: '+1 (555) 234-5678',
      clientAddress: 'Avenida Central 456, Ciudad',
      clientTaxId: 'RFC987654321',
      date: '2024-01-18',
      dueDate: '2024-02-17',
      items: [
        { id: 1, description: 'Corte Estilizado - Luna', quantity: 1, price: 55, total: 55 },
        { id: 2, description: 'Acondicionador Premium', quantity: 1, price: 18.5, total: 18.5 }
      ],
      subtotal: 73.5,
      tax: 11.76,
      discount: 0,
      total: 85.26,
      status: 'overdue',
      paymentMethod: 'Pendiente',
      notes: 'Cliente frecuente'
    }
  ]);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && invoice.status === selectedFilter;
  });

  const handleAddInvoice = () => {
    setSelectedInvoice(null);
    setIsFormOpen(true);
  };

  const handleEditInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsFormOpen(true);
  };

  const handleSaveInvoice = (invoiceData: any) => {
    if (selectedInvoice) {
      // Update existing invoice
      setInvoices(prev => prev.map(invoice => 
        invoice.id === invoiceData.id ? invoiceData : invoice
      ));
    } else {
      // Add new invoice
      setInvoices(prev => [...prev, invoiceData]);
    }
  };

  const handleDeleteInvoice = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta factura?')) {
      setInvoices(prev => prev.filter(invoice => invoice.id !== id));
    }
  };

  const handlePrintInvoice = (invoice: any) => {
    // Aquí implementarías la lógica de impresión
    console.log('Printing invoice:', invoice.number);
  };

  const handleDownloadInvoice = (invoice: any) => {
    // Aquí implementarías la lógica de descarga PDF
    console.log('Downloading invoice:', invoice.number);
  };

  const handleSendInvoice = (invoice: any) => {
    // Aquí implementarías la lógica de envío por email
    console.log('Sending invoice:', invoice.number);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pagada';
      case 'pending':
        return 'Pendiente';
      case 'overdue':
        return 'Vencida';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.total, 0);
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Facturación</h1>
            <p className="text-gray-600">Gestiona facturas, tickets y comprobantes de pago</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddInvoice}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Factura
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por número de factura o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('all')}
            >
              Todas
            </Button>
            <Button 
              variant={selectedFilter === 'paid' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('paid')}
            >
              Pagadas
            </Button>
            <Button 
              variant={selectedFilter === 'pending' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('pending')}
            >
              Pendientes
            </Button>
            <Button 
              variant={selectedFilter === 'overdue' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('overdue')}
            >
              Vencidas
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Facturado</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-gray-500">Facturas pagadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Por Cobrar</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</div>
              <p className="text-xs text-gray-500">Facturas pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${overdueAmount.toFixed(2)}</div>
              <p className="text-xs text-gray-500">Requieren seguimiento</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Facturas</CardTitle>
              <FileText className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoices.length}</div>
              <p className="text-xs text-gray-500">Este mes</p>
            </CardContent>
          </Card>
        </div>

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Facturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{invoice.number}</h3>
                        <Badge variant="outline" className="text-xs">
                          {invoice.type === 'factura' ? 'Factura' : 'Ticket'}
                        </Badge>
                        <Badge className={getStatusColor(invoice.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(invoice.status)}
                            <span>{getStatusText(invoice.status)}</span>
                          </div>
                        </Badge>
                        {invoice.clientType === 'registered' && (
                          <Badge variant="secondary" className="text-xs">
                            Cliente Registrado
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="font-medium">{invoice.clientName}</span>
                          </div>
                          {invoice.clientPhone && (
                            <div className="text-sm text-gray-600 ml-6">
                              Tel: {invoice.clientPhone}
                            </div>
                          )}
                          {invoice.clientTaxId && (
                            <div className="text-sm text-gray-600 ml-6">
                              RFC: {invoice.clientTaxId}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            Fecha: {invoice.date}
                          </div>
                          <div className="text-sm text-gray-600 ml-6">
                            Vence: {invoice.dueDate}
                          </div>
                          <div className="text-sm text-gray-600 ml-6">
                            Pago: {invoice.paymentMethod}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="text-sm text-gray-600">
                            Subtotal: <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Impuestos: <span className="font-medium">${invoice.tax.toFixed(2)}</span>
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            Total: ${invoice.total.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Items Preview */}
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">Servicios/Productos:</p>
                        <div className="space-y-1">
                          {invoice.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              • {item.description} - ${item.total.toFixed(2)}
                            </div>
                          ))}
                          {invoice.items.length > 2 && (
                            <div className="text-sm text-gray-500">
                              +{invoice.items.length - 2} artículos más
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {invoice.notes && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Notas:</span> {invoice.notes}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button variant="outline" size="sm" onClick={() => handlePrintInvoice(invoice)}>
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(invoice)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      {invoice.clientEmail && (
                        <Button variant="outline" size="sm" onClick={() => handleSendInvoice(invoice)}>
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditInvoice(invoice)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleAddInvoice}>
            <CardContent className="p-6 text-center">
              <Plus className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold mb-1">Nueva Factura</h3>
              <p className="text-sm text-gray-600">Crear factura o ticket</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold mb-1">Reportes</h3>
              <p className="text-sm text-gray-600">Análisis de facturación</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold mb-1">Pagos</h3>
              <p className="text-sm text-gray-600">Registrar pagos</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Receipt className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <h3 className="font-semibold mb-1">Configuración</h3>
              <p className="text-sm text-gray-600">Datos fiscales</p>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Form Modal */}
        <InvoiceForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          invoice={selectedInvoice}
          onSave={handleSaveInvoice}
        />
      </div>
    </DashboardLayout>
  );
}