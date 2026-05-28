// Each section has a year label and rows of shots
// Each shot: { src, caption?, link?, col? }
// col — optional column span (1–6); unset shots split remaining columns evenly
const GALLERY = [
  {
    years: '2026–2025',
    rows: [
      [{ src: 'assets/shots/ufl-1.mp4', caption: 'text text tex' }, { src: 'assets/shots/ufl-2.mp4', caption: 'text text tex text text tex text text tex text text tex text text tex text text tex text text tex ' }],
      [{ src: 'assets/shots/qr-machine.mp4' }],
    ],
  },
  {
    years: '2024–2022',
    rows: [
      [{ src: 'assets/shots/lottie_eco.mp4', caption: 'Eco-themed Lottie icons pack' }, { src: 'assets/shots/lottie_eco_sketch.png', col: 2 }],
      [{ src: 'assets/shots/lottie_logos.mp4' }, { src: 'assets/shots/lottie_weather.mp4' }],
      [{ src: 'assets/shots/panda_1.png' }],
      [{ src: 'assets/shots/panda_2.png' }],
      [{ src: 'assets/shots/3d_glass.png', col: 2 }, { src: 'assets/shots/math_app.png' }],
      [{ src: 'assets/shots/unsplash.mp4' }],
      [{ src: 'assets/shots/pixel_donut.gif' }, { src: 'assets/shots/pixel_whale.gif' }],
      [{ src: 'assets/shots/converter.mp4' }],
    ],
  },
  {
    years: '2021–2019',
    rows: [
      [{ src: 'assets/shots/china1.png' }, { src: 'assets/shots/china2.png' }],
      [{ src: 'assets/shots/rd-app.png' }], 
    ],
  },
];
