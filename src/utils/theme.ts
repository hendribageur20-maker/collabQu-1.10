import { ThemeId } from '../types';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  category: 'Light' | 'Dark' | 'Vibrant';
  description: string;
  previewBg: string;
  previewPrimary: string;
  previewCard: string;
  previewBorder: string;
  textColor: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'bright',
    name: 'Cerah (Outdoor Siang)',
    category: 'Light',
    description: 'Kontras ultra tajam anti-silau untuk penggunaan di luar ruangan / terik matahari.',
    previewBg: '#f8fafc',
    previewCard: '#ffffff',
    previewBorder: '#94a3b8',
    previewPrimary: '#047857',
    textColor: '#020617',
  },
  {
    id: 'emerald',
    name: 'Zamrud Hijau Klasik',
    category: 'Vibrant',
    description: 'Palet hijau zamrud segar dengan aksen mint yang ramah dan menyejukkan mata.',
    previewBg: '#f0fdf4',
    previewCard: '#ffffff',
    previewBorder: '#86efac',
    previewPrimary: '#059669',
    textColor: '#064e3b',
  },
  {
    id: 'dark',
    name: 'Dark (Midnight OLED)',
    category: 'Dark',
    description: 'Mode gelap elegan hemat baterai layar OLED dengan nuansa malam yang teduh.',
    previewBg: '#0b1329',
    previewCard: '#111c38',
    previewBorder: '#334155',
    previewPrimary: '#10b981',
    textColor: '#f8fafc',
  },
  {
    id: 'neon',
    name: 'Neon Cyber Glow',
    category: 'Dark',
    description: 'Gaya futuristik gelap dengan garis neon menyala dan aksen elektrik modern.',
    previewBg: '#050811',
    previewCard: '#0b1124',
    previewBorder: '#06b6d4',
    previewPrimary: '#00f59b',
    textColor: '#e0f2fe',
  },
  {
    id: 'blue',
    name: 'Ocean Blue (Safir)',
    category: 'Light',
    description: 'Nuansa biru laut profesional korporat yang tenang, rapi, dan terpercaya.',
    previewBg: '#f0f7ff',
    previewCard: '#ffffff',
    previewBorder: '#93c5fd',
    previewPrimary: '#2563eb',
    textColor: '#0f172a',
  },
  {
    id: 'red',
    name: 'Royal Ruby (Merah Mewah)',
    category: 'Light',
    description: 'Aksen merah delima berwibawa, berani, bersemangat, dan penuh prestise.',
    previewBg: '#fff1f2',
    previewCard: '#ffffff',
    previewBorder: '#fca5a5',
    previewPrimary: '#dc2626',
    textColor: '#450a0a',
  },
];
