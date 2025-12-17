import arcjet, { shield, slidingWindow } from '@arcjet/node'; // add detectBot if needed

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: 'LIVE' }),

    // Uncomment the following line to enable bot detection
    // detectBot({
    //   mode: 'LIVE',
    //   allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW'],
    // }),

    slidingWindow({
      mode: 'LIVE',
      interval: '2s',
      max: 5,
    }),
  ],
});

export default aj;
