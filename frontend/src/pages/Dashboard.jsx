import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="font-sans text-ituka-ink">
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-ituka-cream-deep flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
           {/* Background Image Placeholder - In real app, this would be a high quality image */}
           <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-multiply"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-ituka-cream via-ituka-cream/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block py-1 px-3 border border-ituka-green rounded-full text-ituka-green text-xs font-bold uppercase tracking-widest mb-6">
              Nueva Colección 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-ituka-ink leading-tight mb-6">
              La naturaleza <br/> <span className="text-ituka-green italic">renace</span> en tu piel.
            </h1>
            <p className="text-lg text-ituka-ink-muted mb-10 max-w-md leading-relaxed">
              Descubre el poder de los ingredientes botánicos africanos en nuestra nueva línea de cuidado facial regenerativo.
            </p>
            <div className="flex gap-4">
              <Link 
                to="/products" 
                className="px-8 py-4 bg-ituka-gold text-white rounded-full font-medium hover:bg-ituka-gold/90 transition-colors shadow-lg shadow-ituka-gold/20"
              >
                Ver Productos
              </Link>
              <Link 
                to="/about" 
                className="px-8 py-4 bg-transparent border border-ituka-ink text-ituka-ink rounded-full font-medium hover:bg-ituka-ink hover:text-white transition-colors"
              >
                Nuestra Historia
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-ituka-ink mb-4">Favoritos de ITUKA</h2>
            <div className="w-24 h-1 bg-ituka-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mock Products for Home Display */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative h-96 bg-ituka-cream rounded-2xl overflow-hidden mb-6">
                  <img 
                    src={`https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`} 
                    alt="Product" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-ituka-ink">
                    Best Seller
                  </div>
                </div>
                <h3 className="text-xl font-serif font-bold text-ituka-ink group-hover:text-ituka-green transition-colors">
                  Sérum Regenerador {i}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                   <div className="flex text-ituka-gold">
                     {[...Array(5)].map((_, starI) => <Star key={starI} className="w-3 h-3 fill-current" />)}
                   </div>
                   <span className="text-xs text-stone-400">(24 reseñas)</span>
                </div>
                <p className="text-ituka-ink-muted font-medium">$45.00</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
             <Link to="/products" className="inline-flex items-center gap-2 text-ituka-green font-bold uppercase tracking-widest hover:text-ituka-ink transition-colors border-b border-ituka-green pb-1 hover:border-ituka-ink">
                Ver toda la colección <ArrowRight className="w-4 h-4" />
             </Link>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-24 bg-ituka-ink text-ituka-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
           <div className="flex-1">
             <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
               Ingredientes puros, <br/> <span className="text-ituka-gold">resultados reales.</span>
             </h2>
             <p className="text-ituka-cream/80 text-lg mb-8 max-w-lg">
               Cada gota de nuestros productos contiene la esencia de la naturaleza. Sin parabenos, sin sulfatos, 100% cruelty-free.
             </p>
             <Link to="/about" className="text-ituka-gold border-b border-ituka-gold pb-1 hover:text-white hover:border-white transition-colors">
               Conoce nuestros ingredientes
             </Link>
           </div>
           <div className="flex-1 flex gap-4">
              <div className="bg-ituka-cream/10 p-6 rounded-2xl backdrop-blur-sm border border-ituka-cream/20 flex-1 text-center">
                 <div className="text-3xl mb-2">🌱</div>
                 <h4 className="font-serif font-bold mb-2">100% Natural</h4>
                 <p className="text-sm text-ituka-cream/60">Certificado orgánico</p>
              </div>
              <div className="bg-ituka-cream/10 p-6 rounded-2xl backdrop-blur-sm border border-ituka-cream/20 flex-1 text-center">
                 <div className="text-3xl mb-2">🐰</div>
                 <h4 className="font-serif font-bold mb-2">Cruelty Free</h4>
                 <p className="text-sm text-ituka-cream/60">Respetamos la vida</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
