'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  X,
  Receipt,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Banknote,
  Download,
  Printer,
  Send,
  Check,
  Calculator,
  Package,
  Scissors
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'service' | 'product';
}

interface SelectedClient {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
}

interface SaleConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (saleData: any) => void;
  cart: CartItem[];
  selectedClient: SelectedClient | null;
  subtotal: number;
  total: number;
}

export default function SaleConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  cart,
  selectedClient,
  subtotal,
  total
}: SaleConfirmationModalProps) {
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [amountPaid, setAmountPaid] = useState(total.toString());
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const change = parseFloat(amountPaid) - total;
  const saleNumber = `VENTA-${Date.now()}`;
  const currentDate = new Date().toLocaleDateString('es-ES');
  const currentTime = new Date().toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const handleConfirmSale = async () => {
    setIsProcessing(true);
    
    const saleData = {
      saleNumber,
      date: currentDate,
      time: currentTime,
      client: selectedClient,
      items: cart,
      subtotal,
      total,
      paymentMethod,
      amountPaid: parseFloat(amountPaid),
      change: change > 0 ? change : 0,
      notes
    };

    try {
      // Aquí enviarías los datos al backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular llamada API
      
      onConfirm(saleData);
      onClose();
    } catch (error) {
      console.error('Error al procesar la venta:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generatePDF = async () => {
    const ticketElement = document.getElementById('ticket-content');
    if (!ticketElement) return;

    try {
      const canvas = await html2canvas(ticketElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 200] // Formato de ticket térmico
      });

      const imgWidth = 80;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`ticket-${saleNumber}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  };

  const printTicket = () => {
    const ticketContent = document.getElementById('ticket-content');
    if (!ticketContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket - ${saleNumber}</title>
          <style>
            body { font-family: monospace; margin: 0; padding: 20px; }
            .ticket { max-width: 300px; margin: 0 auto; }
            .center { text-align: center; }
            .line { border-bottom: 1px dashed #000; margin: 10px 0; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; }
            .total { font-weight: bold; font-size: 1.2em; }
          </style>
        </head>
        <body>
          ${ticketContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Confirmar Venta
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resumen de Venta */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Venta</h3>
                
                {/* Información del Cliente */}
                {selectedClient ? (
                  <Card className="bg-blue-50 border-blue-200 mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-900 mb-2">{selectedClient.name}</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center text-blue-800">
                              <Phone className="h-3 w-3 mr-2" />
                              {selectedClient.phoneNumber}
                            </div>
                            {selectedClient.email && (
                              <div className="flex items-center text-blue-800">
                                <Mail className="h-3 w-3 mr-2" />
                                {selectedClient.email}
                              </div>
                            )}
                            {selectedClient.address && (
                              <div className="flex items-center text-blue-800">
                                <MapPin className="h-3 w-3 mr-2" />
                                {selectedClient.address}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-gray-50 border-gray-200 mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        <span>Cliente General</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Artículos */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Artículos ({cart.length})</h4>
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {item.type === 'service' ? (
                          <Scissors className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Package className="h-4 w-4 text-green-500" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            ${item.price} x {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totales */}
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span className="text-green-600">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Método de Pago */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Método de Pago</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Card
                      className={`cursor-pointer transition-colors ${
                        paymentMethod === 'Efectivo' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setPaymentMethod('Efectivo')}
                    >
                      <CardContent className="p-3 text-center">
                        <Banknote className="h-6 w-6 mx-auto mb-1 text-green-600" />
                        <p className="text-sm font-medium">Efectivo</p>
                      </CardContent>
                    </Card>
                    <Card
                      className={`cursor-pointer transition-colors ${
                        paymentMethod === 'Tarjeta' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setPaymentMethod('Tarjeta')}
                    >
                      <CardContent className="p-3 text-center">
                        <CreditCard className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                        <p className="text-sm font-medium">Tarjeta</p>
                      </CardContent>
                    </Card>
                  </div>

                  {paymentMethod === 'Efectivo' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">Monto Recibido</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      {change > 0 && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-yellow-800">Cambio:</span>
                            <span className="text-lg font-bold text-yellow-600">
                              ${change.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Notas */}
                <div>
                  <label className="block text-sm font-medium mb-2">Notas (Opcional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notas adicionales sobre la venta..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Vista Previa del Ticket */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Vista Previa del Ticket</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={generatePDF}>
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={printTicket}>
                    <Printer className="h-4 w-4 mr-1" />
                    Imprimir
                  </Button>
                </div>
              </div>

              <Card className="bg-white border-2 border-dashed border-gray-300">
                <CardContent className="p-6">
                  <div id="ticket-content" className="font-mono text-sm space-y-2">
                    {/* Header */}
                    <div className="text-center border-b border-dashed border-gray-400 pb-2 mb-4">
                      <h2 className="font-bold text-lg">{process.env.NEXT_PUBLIC_APP_NAME}</h2>
                      <p className="text-xs">Estética Canina Profesional</p>
                      <p className="text-xs">Tel: (555) 123-4567</p>
                    </div>

                    {/* Sale Info */}
                    <div className="space-y-1 border-b border-dashed border-gray-400 pb-2 mb-2">
                      <div className="flex justify-between">
                        <span>Ticket:</span>
                        <span>{saleNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fecha:</span>
                        <span>{currentDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hora:</span>
                        <span>{currentTime}</span>
                      </div>
                    </div>

                    {/* Client Info */}
                    {selectedClient && (
                      <div className="space-y-1 border-b border-dashed border-gray-400 pb-2 mb-2">
                        <div className="flex justify-between">
                          <span>Cliente:</span>
                          <span>{selectedClient.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Teléfono:</span>
                          <span>{selectedClient.phoneNumber}</span>
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-1 border-b border-dashed border-gray-400 pb-2 mb-2">
                      <div className="font-bold">ARTÍCULOS:</div>
                      {cart.map((item) => (
                        <div key={item.id}>
                          <div className="flex justify-between">
                            <span className="truncate pr-2">{item.name}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>{item.quantity} x ${item.price}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="space-y-1 border-b border-dashed border-gray-400 pb-2 mb-2">
                      <div className="flex justify-between">
                        <span>SUBTOTAL:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>TOTAL:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Payment */}
                    <div className="space-y-1 border-b border-dashed border-gray-400 pb-2 mb-2">
                      <div className="flex justify-between">
                        <span>Método de Pago:</span>
                        <span>{paymentMethod}</span>
                      </div>
                      {paymentMethod === 'Efectivo' && (
                        <>
                          <div className="flex justify-between">
                            <span>Recibido:</span>
                            <span>${parseFloat(amountPaid).toFixed(2)}</span>
                          </div>
                          {change > 0 && (
                            <div className="flex justify-between">
                              <span>Cambio:</span>
                              <span>${change.toFixed(2)}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="text-center text-xs space-y-1">
                      <p>¡Gracias por su preferencia!</p>
                      <p>Vuelva pronto</p>
                      {notes && (
                        <div className="mt-2 pt-2 border-t border-dashed border-gray-400">
                          <p className="font-bold">Notas:</p>
                          <p>{notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmSale} 
              className="bg-green-600 hover:bg-green-700"
              disabled={isProcessing || (paymentMethod === 'Efectivo' && parseFloat(amountPaid) < total)}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Procesando...
                </div>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Confirmar Venta
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}