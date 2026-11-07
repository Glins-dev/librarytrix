import type { Book, Category } from '../types';

export const SEED_CATEGORIES: Category[] = [
  { id: 'cyberpunk', name: 'Cyberpunk', color: '#39ff14', suffix: 'CYB' },
  { id: 'ficcao-cientifica', name: 'Ficção Científica', color: '#00f0ff', suffix: 'SCI' },
  { id: 'distopia', name: 'Distopia', color: '#ff007f', suffix: 'DIS' },
  { id: 'filosofia', name: 'Filosofia', color: '#a855f7', suffix: 'FIL' },
  { id: 'historia', name: 'História', color: '#ffb800', suffix: 'HIS' },
];

export const SEED_BOOKS: Book[] = [
  {
    id: 'ID_ARQUIVO // 0842-CYB',
    title: 'Neuromancer',
    author: 'William Gibson',
    category: 'Cyberpunk',
    releaseYear: 1984,
    originalNationality: 'EUA',
    coverUrl: '',
    rating: 5.0,
    status: 'CRITICADO',
    telemetryTag: 'MATRIZ // DECKER NEURAL',
    critique:
      'A gênese definitiva da estética sprawl.\nA prosa de Gibson opera como hardware veloz cortando fibra ótica fria.\nO céu tinha a cor de canal sintonizado em canal fora do ar.',
    syncDate: '2024-10-14',
  },
  {
    id: 'ID_ARQUIVO // 0104-SCI',
    title: 'Duna',
    author: 'Frank Herbert',
    category: 'Ficção Científica',
    releaseYear: 1965,
    originalNationality: 'EUA',
    coverUrl: '',
    rating: 4.9,
    status: 'CRITICADO',
    telemetryTag: 'ECOLOGIA POLÍTICA // ARRAKIS',
    critique:
      'Tratado magistral de ecologia, misticismo político e controle de massas.\nA melange como metáfora máxima de dependência de recursos energéticos galácticos.',
    syncDate: '2024-09-28',
  },
  {
    id: 'ID_ARQUIVO // 0019-DIS',
    title: '1984',
    author: 'George Orwell',
    category: 'Distopia',
    releaseYear: 1949,
    originalNationality: 'REINO UNIDO',
    coverUrl: '',
    rating: 4.8,
    status: 'CRITICADO',
    telemetryTag: 'TELESCELAS // OCEANIA',
    critique:
      'A dessecação do duplipensar e da novilíngua permanece a autópsia mais cirúrgica do autoritarismo cognitivo.\nO Grande Irmão observa os terminais de dados.',
    syncDate: '2024-11-03',
  },
  {
    id: 'ID_ARQUIVO // 0042-FIL',
    title: 'O Mito de Sísifo',
    author: 'Albert Camus',
    category: 'Filosofia',
    releaseYear: 1942,
    originalNationality: 'FRANÇA',
    coverUrl: '',
    rating: 4.9,
    status: 'CRITICADO',
    telemetryTag: 'ABSURDO // REVOLTA',
    critique:
      'A única questão filosófica verdadeiramente séria: a revolta contra a ausência de sentido.\nÉ preciso imaginar Sísifo feliz perante o maquinário existencial.',
    syncDate: '2024-11-19',
  },
  {
    id: 'ID_ARQUIVO // 0991-CYB',
    title: 'Snow Crash',
    author: 'Neal Stephenson',
    category: 'Cyberpunk',
    releaseYear: 1992,
    originalNationality: 'EUA',
    coverUrl: '',
    rating: 4.7,
    status: 'CRITICADO',
    telemetryTag: 'METAVERSO // HIRO PROTAGONIST',
    critique:
      'Avatares, katanas e vírus linguísticos na autoestrada de informação.\nO metaverso antes de virar produto.',
    syncDate: '2024-12-01',
  },
  {
    id: 'ID_ARQUIVO // 0233-HST',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'História',
    releaseYear: 2011,
    originalNationality: 'ISRAEL',
    coverUrl: '',
    rating: 4.6,
    status: 'CRITICADO',
    telemetryTag: 'MITOS COMPARTILHADOS // ESPÉCIE',
    critique:
      'A habilidade biológica de crer em mitos compartilhados gerou impérios e moeda.\nA história da espécie condensada em algoritmos sociais.',
    syncDate: '2024-12-07',
  },
];

