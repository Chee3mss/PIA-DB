// Configuraciones de auditorios y sus mapas de asientos

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'occupied' | 'selected';
  price: number;
  zone: 'vip' | 'premium' | 'general';
  section?: string; // Para auditorios con secciones (izquierda, centro, derecha)
}

export interface ZoneStructure {
  name: string;
  rows: string[];
  seatsPerRow: (number | null)[]; // null significa espacio vacío
  section?: string; // 'left', 'center', 'right'
}

export interface VenueLayout {
  name: string;
  structure: ZoneStructure[]; // Estructura por zonas
  priceZones: {
    vip: { price: number; color: string };
    premium: { price: number; color: string };
    general: { price: number; color: string };
  };
  description: string;
}

// Plantillas de auditorios con estructuras únicas
export const VENUE_LAYOUTS: Record<string, VenueLayout> = {
  // Auditorio clásico con forma de herradura
  'Auditorio Nacional': {
    name: 'Auditorio Nacional',
    description: 'Diseño clásico en herradura con palcos laterales',
    structure: [
      {
        name: 'VIP - Zona Platino',
        rows: ['A', 'B', 'C'],
        seatsPerRow: [
          10,  // A: 10 asientos centrales
          12,  // B: 12 asientos
          14   // C: 14 asientos
        ]
      },
      {
        name: 'Premium - Zona Oro',
        rows: ['D', 'E', 'F'],
        seatsPerRow: [
          14,  // D
          16,  // E: Fila más ancha
          14   // F
        ]
      },
      {
        name: 'General - Zona Plata',
        rows: ['G', 'H', 'I', 'J'],
        seatsPerRow: [
          12,  // G
          12,  // H
          10,  // I
          8    // J: Última fila más pequeña
        ]
      }
    ],
    priceZones: {
      vip: { price: 1200, color: '#FFD700' },
      premium: { price: 800, color: '#4FC3F7' },
      general: { price: 500, color: '#81C784' }
    }
  },

  // Teatro con secciones laterales y balcones
  'Teatro de la Ciudad': {
    name: 'Teatro de la Ciudad',
    description: 'Teatro con platea y palcos laterales',
    structure: [
      {
        name: 'VIP - Platea Preferencial',
        rows: ['A', 'B'],
        seatsPerRow: [8, 10]
      },
      {
        name: 'Premium - Platea Central',
        rows: ['C', 'D', 'E'],
        seatsPerRow: [12, 14, 14],
        section: 'center'
      },
      {
        name: 'Premium - Palco Izquierdo',
        rows: ['PL1', 'PL2'],
        seatsPerRow: [6, 6],
        section: 'left'
      },
      {
        name: 'Premium - Palco Derecho',
        rows: ['PR1', 'PR2'],
        seatsPerRow: [6, 6],
        section: 'right'
      },
      {
        name: 'General - Luneta',
        rows: ['F', 'G', 'H'],
        seatsPerRow: [12, 10, 8]
      }
    ],
    priceZones: {
      vip: { price: 1500, color: '#FFD700' },
      premium: { price: 1000, color: '#4FC3F7' },
      general: { price: 600, color: '#81C784' }
    }
  },

  // Arena con forma circular y múltiples secciones
  'Arena Monterrey': {
    name: 'Arena Monterrey',
    description: 'Arena con disposición circular y secciones',
    structure: [
      {
        name: 'VIP - Floor',
        rows: ['F1', 'F2', 'F3', 'F4'],
        seatsPerRow: [20, 20, 20, 20]
      },
      {
        name: 'Premium - Sección 100',
        rows: ['S1', 'S2', 'S3', 'S4'],
        seatsPerRow: [16, 16, 16, 16],
        section: 'center'
      },
      {
        name: 'Premium - Sección 101',
        rows: ['L1', 'L2', 'L3'],
        seatsPerRow: [12, 12, 12],
        section: 'left'
      },
      {
        name: 'Premium - Sección 102',
        rows: ['R1', 'R2', 'R3'],
        seatsPerRow: [12, 12, 12],
        section: 'right'
      },
      {
        name: 'General - Sección 200',
        rows: ['G1', 'G2', 'G3', 'G4'],
        seatsPerRow: [14, 14, 14, 14]
      }
    ],
    priceZones: {
      vip: { price: 2000, color: '#FFD700' },
      premium: { price: 1200, color: '#4FC3F7' },
      general: { price: 700, color: '#81C784' }
    }
  },

  // Foro masivo tipo estadio
  'Foro Sol': {
    name: 'Foro Sol',
    description: 'Estadio con múltiples niveles y zonas',
    structure: [
      {
        name: 'VIP - Pit/Floor',
        rows: ['PIT1', 'PIT2', 'PIT3'],
        seatsPerRow: [24, 24, 24]
      },
      {
        name: 'Premium - Nivel 100',
        rows: ['N1', 'N2', 'N3', 'N4', 'N5', 'N6'],
        seatsPerRow: [20, 20, 20, 20, 20, 20]
      },
      {
        name: 'General - Nivel 200',
        rows: ['N7', 'N8', 'N9', 'N10', 'N11', 'N12'],
        seatsPerRow: [18, 18, 18, 18, 18, 18]
      }
    ],
    priceZones: {
      vip: { price: 2500, color: '#FFD700' },
      premium: { price: 1500, color: '#4FC3F7' },
      general: { price: 800, color: '#81C784' }
    }
  },

  // Teatro íntimo con diseño vintage
  'Teatro Metropolitano': {
    name: 'Teatro Metropolitano',
    description: 'Teatro íntimo estilo vintage',
    structure: [
      {
        name: 'VIP - Butacas Preferentes',
        rows: ['A', 'B'],
        seatsPerRow: [8, 10]
      },
      {
        name: 'Premium - Palco Principal',
        rows: ['C', 'D'],
        seatsPerRow: [12, 12]
      },
      {
        name: 'General - Galería',
        rows: ['E', 'F'],
        seatsPerRow: [10, 8]
      }
    ],
    priceZones: {
      vip: { price: 1800, color: '#FFD700' },
      premium: { price: 1200, color: '#4FC3F7' },
      general: { price: 700, color: '#81C784' }
    }
  },

  // Centro cultural moderno
  'Centro Cultural': {
    name: 'Centro Cultural',
    description: 'Espacio moderno multiusos',
    structure: [
      {
        name: 'VIP - Zona Premium',
        rows: ['Z1', 'Z2', 'Z3'],
        seatsPerRow: [14, 14, 14]
      },
      {
        name: 'Premium - Zona Intermedia',
        rows: ['Z4', 'Z5'],
        seatsPerRow: [14, 14]
      },
      {
        name: 'General - Zona Posterior',
        rows: ['Z6', 'Z7'],
        seatsPerRow: [14, 14]
      }
    ],
    priceZones: {
      vip: { price: 1100, color: '#FFD700' },
      premium: { price: 750, color: '#4FC3F7' },
      general: { price: 450, color: '#81C784' }
    }
  }
};

// Función para generar asientos basados en la plantilla del venue
export function generateSeatsForVenue(venueName: string): Seat[] {
  const layout = VENUE_LAYOUTS[venueName];
  
  if (!layout) {
    console.warn(`No layout found for venue: ${venueName}, using default`);
    return generateDefaultSeats();
  }

  const seats: Seat[] = [];
  
  // Recorrer cada zona estructural del venue
  layout.structure.forEach((zoneStructure) => {
    // Determinar el tipo de zona basado en el nombre
    let zoneType: 'vip' | 'premium' | 'general' = 'general';
    let price = layout.priceZones.general.price;
    
    if (zoneStructure.name.includes('VIP')) {
      zoneType = 'vip';
      price = layout.priceZones.vip.price;
    } else if (zoneStructure.name.includes('Premium')) {
      zoneType = 'premium';
      price = layout.priceZones.premium.price;
    }
    
    // Generar asientos para cada fila en esta zona
    zoneStructure.rows.forEach((row, rowIndex) => {
      const seatsInRow = zoneStructure.seatsPerRow[rowIndex];
      
      if (seatsInRow === null || seatsInRow === 0) return; // Espacio vacío
      
      for (let num = 1; num <= seatsInRow; num++) {
        // Simular algunos asientos ocupados aleatoriamente (30% de probabilidad)
        const isOccupied = Math.random() > 0.7;
        
        seats.push({
          id: `${row}${num}`,
          row,
          number: num,
          status: isOccupied ? 'occupied' : 'available',
          price,
          zone: zoneType,
          section: zoneStructure.section
        });
      }
    });
  });
  
  return seats;
}

// Obtener las zonas estructurales del venue para renderizado visual
export function getVenueStructure(venueName: string) {
  const layout = VENUE_LAYOUTS[venueName];
  if (!layout) return null;
  return layout.structure;
}

// Función de respaldo para generar asientos por defecto
function generateDefaultSeats(): Seat[] {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = 12;
  
  rows.forEach((row, rowIndex) => {
    let price = 500;
    let zone: 'vip' | 'premium' | 'general' = 'general';
    
    if (rowIndex < 3) {
      price = 1200;
      zone = 'vip';
    } else if (rowIndex < 6) {
      price = 800;
      zone = 'premium';
    }
    
    for (let num = 1; num <= seatsPerRow; num++) {
      const isOccupied = Math.random() > 0.7;
      
      seats.push({
        id: `${row}${num}`,
        row,
        number: num,
        status: isOccupied ? 'occupied' : 'available',
        price,
        zone
      });
    }
  });
  
  return seats;
}

// Obtener información de zonas de precios para mostrar
export function getPriceZonesInfo(venueName: string) {
  const layout = VENUE_LAYOUTS[venueName];
  
  if (!layout) {
    return [
      { name: 'VIP', price: 1200, color: 'vip' as const },
      { name: 'Premium', price: 800, color: 'premium' as const },
      { name: 'General', price: 500, color: 'general' as const }
    ];
  }
  
  return [
    {
      name: 'VIP',
      price: layout.priceZones.vip.price,
      color: 'vip' as const
    },
    {
      name: 'Premium',
      price: layout.priceZones.premium.price,
      color: 'premium' as const
    },
    {
      name: 'General',
      price: layout.priceZones.general.price,
      color: 'general' as const
    }
  ];
}

