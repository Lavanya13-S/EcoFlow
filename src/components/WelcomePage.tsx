import React, { useEffect, useState } from 'react';
import { Droplets, BarChart3, Target, Users, Shield, ChevronDown } from 'lucide-react';

interface WelcomePageProps {
  onNavigate: (page: string) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onNavigate }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Track your water usage with intelligent insights and beautiful visualizations.',
      image: 'https://i.pinimg.com/1200x/bb/8c/f5/bb8cf5466d44b41787b176da601f4601.jpg'
    },
    {
      icon: Target,
      title: 'AI Predictions',
      description: 'Get accurate forecasts of your future water consumption with seasonal adjustments.',
      image: 'https://i.pinimg.com/736x/f3/39/9e/f3399e93e2ead763deedb3cb2b9fdd51.jpg'
    },
    {
      icon: Shield,
      title: 'Leak Detection',
      description: 'Advanced algorithms detect unusual patterns that could indicate leaks or waste.',
      image: 'https://i.pinimg.com/1200x/7a/c2/b3/7ac2b3836ce7111bd8e73982a662c643.jpg'
    },
    {
      icon: Users,
      title: 'Community Impact',
      description: 'Join thousands of users making a difference through collective water conservation.',
      image: 'https://i.pinimg.com/1200x/82/d7/73/82d773309efa68c0b435525614e8fa40.jpg'
    }
  ];

  const stats = [
    { number: '50M+', label: 'Liters Saved', icon: Droplets },
    { number: '25K+', label: 'Active Users', icon: Users },
    { number: '89%', label: 'Reduction Rate', icon: Target },
    { number: '24/7', label: 'Monitoring', icon: Shield }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                EcoFlow
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('login')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('signup')}
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with Parallax Effect */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-green-900/80 z-10" />
        
        {/* Hero Content */}
        <div className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="mb-8">
            {/* Removed AI-Powered Water Conservation badge */}
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Save Water,
              <span className="block bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Save the Future
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Track, predict, and reduce your water consumption with intelligent insights. 
              Join thousands making a real environmental impact.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <button
              onClick={() => onNavigate('signup')}
              className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-green-600 transform hover:scale-105 transition-all duration-200 shadow-2xl"
            >
              Start Saving Today
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-white/70" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Making a Real Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our community is already making a significant difference in water conservation worldwide.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Smart Conservation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to understand, predict, and optimize your water usage with cutting-edge technology.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                      </div>
                      <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-green-900/90" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of water conservationists and start your journey towards sustainable living today.
          </p>
          <button
            onClick={() => onNavigate('signup')}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-10 py-4 rounded-xl font-bold text-xl hover:from-blue-600 hover:to-green-600 transform hover:scale-105 transition-all duration-200 shadow-2xl"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">EcoFlow</h3>
            </div>
            <div className="text-gray-400">
              © 2025 EcoFlow. Making every drop count.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};