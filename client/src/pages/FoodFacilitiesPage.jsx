import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import PageTransition from '../components/PageTransition';
import { Search, MapPin, Star, Clock, Heart, Coffee, ShieldAlert, Award } from 'lucide-react';

export default function FoodFacilitiesPage() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [nearestGate, setNearestGate] = useState('A');
  const [activeTab, setActiveTab] = useState('food'); // 'food' | 'facilities'

  // Dynamic i18n Dictionary for self-contained translations
  const dict = {
    en: {
      foodFacilities: 'Food & Facilities',
      concessionsTitle: 'Stadium Concessions & Conveniences',
      concessionsSubtitle: 'Find refreshments, water stations, restrooms, prayer spaces, and medical facilities near your section.',
      tabFood: '🍔 Food Concessions',
      tabFacilities: '🚻 Stadium Facilities',
      searchPlaceholder: 'Search concessions or menu items...',
      nearestGateLabel: 'Select Nearest Entry Gate',
      gateRecHeading: 'Concessions Near Gate',
      gateRecDesc: 'Recommended food stalls closest to your gate with real-time wait estimates.',
      caloriesLabel: 'Calories',
      waitLabel: 'wait',
      filterAll: 'All Concessions',
      filterFastFood: 'Fast Food',
      filterBeverages: 'Beverages',
      filterHealthy: 'Healthy Options',
      filterVIP: 'VIP Lounges',
      queueShort: 'Short queue',
      queueMedium: 'Moderate queue',
      queueLong: 'Long queue',
      queueNone: 'No queue',
      caloriesHigh: 'High',
      caloriesMedium: 'Medium',
      caloriesLow: 'Low',
    },
    es: {
      foodFacilities: 'Alimentos y Servicios',
      concessionsTitle: 'Concesiones y Comodidades del Estadio',
      concessionsSubtitle: 'Encuentre refrigerios, estaciones de agua, baños, salas de oración y centros médicos cerca de su sección.',
      tabFood: '🍔 Concesiones de Comida',
      tabFacilities: '🚻 Servicios del Estadio',
      searchPlaceholder: 'Buscar concesiones o menús...',
      nearestGateLabel: 'Seleccionar Puerta de Entrada más Cercana',
      gateRecHeading: 'Concesiones Cerca de la Puerta',
      gateRecDesc: 'Puestos de comida recomendados más cercanos a su puerta con tiempos estimados de espera en tiempo real.',
      caloriesLabel: 'Calorías',
      waitLabel: 'de espera',
      filterAll: 'Todas las Concesiones',
      filterFastFood: 'Comida Rápida',
      filterBeverages: 'Bebidas',
      filterHealthy: 'Opciones Saludables',
      filterVIP: 'Salas VIP',
      queueShort: 'Corta cola',
      queueMedium: 'Cola moderada',
      queueLong: 'Larga cola',
      queueNone: 'Sin cola',
      caloriesHigh: 'Alta',
      caloriesMedium: 'Media',
      caloriesLow: 'Baja',
    },
    pt: {
      foodFacilities: 'Comida e Instalações',
      concessionsTitle: 'Concessões e Conveniências do Estádio',
      concessionsSubtitle: 'Encontre bebidas, postos de água, banheiros, salas de oração e postos médicos perto da sua seção.',
      tabFood: '🍔 Concessões de Comida',
      tabFacilities: '🚻 Instalações do Estádio',
      searchPlaceholder: 'Buscar concessões ou itens do menu...',
      nearestGateLabel: 'Selecione o Portão de Entrada mais Próximo',
      gateRecHeading: 'Concessões Perto do Portão',
      gateRecDesc: 'Barracas de comida recomendadas mais próximas do seu portão com tempos estimados de espera em tempo real.',
      caloriesLabel: 'Calorias',
      waitLabel: 'de espera',
      filterAll: 'Todas as Concessões',
      filterFastFood: 'Fast Food',
      filterBeverages: 'Bebidas',
      filterHealthy: 'Opções Saudáveis',
      filterVIP: 'Salas VIP',
      queueShort: 'Fila curta',
      queueMedium: 'Fila moderada',
      queueLong: 'Fila longa',
      queueNone: 'Sem fila',
      caloriesHigh: 'Alta',
      caloriesMedium: 'Média',
      caloriesLow: 'Baixa',
    }
  };

  const l = dict[language] || dict.en;

  const concessions = [
    {
      name: language === 'es' ? 'Patio de Comidas Fan FIFA' : language === 'pt' ? 'Praça de Alimentação Fan FIFA' : 'FIFA Fan Food Court',
      distance: '120m',
      queue: 'Short',
      waitMin: 5,
      rating: 4.2,
      items: language === 'es' ? 'Hot Dogs, Hamburguesas, Cerveza, Refrescos' : language === 'pt' ? 'Cachorro-quente, Hambúrguer, Cerveja, Refrigerantes' : 'Hot Dogs, Burgers, Beer, Soft Drinks',
      type: 'food',
      gate: 'A',
      calories: 'High'
    },
    {
      name: language === 'es' ? 'Concesión Club Premium VIP' : language === 'pt' ? 'Concessão Club Premium VIP' : 'Premium Club Concession',
      distance: '80m',
      queue: 'None',
      waitMin: 1,
      rating: 4.7,
      items: language === 'es' ? 'Hamburguesas Gourmet, Cerveza Artesanal, Ensaladas' : language === 'pt' ? 'Hambúrgueres Gourmet, Cerveja Artesanal, Saladas' : 'Gourmet Sliders, Craft Beer, Salads',
      type: 'vip',
      gate: 'B',
      calories: 'Medium'
    },
    {
      name: language === 'es' ? 'Puesto de Comida Norte' : language === 'pt' ? 'Barraca de Alimentação Norte' : 'North Concession Stand',
      distance: '250m',
      queue: 'Medium',
      waitMin: 12,
      rating: 3.9,
      items: language === 'es' ? 'Tacos, Nachos, Quesadillas, Refrescos' : language === 'pt' ? 'Tacos, Nachos, Quesadillas, Refrigerantes' : 'Tacos, Nachos, Quesadillas, Soda',
      type: 'food',
      gate: 'E',
      calories: 'Medium'
    },
    {
      name: language === 'es' ? 'Pizzería Eastside' : language === 'pt' ? 'Pizzaria Eastside' : 'Eastside Pizza Parlor',
      distance: '180m',
      queue: 'Long',
      waitMin: 18,
      rating: 4.5,
      items: language === 'es' ? 'Rebanadas de Pizza, Nudos de Pretzel, Refrescos, Cerveza' : language === 'pt' ? 'Fatias de Pizza, Pretzel, Refrigerantes, Cerveja' : 'Pizza Slices, Pretzel Knots, Soda, Beer',
      type: 'food',
      gate: 'C',
      calories: 'High'
    },
    {
      name: language === 'es' ? 'Bar de Ensaladas Healthy Kick' : language === 'pt' ? 'Bar de Saladas Healthy Kick' : 'Healthy Kick Salad Bar',
      distance: '300m',
      queue: 'Short',
      waitMin: 3,
      rating: 4.6,
      items: language === 'es' ? 'Wraps, Ensaladas Orgánicas, Batidos' : language === 'pt' ? 'Wraps, Saladas Orgânicas, Smoothies' : 'Wraps, Organic Salads, Smoothies',
      type: 'healthy',
      gate: 'D',
      calories: 'Low'
    },
    {
      name: language === 'es' ? 'Café Brew & Pitch' : language === 'pt' ? 'Café Brew & Pitch' : 'Brew & Pitch Coffee',
      distance: '140m',
      queue: 'Medium',
      waitMin: 6,
      rating: 4.1,
      items: language === 'es' ? 'Espresso, Latte Helado, Repostería, Muffins' : language === 'pt' ? 'Café Expresso, Latte Gelado, Doces, Muffins' : 'Espresso, Iced Latte, Pastries, Muffins',
      type: 'beverages',
      gate: 'F',
      calories: 'Low'
    },
  ];

  const facilities = [
    {
      name: language === 'es' ? 'Banco de Ascensores Norte' : language === 'pt' ? 'Banco de Elevadores Norte' : 'North Elevator Bank',
      location: language === 'es' ? 'Puerta A – Corredor E' : language === 'pt' ? 'Portão A – Corredor E' : 'Gate A – E Concourse',
      type: 'elevator',
      desc: language === 'es' ? 'Ascensor prioritario accesible para sillas de ruedas y personas mayores.' : language === 'pt' ? 'Elevador prioritário acessível para cadeirantes e idosos.' : 'Accessible priority elevator for wheelchairs & senior citizens.'
    },
    {
      name: language === 'es' ? 'Sala Sensorial Tranquila' : language === 'pt' ? 'Sala Sensorial Tranquila' : 'Sensory Room',
      location: language === 'es' ? 'Puerta F, Nivel Superior' : language === 'pt' ? 'Portão F, Nível Superior' : 'Gate F, Upper Level',
      type: 'sensory',
      desc: language === 'es' ? 'Espacio insonorizado para alivio sensorial y relajación.' : language === 'pt' ? 'Espaço com isolamento acústico para alívio sensorial.' : 'Sound-proofed quiet space for sensory relief and calming tools.'
    },
    {
      name: language === 'es' ? 'Sala de Oración Multiconfesional' : language === 'pt' ? 'Sala de Oração Multifé' : 'Prayer Room',
      location: language === 'es' ? 'Puerta B, Nivel 2' : language === 'pt' ? 'Portão B, Nível 2' : 'Gate B, Level 2',
      type: 'prayer',
      desc: language === 'es' ? 'Zona silenciosa para rezar y meditar en el estadio.' : language === 'pt' ? 'Zona silenciosa para orações e meditação.' : 'Quiet multifaith prayer and meditation zone.'
    },
    {
      name: language === 'es' ? 'Estación de Agua Filtrada' : language === 'pt' ? 'Posto de Reabastecimento de Água' : 'Water Refill Station',
      location: language === 'es' ? 'Cerca del Patio de Comidas Central' : language === 'pt' ? 'Perto da Praça de Alimentação Central' : 'Near Central Food Court',
      type: 'water',
      desc: language === 'es' ? 'Estación de hidratación gratuita con agua filtrada. ¡Evita el plástico!' : language === 'pt' ? 'Posto de hidratação gratuito com água filtrada.' : 'Free filtered water hydration station. Go plastic-free!'
    },
    {
      name: language === 'es' ? 'Estación de Carga de Celulares' : language === 'pt' ? 'Posto de Carregamento' : 'Charging Station',
      location: language === 'es' ? 'Corredor de Puertas A, C, D' : language === 'pt' ? 'Corredor dos Portões A, C, D' : 'Gate A, C, D Concourse',
      type: 'charging',
      desc: language === 'es' ? 'Postos de carga rápida inalámbrica y USB para teléfonos.' : language === 'pt' ? 'Postos de carregamento USB rápidos e sem fio para celular.' : 'High-speed USB and wireless phone charging stations.'
    },
    {
      name: language === 'es' ? 'Centro de Primeros Auxilios' : language === 'pt' ? 'Posto Médico / Primeiros Socorros' : 'First Aid Center',
      location: language === 'es' ? 'Puerta D, Nivel del Suelo' : language === 'pt' ? 'Portão D, Nível Térreo' : 'Gate D, Ground level',
      type: 'medical',
      desc: language === 'es' ? 'Apoyo médico de la Cruz Roja las 24 horas y desfibriladores.' : language === 'pt' ? 'Suporte de primeiros socorros 24/7 da Cruz Vermelha.' : '24/7 Red Cross medical support, ambulances, and devices.'
    },
  ];

  // Filtering logic
  const filteredConcessions = concessions.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.items.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || item.type === category;
    return matchesSearch && matchesCategory;
  });

  const getQueueBadge = (q) => {
    if (q === 'Long') return { bg: '#FFF0F1', color: '#E63946', label: l.queueLong };
    if (q === 'Medium') return { bg: '#FFF8DD', color: '#B8860B', label: l.queueMedium };
    if (q === 'None') return { bg: '#E8F8EF', color: '#00A651', label: l.queueNone };
    return { bg: '#E8F8EF', color: '#00A651', label: l.queueShort };
  };

  const getCaloriesLabel = (c) => {
    if (c === 'High') return l.caloriesHigh;
    if (c === 'Medium') return l.caloriesMedium;
    return l.caloriesLow;
  };

  const getFilteredByGate = () => {
    return concessions.filter(c => c.gate === nearestGate);
  };

  return (
    <PageTransition>
      <div className="page-container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        
        {/* Header */}
        <div className="section-header">
          <span className="section-badge" style={{ background: '#EAF4FF', color: '#0057B8' }}>{l.foodFacilities}</span>
          <h1 className="section-title">{l.concessionsTitle}</h1>
          <p className="section-subtitle">
            {l.concessionsSubtitle}
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: 32 }}>
          <button
            onClick={() => setActiveTab('food')}
            style={{
              padding: '12px 24px', background: 'transparent',
              border: 'none', borderBottom: activeTab === 'food' ? '3px solid #0057B8' : '3px solid transparent',
              color: activeTab === 'food' ? '#0057B8' : '#6B7280',
              fontWeight: 700, fontSize: 16, cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {l.tabFood}
          </button>
          <button
            onClick={() => setActiveTab('facilities')}
            style={{
              padding: '12px 24px', background: 'transparent',
              border: 'none', borderBottom: activeTab === 'facilities' ? '3px solid #0057B8' : '3px solid transparent',
              color: activeTab === 'facilities' ? '#0057B8' : '#6B7280',
              fontWeight: 700, fontSize: 16, cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {l.tabFacilities}
          </button>
        </div>

        {activeTab === 'food' ? (
          <div>
            {/* Quick Gate Lookup */}
            <div className="glass-card" style={{ padding: 24, marginBottom: 32, border: '1px solid rgba(0,87,184,0.1)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                <div>
                  <h3 style={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#1F2937' }}>
                    📍 {l.gateRecHeading}
                  </h3>
                  <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
                    {l.gateRecDesc}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{l.nearestGateLabel}:</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['A', 'B', 'C', 'D', 'E', 'F'].map(gate => (
                      <button
                        key={gate}
                        onClick={() => setNearestGate(gate)}
                        style={{
                          width: 36, height: 36, borderRadius: 8, border: 'none',
                          background: nearestGate === gate ? '#0057B8' : '#F3F4F6',
                          color: nearestGate === gate ? 'white' : '#4B5563',
                          fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s'
                        }}
                      >
                        {gate}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gate recommendations results */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 20 }}>
                {getFilteredByGate().map(item => {
                  const badge = getQueueBadge(item.queue);
                  return (
                    <motion.div
                      layout
                      key={item.name}
                      style={{ padding: 16, borderRadius: 12, border: '1px solid #E5E7EB', background: '#F9FAFB' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: '#1F2937' }}>{item.name}</span>
                        <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: badge.bg, color: badge.color, fontWeight: 700 }}>
                          {badge.label}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>{item.items}</div>
                      <div style={{ display: 'flex', gap: 16, fontSize: 11, fontWeight: 600, color: '#4B5563' }}>
                        <span>⏱️ {item.waitMin}m {l.waitLabel}</span>
                        <span>🚶 {item.distance}</span>
                        <span>⭐ {item.rating}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Filter and Search controls */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              {/* Category Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[
                  { id: 'all', label: l.filterAll },
                  { id: 'food', label: l.filterFastFood },
                  { id: 'beverages', label: l.filterBeverages },
                  { id: 'healthy', label: l.filterHealthy },
                  { id: 'vip', label: l.filterVIP }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    style={{
                      padding: '8px 16px', borderRadius: 50, border: 'none',
                      background: category === cat.id ? '#0057B8' : 'white',
                      color: category === cat.id ? 'white' : '#4B5563',
                      border: '1px solid #E5E7EB', fontWeight: 600, fontSize: 13,
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', width: '100%', maxWidth: 300 }}>
                <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: 14, top: 11 }} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={l.searchPlaceholder}
                  style={{
                    width: '100%', padding: '10px 14px 10px 38px', borderRadius: 50,
                    border: '1px solid #E5E7EB', outline: 'none', fontSize: 13
                  }}
                />
              </div>
            </div>

            {/* Concession Cards Grid */}
            <div className="cards-grid">
              <AnimatePresence>
                {filteredConcessions.map((item, idx) => {
                  const badge = getQueueBadge(item.queue);
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      key={item.name}
                      className="glass-card"
                      style={{ padding: 24, display: 'flex', flexDirection: 'column' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <span style={{ fontSize: 24 }}>
                          {item.type === 'food' ? '🍔' : item.type === 'beverages' ? '🥤' : item.type === 'vip' ? '🍷' : '🥗'}
                        </span>
                        <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 50, background: badge.bg, color: badge.color, fontWeight: 700 }}>
                          {badge.label}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 700, color: '#1F2937', margin: '0 0 6px' }}>
                        {item.name}
                      </h3>
                      <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 16px', flexGrow: 1, lineHeight: 1.4 }}>
                        {item.items}
                      </p>

                      <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#4B5563' }}>
                        <div style={{ display: 'flex', gap: 14 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={13} color="#0057B8" /> {item.waitMin}m
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <MapPin size={13} color="#00A651" /> Gate {item.gate} ({item.distance})
                          </span>
                        </div>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                          <Star size={13} color="#FFD447" fill="#FFD447" /> {item.rating}
                        </span>
                      </div>
                      <div style={{ marginTop: 10, fontSize: 11, color: '#9CA3AF', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{l.caloriesLabel}: <strong>{getCaloriesLabel(item.calories)}</strong></span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* Facilities Tab */
          <div className="cards-grid">
            {facilities.map((fac, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={fac.name}
                className="glass-card"
                style={{ padding: 24 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: fac.type === 'medical' ? '#FFF0F1' : fac.type === 'water' ? '#E8F8EF' : '#EAF4FF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
                  }}>
                    {fac.type === 'elevator' ? '🛗' : fac.type === 'sensory' ? '🧘' : fac.type === 'prayer' ? '🕌' : fac.type === 'water' ? '💧' : fac.type === 'charging' ? '⚡' : '🏥'}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0057B8', background: '#EAF4FF', padding: '4px 10px', borderRadius: 50 }}>
                    {fac.location}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'Poppins', fontSize: 16, fontWeight: 700, color: '#1F2937', margin: '0 0 8px' }}>
                  {fac.name}
                </h3>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                  {fac.desc}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
