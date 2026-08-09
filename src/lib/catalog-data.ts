export interface SearchItem {
  id: string;
  name: string;
  type: string;
  imageId: string;
}

export const SEARCH_ITEMS: SearchItem[] = [
  { id: "ff", name: "Free Fire", type: "Garena", imageId: "ff" },
  { id: "ff-global", name: "Free Fire Global", type: "Garena International", imageId: "ff" },
  { id: "ff-max", name: "Free Fire MAX", type: "Garena", imageId: "ff" },
  { id: "pubgm", name: "PUBG Mobile", type: "Level Infinite", imageId: "pubgm" },
  { id: "genshin", name: "Genshin Impact", type: "HoYoverse", imageId: "genshin" },
  { id: "valorant", name: "Valorant", type: "Riot Games", imageId: "valorant" },
  { id: "steam", name: "Steam Wallet", type: "Valve", imageId: "steam" },
  { id: "telco", name: "Pulsa Reguler", type: "Provider Seluler", imageId: "telco" },
  { id: "data", name: "Paket Data Internet", type: "Provider Seluler", imageId: "data" },
  { id: "dana", name: "DANA", type: "E-Wallet", imageId: "telco" },
  { id: "ovo", name: "OVO", type: "E-Wallet", imageId: "telco" },
  { id: "gopay", name: "GoPay", type: "E-Wallet", imageId: "telco" },
  { id: "pln", name: "Token Listrik PLN", type: "PLN", imageId: "data" },
];
