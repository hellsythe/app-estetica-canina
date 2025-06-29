'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  X,
  Save,
  Share2,
  Image,
  Scissors,
  Package,
  Ticket,
  Calendar,
  Facebook,
  MessageCircle,
  Instagram,
  Twitter,
  Upload,
  Eye
} from 'lucide-react';

interface SocialContentFormProps {
  isOpen: boolean;
  onClose: () => void;
  content?: any;
  onSave: (content: any) => void;
}

export default function SocialContentForm({ isOpen, onClose, content, onSave }: SocialContentFormProps) {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    description: content?.description || '',
    type: content?.type || 'service',
    price: content?.price || '',
    discount: content?.discount || '',
    image: content?.image || '',
    category: content?.category || 'Servicios',
    platforms: content?.platforms || ['facebook'],
    scheduledDate: content?.scheduledDate || '',
    scheduledTime: content?.scheduledTime || '',
    hashtags: content?.hashtags || '',
    callToAction: content?.callToAction || 'Agenda tu cita'
  });

  const [errors, setErrors] = useState<any>({});

  const contentTypes = [
    { value: 'service', label: 'Servicio', icon: Scissors },
    { value: 'product', label: 'Producto', icon: Package },
    { value: 'coupon', label: 'Cupón', icon: Ticket },
    { value: 'promotion', label: 'Promoción', icon: Calendar }
  ];

  const platforms = [
    { value: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-green-600' },
    { value: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
    { value: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-sky-600' }
  ];

  const predefinedImages = [
    'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/6568946/pexels-photo-6568946.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/4587955/pexels-photo-4587955.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/4587971/pexels-photo-4587971.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/4587984/pexels-photo-4587984.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];

  const hashtagSuggestions = [
    '#PetGrooming', '#DogGrooming', '#PetCare', '#DogSpa', '#PetStyle',
    '#HealthyPets', '#PetLove', '#DogLife', '#PetWellness', '#GroomingTime'
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

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => {
      const platforms = prev.platforms;
      if (platforms.includes(platform)) {
        return { ...prev, platforms: platforms.filter(p => p !== platform) };
      } else {
        return { ...prev, platforms: [...platforms, platform] };
      }
    });
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };

  const addHashtag = (hashtag: string) => {
    const currentHashtags = formData.hashtags.split(' ').filter(h => h.trim());
    if (!currentHashtags.includes(hashtag)) {
      setFormData(prev => ({
        ...prev,
        hashtags: [...currentHashtags, hashtag].join(' ')
      }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (formData.platforms.length === 0) {
      newErrors.platforms = 'Debe seleccionar al menos una plataforma';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Debe seleccionar una imagen';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const contentData = {
        ...formData,
        id: content?.id || Date.now(),
        shares: content?.shares || 0,
        clicks: content?.clicks || 0,
        createdDate: content?.createdDate || new Date().toISOString().split('T')[0]
      };
      
      onSave(contentData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              {content ? 'Editar Contenido' : 'Crear Contenido para Redes Sociales'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Tipo de Contenido</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {contentTypes.map(type => (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-colors ${
                      formData.type === type.value ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleInputChange('type', type.value)}
                  >
                    <CardContent className="p-3 text-center">
                      <type.icon className="h-6 w-6 mx-auto mb-1" />
                      <p className="text-sm font-medium">{type.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ej: Baño y Corte Completo"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Servicios">Servicios</option>
                    <option value="Productos">Productos</option>
                    <option value="Cupones">Cupones</option>
                    <option value="Promociones">Promociones</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe tu contenido de manera atractiva para redes sociales..."
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={3}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(formData.type === 'service' || formData.type === 'product') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Precio ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="45.00"
                    />
                  </div>
                )}

                {(formData.type === 'coupon' || formData.type === 'promotion') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Descuento</label>
                    <Input
                      value={formData.discount}
                      onChange={(e) => handleInputChange('discount', e.target.value)}
                      placeholder="20% OFF"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Llamada a la Acción</label>
                  <select
                    value={formData.callToAction}
                    onChange={(e) => handleInputChange('callToAction', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Agenda tu cita">Agenda tu cita</option>
                    <option value="Compra ahora">Compra ahora</option>
                    <option value="Más información">Más información</option>
                    <option value="Llama ahora">Llama ahora</option>
                    <option value="Visítanos">Visítanos</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Image Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Imagen</h3>
              
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {predefinedImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer border-2 rounded-lg overflow-hidden ${
                      formData.image === imageUrl ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleImageSelect(imageUrl)}
                  >
                    <img
                      src={imageUrl}
                      alt={`Opción ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </div>
                ))}
                <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-20 cursor-pointer hover:border-gray-400">
                  <Upload className="h-6 w-6 text-gray-400" />
                </div>
              </div>
              {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
            </div>

            {/* Platforms */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Plataformas</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {platforms.map(platform => (
                  <Card
                    key={platform.value}
                    className={`cursor-pointer transition-colors ${
                      formData.platforms.includes(platform.value) ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handlePlatformToggle(platform.value)}
                  >
                    <CardContent className="p-3 text-center">
                      <platform.icon className={`h-6 w-6 mx-auto mb-1 ${platform.color}`} />
                      <p className="text-sm font-medium">{platform.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {errors.platforms && <p className="text-red-500 text-sm">{errors.platforms}</p>}
            </div>

            {/* Hashtags */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Hashtags</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Hashtags</label>
                <Input
                  value={formData.hashtags}
                  onChange={(e) => handleInputChange('hashtags', e.target.value)}
                  placeholder="#PetGrooming #DogSpa #PetCare"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sugerencias</label>
                <div className="flex flex-wrap gap-2">
                  {hashtagSuggestions.map(hashtag => (
                    <Button
                      key={hashtag}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addHashtag(hashtag)}
                      className="text-xs"
                    >
                      {hashtag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scheduling */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Programación (Opcional)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fecha de Publicación</label>
                  <Input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hora de Publicación</label>
                  <Input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            {formData.title && formData.description && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Vista Previa</h3>
                
                <Card className="border-2 border-dashed border-gray-300">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {formData.image && (
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{formData.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{formData.description}</p>
                        {formData.price && (
                          <p className="text-lg font-bold text-green-600 mt-2">${formData.price}</p>
                        )}
                        {formData.discount && (
                          <p className="text-lg font-bold text-red-600 mt-2">{formData.discount}</p>
                        )}
                        {formData.hashtags && (
                          <p className="text-sm text-blue-600 mt-2">{formData.hashtags}</p>
                        )}
                        <Button size="sm" className="mt-2">
                          {formData.callToAction}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {content ? 'Actualizar' : 'Crear'} Contenido
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}