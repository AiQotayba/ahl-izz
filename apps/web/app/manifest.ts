import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'أهل العز لا ينسون - دعم ريف حلب الجنوبي',
    short_name: 'أهل العز لا ينسون',
    description: 'منصة التبرعات لدعم التعليم والصحة ومياه الشرب في ريف حلب الجنوبي',
    start_url: '/',
    display: 'standalone',
    background_color: '#1E7B6B',
    theme_color: '#1E7B6B',
    icons: [
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
