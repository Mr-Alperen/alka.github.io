
export enum Tab {
  Home = 'Giriş',
  About = 'Hakkımızda',
  Defense = 'Savunma',
  IT = 'Bilişim',
  Consultancy = 'Danışmanlık',
  Contact = 'İletişim',
  Game = 'Oyun'
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
