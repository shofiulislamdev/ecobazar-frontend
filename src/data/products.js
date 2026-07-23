/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const PRESET_PRODUCTS = [
  // ELECTRONICS
  {
    _id: 'p1',
    name: 'AeroSound Pro Noise-Cancelling Headphones',
    description: 'Immersive sound engineering with custom magnetic dynamic drivers and 45-hour active battery life.',
    price: 299,
    discountPrice: 249,
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=60'
    ],
    stock: 12,
    ratings: 4.8,
    numReviews: 124,
    sku: 'SKU-AERO-PRO-01',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'p5',
    name: 'LuminaTab Ultra OLED Digital Tablet',
    description: 'Ultra-thin 12.9-inch OLED display with pressure-sensitive stylus support and high refresh rate for digital art and productivity.',
    price: 649,
    discountPrice: 599,
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=60'
    ],
    stock: 10,
    ratings: 4.9,
    numReviews: 88,
    sku: 'SKU-LUMINA-TAB-05',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'p6',
    name: 'Horizon Pure-Sound Wireless Speaker',
    description: 'Portable waterproof Bluetooth speaker with 360-degree spatial acoustic bass and 20-hour playback resilience.',
    price: 129,
    discountPrice: 99,
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=60'
    ],
    stock: 25,
    ratings: 4.7,
    numReviews: 156,
    sku: 'SKU-HORIZON-SPK-06',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'p7',
    name: 'PulseFit Smart Fitness Tracker Watch',
    description: 'Continuous biometric tracking, OLED health stats display, GPS navigation, and 14-day standby stamina.',
    price: 159,
    discountPrice: 129,
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=60'
    ],
    stock: 18,
    ratings: 4.8,
    numReviews: 210,
    sku: 'SKU-PULSE-FIT-07',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'p8',
    name: 'Mechanical Keycraft RGB Gaming Keyboard',
    description: 'Precision mechanical switches with customizable RGB lighting per key and anodized aircraft aluminum frame.',
    price: 135,
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=60'
    ],
    stock: 14,
    ratings: 4.6,
    numReviews: 95,
    sku: 'SKU-KEYCRAFT-RGB-08',
    createdAt: new Date().toISOString()
  },

  // APPAREL
  {
    _id: 'p4',
    name: 'BreezeFit Knit Performance Running Sneakers',
    description: 'Engineered lightweight matrix mesh upper body matched with nitrogen-infused hyper-rebound sole systems.',
    price: 145,
    category: 'apparel',
    images: [
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=60'
    ],
    stock: 15,
    ratings: 4.6,
    numReviews: 180,
    sku: 'SKU-BREEZE-RUN-04',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'p10',
    name: 'Urban Flex Organic Cotton Pullover Hoodie',
    description: 'Heavyweight organic French terry cotton hoodie featuring double-stitched reinforced seams and cozy fit.',
    price: 85,
    discountPrice: 69,
    category: 'apparel',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=60'
    ],
    stock: 30,
    ratings: 4.7,
    numReviews: 142,
    sku: 'SKU-URBAN-HOOD-10',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'p11',
    name: 'All-Weather Waterproof Trail Parka Jacket',
    description: 'Breathable 3-layer weatherproof shell designed for extreme outdoors with adjustable storm hood and sealed zippers.',
    price: 195,
    discountPrice: 160,
    category: 'apparel',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=60'
    ],
    stock: 9,
    ratings: 4.9,
    numReviews: 76,
    sku: 'SKU-TRAIL-PARKA-11',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'p12',
    name: 'Tailored Slim-Fit Merino Wool Blazer',
    description: 'Premium Italian merino wool weave tailored with a structured modern profile for smart casual and formal wear.',
    price: 240,
    category: 'apparel',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=800&auto=format&fit=crop&q=60'
    ],
    stock: 7,
    ratings: 4.8,
    numReviews: 64,
    sku: 'SKU-WOOL-BLAZER-12',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'p13',
    name: 'AirMesh Breathable Athletic Training Shorts',
    description: 'Moisture-wicking 4-way stretch fabric equipped with built-in compression lining and hidden zipped phone storage.',
    price: 48,
    category: 'apparel',
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=60'
    ],
    stock: 40,
    ratings: 4.5,
    numReviews: 118,
    sku: 'SKU-AIRMESH-SHORTS-13',
    createdAt: new Date().toISOString()
  },

  // ACCESSORIES
  {
    _id: 'p2',
    name: 'ChronoClassic Obsidian Minimalist Watch',
    description: 'Precision Japanese quartz movement housed in scratch-resistant premium sapphire glass and surgical steel.',
    price: 189,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&auto=format&fit=crop&q=60'
    ],
    stock: 8,
    ratings: 4.9,
    numReviews: 92,
    sku: 'SKU-CHRONO-OBS-02',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'p3',
    name: 'Vanguard Premium Waterproof Backpack',
    description: 'Weatherproof military-grade ballistic nylon outer casing with intelligent 16-inch laptop chamber allocation.',
    price: 110,
    discountPrice: 89,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=800&auto=format&fit=crop&q=60'
    ],
    stock: 20,
    ratings: 4.7,
    numReviews: 215,
    sku: 'SKU-VAN-BACK-03',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'p15',
    name: 'Polarized Matte Black Aviator Sunglasses',
    description: 'UV400 polarized anti-glare optical lenses with ultra-light titanium frame and comfortable silicone nose grips.',
    price: 130,
    discountPrice: 105,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=60'
    ],
    stock: 16,
    ratings: 4.8,
    numReviews: 135,
    sku: 'SKU-AVIATOR-SUN-15',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'p16',
    name: 'Artisan Genuine Leather Bi-Fold Wallet',
    description: 'Full-grain vegetable-tanned leather wallet with RFID blocking technology and slim card slot organization.',
    price: 65,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=60'
    ],
    stock: 22,
    ratings: 4.7,
    numReviews: 108,
    sku: 'SKU-LEATHER-WLT-16',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'p17',
    name: 'Voyager Leather Travel Crossbody Sling',
    description: 'Compact hand-stitched leather sling bag designed for passport, smartphone, camera, and travel essentials.',
    price: 95,
    discountPrice: 79,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=60'
    ],
    stock: 11,
    ratings: 4.6,
    numReviews: 84,
    sku: 'SKU-VOYAGER-SLING-17',
    createdAt: new Date().toISOString()
  },

  // HOME DECOR
  {
    _id: 'p18',
    name: 'Nordic Ceramic Minimalist Table Lamp',
    description: 'Warm ambient LED light encysted in a hand-thrown ceramic base with matte linen shade.',
    price: 78,
    category: 'home',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=60'
    ],
    stock: 14,
    ratings: 4.8,
    numReviews: 62,
    sku: 'SKU-NORDIC-LAMP-18',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'p19',
    name: 'Handcrafted Ceramic Matte Coffee Mug',
    description: 'Ergonomic ceramic mug crafted for comfortable hold and heat retention during morning brew sessions.',
    price: 28,
    category: 'home',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=60'
    ],
    stock: 35,
    ratings: 4.9,
    numReviews: 190,
    sku: 'SKU-CERAMIC-MUG-19',
    createdAt: new Date().toISOString()
  }
];
