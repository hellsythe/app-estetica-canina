'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  X,
  Save,
  Calendar,
  Clock,
  DollarSign,
  CreditCard,
  Banknote,
  Check,
  AlertCircle
} from 'lucide-react';
import { PensionStay } from '@/lib/api/services/pension/pension';

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  pensionStay: PensionStay;
  onCheckout: (id: string, checkoutData: any) => void;
  calculateExtraCharges: (stay: PensionStay) => number;
  getStayDuration: (stay: PensionStay) => number;
}

export default function CheckoutForm({ 
  isOpen, 
  onClose, 
  pensionStay,
  onCheckout,
  calculateExtraCharges,
  getStayDuration
}: CheckoutFormProps) {
  const [checkOutDate, setCheckOutDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkOutTime, setCheckOutTime] = useState(
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  );
  const [extraCharges, setExtraCharges] = useState(calculateExtraCharges(pensionStay));
  const [isPaid, setIsPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [errors, setErrors] = useState<any>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate total
  const stayDuration = getStayDuration(pensionStay);
  const baseTotal = pensionStay.baseRate * stayDuration;
  const servicesTotal = pensionStay.pendingServices?.reduce((sum, service) => sum + service.price, 0) || 0;
  const totalAmount = baseTotal + extraCharges + servicesTotal;

  const validateForm = () => {
    const newErrors: any = {};

    if (!checkOutDate) {
      newErrors.checkOutDate = 'La fecha de salida es requerida';
    }

    if (!checkOutTime) {
      newErrors.checkOutTime = 'La hora de salida es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      const checkoutData = {
        checkOutDate,
        checkOutTime,
        extraCharges,
        totalCharged: totalAmount,
        isPaid,
        paymentMethod
      };

      await onCheckout(pensionStay.id, checkoutData);
      onClose();
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Finalizar Estancia
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Stay Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Resumen de Estancia</h3>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Cliente:</span>
                      <span>{pensionStay.client?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Mascota:</span>
                      <span>{pensionStay.pet?.name} ({pensionStay.pet?.breed})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Jaula:</span>
                      <span>#{pensionStay.cage?.number} ({
                        pensionStay.cage?.size === 'small' ? 'Pequeña' : 
                        pensionStay.cage?.size === 'medium' ? 'Mediana' : 'Grande'
                      })</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Ingreso:</span>
                      <span>{pensionStay.checkInDate} {pensionStay.checkInTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Salida Esperada:</span>
                      <span>{pensionStay.expectedCheckOutDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Duración:</span>
                      <span>{stayDuration} días</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Checkout Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información de Salida</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fecha de Salida *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className={`pl-10 ${errors.checkOutDate ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.checkOutDate && <p className="text-red-500 text-xs mt-1">{errors.checkOutDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hora de Salida *</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="time"
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.target.value)}
                      className={`pl-10 ${errors.checkOutTime ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.checkOutTime && <p className="text-red-500 text-xs mt-1">{errors.checkOutTime}</p>}
                </div>
              </div>
            </div>

            {/* Extra Charges */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Cargos</h3>

              {new Date(checkOutDate) > new Date(pensionStay.expectedCheckOutDate) && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm text-amber-800">
                    La fecha de salida es posterior a la esperada. Se han aplicado cargos adicionales.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Cargos Adicionales</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      step="0.01"
                      value={extraCharges}
                      onChange={(e) => setExtraCharges(parseFloat(e.target.value) || 0)}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Cargos por tiempo extra, servicios especiales, etc.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Servicios Pendientes</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {pensionStay.pendingServices && pensionStay.pendingServices.length > 0 ? (
                      <div className="space-y-2">
                        {pensionStay.pendingServices.map((service, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{service.name}</span>
                            <span className="font-medium">${service.price}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No hay servicios pendientes</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Pago</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Método de Pago</label>
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
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estado de Pago</label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={isPaid}
                      onChange={(e) => setIsPaid(e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Marcar como pagado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total */}
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tarifa Base ({stayDuration} días x ${pensionStay.baseRate}/día):</span>
                    <span className="font-medium">${baseTotal.toFixed(2)}</span>
                  </div>
                  {extraCharges > 0 && (
                    <div className="flex justify-between text-amber-600">
                      <span>Cargos Adicionales:</span>
                      <span className="font-medium">${extraCharges.toFixed(2)}</span>
                    </div>
                  )}
                  {servicesTotal > 0 && (
                    <div className="flex justify-between">
                      <span>Servicios:</span>
                      <span className="font-medium">${servicesTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Procesando...
                  </div>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Finalizar Estancia
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}