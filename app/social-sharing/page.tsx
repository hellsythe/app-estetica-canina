'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SocialContentForm from '@/components/forms/SocialContentForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Share2, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit,
  Facebook,
  MessageCircle,
  Instagram,
  Twitter,
  Copy,
  Eye,
  Heart,
  MessageSquare,
  ExternalLink,
  Image,
  Scissors,
  Package,
  Ticket,
  Calendar,
  Download,
  QrCode,
  Trash2
} from 'lucide-react';

export default function SocialSharingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  const [shareableContent, setShareableContent] = useState([
    {
      id: 1,
      type: 'service',
      title: 'Baño y Corte Completo',
      description: '¡Dale a tu mascota el cuidado que se merece! Servicio completo de baño, corte y cuidado de uñas.',
      price: 45,
      image: 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Servicios',
      platforms: ['facebook', 'whatsapp', 'instagram'],
      shares: 24,
      clicks: 156,
      createdDate: '2024-01-15'
    },
    {
      id: 2,
      type: 'product',
      title: 'Champú Antipulgas Premium',
      description: 'Protege a tu mascota con nuestro champú antipulgas de alta calidad. ¡Resultados garantizados!',
      price: 25.99,
      image: 'https://images.pexels.com/photos/6568946/pexels-photo-6568946.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Productos',
      platforms: ['facebook', 'whatsapp'],
      shares: 18,
      clicks: 89,
      createdDate: '2024-01-12'
    },
    {
      id: 3,
      type: 'coupon',
      title: 'Descuento de Bienvenida 20%',
      description: '¡Nuevos clientes obtienen 20% de descuento en su primera visita! Código: BIENVENIDO20',
      discount: '20%',
      image: 'https://images.pexels.com/photos/4587955/pexels-photo-4587955.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Cupones',
      platforms: ['facebook', 'whatsapp', 'instagram', 'twitter'],
      shares: 45,
      clicks: 234,
      createdDate: '2024-01-10'
    },
    {
      id: 4,
      type: 'service',
      title: 'Spa Canino Premium',
      description: 'Experiencia de relajación completa para tu mascota. Incluye masajes, aromaterapia y más.',
      price: 85,
      image: 'https://images.pexels.com/photos/4587971/pexels-photo-4587971.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Servicios',
      platforms: ['instagram', 'facebook'],
      shares: 32,
      clicks: 178,
      createdDate: '2024-01-08'
    },
    {
      id: 5,
      type: 'promotion',
      title: 'Promoción Fin de Semana',
      description: '¡Sábados y domingos con descuentos especiales! No te pierdas nuestras ofertas de fin de semana.',
      discount: '15%',
      image: 'https://images.pexels.com/photos/4587984/pexels-photo-4587984.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Promociones',
      platforms: ['facebook', 'whatsapp', 'instagram'],
      shares: 28,
      clicks: 145,
      createdDate: '2024-01-05'
    }
  ]);

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      textColor: 'text-blue-600',
      shares: 89,
      engagement: '4.2%'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-600',
      textColor: 'text-green-600',
      shares: 156,
      engagement: '8.7%'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-pink-600',
      textColor: 'text-pink-600',
      shares: 67,
      engagement: '6.1%'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-600',
      textColor: 'text-sky-600',
      shares: 23,
      engagement: '2.8%'
    }
  ];

  const filteredContent = shareableContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    return matchesSearch && content.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleAddContent = () => {
    setSelectedContent(null);
    setIsFormOpen(true);
  };

  const handleEditContent = (content: any) => {
    setSelectedContent(content);
    setIsFormOpen(true);
  };

  const handleSaveContent = (contentData: any) => {
    if (selectedContent) {
      // Update existing content
      setShareableContent(prev => prev.map(content => 
        content.id === contentData.id ? contentData : content
      ));
    } else {
      // Add new content
      setShareableContent(prev => [...prev, contentData]);
    }
  };

  const handleDeleteContent = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
      setShareableContent(prev => prev.filter(content => content.id !== id));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'service':
        return <Scissors className="h-4 w-4" />;
      case 'product':
        return <Package className="h-4 w-4" />;
      case 'coupon':
        return <Ticket className="h-4 w-4" />;
      case 'promotion':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Share2 className="h-4 w-4" />;
    }
  };

  const generateShareUrl = (platform: string, content: any) => {
    const baseUrl = 'https://petstyle.com';
    const text = `${content.title} - ${content.description}`;
    const url = `${baseUrl}/share/${content.id}`;

    switch (platform) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
      case 'whatsapp':
        return `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
      case 'instagram':
        return `https://www.instagram.com/`; // Instagram no permite compartir directo, se abre la app
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      default:
        return url;
    }
  };

  const handleShare = (platform: string, content: any) => {
    const shareUrl = generateShareUrl(platform, content);
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = (content: any) => {
    const text = `${content.title} - ${content.description} https://petstyle.com/share/${content.id}`;
    navigator.clipboard.writeText(text);
  };

  const totalShares = shareableContent.reduce((sum, content) => sum + content.shares, 0);
  const totalClicks = shareableContent.reduce((sum, content) => sum + content.clicks, 0);
  const avgEngagement = socialPlatforms.reduce((sum, platform) => sum + parseFloat(platform.engagement), 0) / socialPlatforms.length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compartir en Redes Sociales</h1>
            <p className="text-gray-600">Comparte productos, servicios y promociones en redes sociales</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddContent}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Contenido
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar contenido para compartir..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
            >
              Todos
            </Button>
            <Button 
              variant={selectedCategory === 'servicios' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('servicios')}
            >
              Servicios
            </Button>
            <Button 
              variant={selectedCategory === 'productos' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('productos')}
            >
              Productos
            </Button>
            <Button 
              variant={selectedCategory === 'cupones' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('cupones')}
            >
              Cupones
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Compartidos</CardTitle>
              <Share2 className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalShares}</div>
              <p className="text-xs text-gray-500">Este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clics Generados</CardTitle>
              <Eye className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClicks}</div>
              <p className="text-xs text-gray-500">Visitas desde redes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Promedio</CardTitle>
              <Heart className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgEngagement.toFixed(1)}%</div>
              <p className="text-xs text-gray-500">Interacción promedio</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plataformas Activas</CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{socialPlatforms.length}</div>
              <p className="text-xs text-gray-500">Redes conectadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Social Platforms Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {socialPlatforms.map((platform) => (
                <div key={platform.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${platform.color}`}>
                      <platform.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{platform.name}</h3>
                      <p className="text-sm text-gray-600">{platform.shares} compartidos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${platform.textColor}`}>{platform.engagement}</p>
                    <p className="text-xs text-gray-500">Engagement</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shareable Content */}
        <Card>
          <CardHeader>
            <CardTitle>Contenido para Compartir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredContent.map((content) => (
                <div key={content.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={content.image}
                        alt={content.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getTypeIcon(content.type)}
                        <h3 className="font-semibold text-gray-900">{content.title}</h3>
                        <Badge variant="outline">{content.category}</Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{content.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {content.price && (
                            <span className="font-bold text-green-600">${content.price}</span>
                          )}
                          {content.discount && (
                            <span className="font-bold text-red-600">{content.discount} OFF</span>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Share2 className="h-4 w-4" />
                            <span>{content.shares} compartidos</span>
                            <Eye className="h-4 w-4 ml-2" />
                            <span>{content.clicks} clics</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {/* Social Platform Buttons */}
                          {content.platforms.includes('facebook') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShare('facebook', content)}
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <Facebook className="h-4 w-4" />
                            </Button>
                          )}
                          {content.platforms.includes('whatsapp') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShare('whatsapp', content)}
                              className="text-green-600 hover:bg-green-50"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {content.platforms.includes('instagram') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShare('instagram', content)}
                              className="text-pink-600 hover:bg-pink-50"
                            >
                              <Instagram className="h-4 w-4" />
                            </Button>
                          )}
                          {content.platforms.includes('twitter') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShare('twitter', content)}
                              className="text-sky-600 hover:bg-sky-50"
                            >
                              <Twitter className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(content)}
                            title="Copiar enlace"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          
                          <Button variant="ghost" size="sm" onClick={() => handleEditContent(content)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteContent(content.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleAddContent}>
            <CardContent className="p-6 text-center">
              <Plus className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold mb-1">Crear Post</h3>
              <p className="text-sm text-gray-600">Nuevo contenido para redes</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <QrCode className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold mb-1">Códigos QR</h3>
              <p className="text-sm text-gray-600">Generar códigos QR</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Image className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold mb-1">Plantillas</h3>
              <p className="text-sm text-gray-600">Diseños predefinidos</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Download className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <h3 className="font-semibold mb-1">Descargar</h3>
              <p className="text-sm text-gray-600">Imágenes para redes</p>
            </CardContent>
          </Card>
        </div>

        {/* Social Content Form Modal */}
        <SocialContentForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          content={selectedContent}
          onSave={handleSaveContent}
        />
      </div>
    </DashboardLayout>
  );
}