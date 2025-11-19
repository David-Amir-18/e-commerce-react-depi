const allDealsData = {
  'Cheapest flights': [
    { 
      id: 1, 
      img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600', 
      dest: 'Rome',
      destCode: 'FCO',
      desc: 'Budget Friendly', 
      price: '$100' 
    },
    { 
      id: 2, // Corrected ID to be unique
      img: 'https://url-shortener.me/AA8O', 
      dest: 'Athens',
      destCode: 'ATH',
      desc: 'Great Value', 
      price: '$82' 
    },
    { 
      id: 20, 
      img: 'https://images.unsplash.com/photo-1528114039593-4366cc08227d?w=600', 
      dest: 'Budapest',
      destCode: 'BUD',
      desc: 'Affordable Trip', 
      price: '$88'
    },
    { 
      id: 4, 
      img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', 
      dest: 'Dubai',
      destCode: 'DXB',
      desc: 'Best Deal', 
      price: '$92' 
    },
    { 
      id: 5, 
      img: 'https://url-shortener.me/A9ZY', 
      dest: 'Istanbul',
      destCode: 'IST',
      desc: 'Budget Option', 
      price: '$95' 
    },
    { 
      id: 6, 
      img: 'https://url-shortener.me/AA0A', 
      dest: 'Lisbon',
      destCode: 'LIS',
      desc: 'Low Cost', 
      price: '$98' 
    },
  ],
  
  'Direct flights': [
    { 
      id: 7, 
      img: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600', 
      dest: 'Berlin',
      destCode: 'BER',
      desc: 'Non-Stop Flight', 
      price: '$120' 
    },
    { 
      id: 8, 
      img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600', 
      dest: 'Paris',
      destCode: 'CDG',
      desc: 'Direct Route', 
      price: '$135' 
    },
    { 
      id: 9, 
      img: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=600', 
      dest: 'London',
      destCode: 'LHR',
      desc: 'No Layovers', 
      price: '$145' 
    },
    { 
      id: 10, 
      img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', 
      dest: 'Dubai',
      destCode: 'DXB',
      desc: 'Direct Daily', 
      price: '$135' 
    },
    { 
      id: 11, 
      img: 'https://url-shortener.me/AA0V', 
      dest: 'Amsterdam',
      destCode: 'AMS',
      desc: 'Non-Stop', 
      price: '$155' 
    },
    { 
      id: 12, 
      img: '	https://url-shortener.me/AA8O', 
      dest: 'Athens',
      destCode: 'ATH',
      desc: 'Direct Connection', 
      price: '$115' 
    },
  ],
  
  'Suggested for you': [
    { 
      id: 13, 
      img: 'https://url-shortener.me/AA0A', 
      dest: 'Lisbon',
      destCode: 'LIS',
      desc: 'Trending Now', 
      price: '$108' 
    },
    { 
      id: 14, 
      img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600', 
      dest: 'Madrid',
      destCode: 'MAD',
      desc: 'Popular Choice', 
      price: '$125' 
    },
    { 
      id: 15, 
      img: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=600', 
      dest: 'Milan',
      destCode: 'MXP',
      desc: 'Recommended', 
      price: '$118' 
    },
    { 
      id: 16, 
      img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', 
      dest: 'Dubai',
      destCode: 'DXB',
      desc: 'Must Visit', 
      price: '$135' 
    },
    { 
      id: 17, 
      img: '	https://url-shortener.me/AA0V', 
      dest: 'Amsterdam',
      destCode: 'AMS',
      desc: 'Top Pick', 
      price: '$142' 
    },
    { 
      id: 18, 
      img: 'https://url-shortener.me/AA19', 
      dest: 'Doha',
      destCode: 'DOH',
      desc: 'Hidden Gem', 
      price: '$165' 
    },
  ],
  
  'Underrated destinations': [
    { 
      id: 19, 
      img: 'https://url-shortener.me/AA9F', 
      dest: 'Prague',
      destCode: 'PRG',
      desc: 'Hidden Treasure', 
      price: '$95' 
    },
    { 
      id: 20, 
      img: 'https://images.unsplash.com/photo-1528114039593-4366cc08227d?w=600', 
      dest: 'Budapest',
      destCode: 'BUD',
      desc: 'Underrated Beauty', 
      price: '$188' 
    },
    { 
      id: 21, 
      img: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=600', 
      dest: 'Porto',
      destCode: 'OPO',
      desc: 'Off The Beaten Path', 
      price: '$92' 
    },
    { 
      id: 22, 
      img: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=600', 
      dest: 'Milan',
      destCode: 'MXP',
      desc: 'Art Capital', 
      price: '$142'
    },
    { 
      id: 23, 
      img: 'https://url-shortener.me/AAA0', 
      dest: 'Manchester',
      destCode: 'MAN',
      desc: 'Undiscovered', 
      price: '$275' 
    },
    { 
      id: 24, 
      img: 'https://url-shortener.me/AAAC', 
      dest: 'Geneva',
      destCode: 'GVA',
      desc: 'Secret Spot', 
      price: '$382' 
    },
  ],
  
  'Beach': [
    { 
      id: 25, 
      img: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600', 
      dest: 'Maldives',
      destCode: 'MLE',
      desc: 'Paradise Beach', 
      price: '$450' 
    },
    { 
      id: 26, 
      img: 'https://url-shortener.me/AA2B', 
      dest: 'Hurghada',
      destCode: 'HRG',
      desc: 'Beach Resort', 
      price: '$70' 
    },
    { 
      id: 27, 
      img: 'https://url-shortener.me/AA2M', 
      dest: 'Miami',
      destCode: 'MIA',
      desc: 'Ocean Views', 
      price: '$285' 
    },
    { 
      id: 28, 
      img: 'https://url-shortener.me/AA25', 
      dest: 'Barcelona',
      destCode: 'BCN',
      desc: 'Catalonian Coast', 
      price: '$345' 
    },
    { 
      id: 29, 
      img: 'https://url-shortener.me/AA2F', 
      dest: 'Sharm El-Sheikh',
      destCode: 'SSH',
      desc: 'Explore the reefs', 
      price: '$78' 
    },
    { 
      id: 30, 
      img: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=600', 
      dest: 'Nice',
      destCode: 'NCE',
      desc: 'French Riviera', 
      price: '$165' 
    },
  ],
  
  'Art and culture': [
    { 
      id: 31, 
      img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600', 
      dest: 'Rome',
      destCode: 'FCO',
      desc: 'Ancient History', 
      price: '$128' 
    },
    { 
      id: 32, 
      img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600', 
      dest: 'Paris',
      destCode: 'CDG',
      desc: 'Museums & Art', 
      price: '$155' 
    },
    { 
      id: 33, 
      img: 'https://url-shortener.me/AA8O', 
      dest: 'Athens',
      destCode: 'ATH',
      desc: 'Classical Culture', 
      price: '$98' 
    },
    { 
      id: 34, 
      img: 'https://url-shortener.me/A9ZY', 
      dest: 'Istanbul',
      destCode: 'IST',
      desc: 'Rich Heritage', 
      price: '$115' 
    },
    { 
      id: 35, 
      img: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=600', 
      dest: 'Milan',
      destCode: 'MXP',
      desc: 'Art Capital', 
      price: '$142' 
    },
    { 
      id: 36, 
      img: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600', 
      dest: 'Berlin',
      destCode: 'BER',
      desc: 'Contemporary Art', 
      price: '$135' 
    },
  ],
  
  'Great food': [
    { 
      id: 37, 
      img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600', 
      dest: 'Rome',
      destCode: 'FCO',
      desc: 'Italian Cuisine', 
      price: '$125' 
    },
    { 
      id: 38, 
      img: 'https://url-shortener.me/A9ZY', 
      dest: 'Istanbul',
      destCode: 'IST',
      desc: 'Turkish Delights', 
      price: '$105' 
    },
    { 
      id: 39, 
      img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600', 
      dest: 'Madrid',
      destCode: 'MAD',
      desc: 'Spanish Tapas', 
      price: '$138' 
    },
    { 
      id: 40, 
      img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600', 
      dest: 'Paris',
      destCode: 'CDG',
      desc: 'French Gastronomy', 
      price: '$165' 
    },
    { 
      id: 41, 
      img: 'https://url-shortener.me/AA2M', 
      dest: 'Miami',
      destCode: 'MIA',
      desc: 'Fusion Cuisine', 
      price: '$195' 
    },
    { 
      id: 42, 
      img: 'https://url-shortener.me/AA0A', 
      dest: 'Lisbon',
      destCode: 'LIS',
      desc: 'Portuguese Flavors', 
      price: '$112' 
    },
  ],
};

const categories = [
  'Cheapest flights', 'Direct flights', 'Suggested for you', 
  'Underrated destinations', 'Beach', 'Art and culture', 'Great food'
];
export { allDealsData, categories };