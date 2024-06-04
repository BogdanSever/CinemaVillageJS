/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.{html,js}"],
  theme: {
    fontFamily: {
    'Bebas-Neue':["Bebas Neue",'serif'],
    'Lato':["Lato",'serif'],
    'Playfair-Display':["Playfair Display",'serif'],
    'Montserrat':['Montserrat','serif'],
      'Nunito':['Nunito','serif'],
      'Lora':['Lora','serif'],
      'GothicA1':['Gothic A1','serif'],
      'Hanken-Grotesk':['Hanken Grotesk','serif'],
  },
  colors: {
    'mustard':{
     '100':"#FFD447",
     '200':"#fcbe11",
    },
    'night':"#121113",
    'lavender-bush':"#EEEEEE",
    'zeus': {
      '50': '#f8f6f5',
      '100': '#e8e4df',
      '200': '#d0c9bf',
      '300': '#b0a798',
      '400': '#8f8572',
      '500': '#746b58',
      '600': '#5c5545',
      '700': '#4c4639',
      '800': '#3e3a31',
      '900': '#36332b',
      '950': '#23211a',
  },

  'flush-mahogany': {
    '50': '#fff0f3',
    '100': '#ffdee5',
    '200': '#ffc2ce',
    '300': '#ff98ac',
    '400': '#ff5c7c',
    '500': '#ff2a54',
    '600': '#f80a39',
    '700': '#d2042d',
    '800': '#ac0829',
    '900': '#8e0e27',
    '950': '#4e0110',
},
  
  },
    extend: {
      gridAutoRows: {
      '2fr': 'minmax(0, 2fr)',
    },
  },
  },
  plugins: [],
}

