export type Character = {
  id?: number;
  name: string;
  gender: string;
  affiliation: string;
  nen_type: string;
  origin: string;
  first_arc: string;
  status: string;
  role: string;
  age_group: string;
  quote: string;
  nen_hint: string;
  silhouetteImage: string;
};

export const fallbackCharacters: Character[] = [
{
  name: 'Gon Freecss',
  gender: 'Masculino',
  affiliation: 'Caçador',
  nen_type: 'Reforço',
  origin: 'Ilha da Baleia',
  first_arc: 'Exame Hunter',
  status: 'Vivo',
  role: 'Protagonista',
  age_group: 'Adolescente',
  quote: 'Não importa...',
  nen_hint: 'Jajanken',
  silhouetteImage: '/silhouettes/gon.png'
},
  { name: 'Killua Zoldyck', gender: 'Masculino', affiliation: 'Família Zoldyck', nen_type: 'Transmutação', origin: 'Montanha Kukuroo', first_arc: 'Exame Hunter', status: 'Vivo', role: 'Protagonista', age_group: 'Criança', quote: 'Eu sou amigo dele. Isso basta.', nen_hint: 'Seu Nen imita eletricidade e aumenta reflexos em combate.', silhouetteImage: "/silhouettes/killua.svg", },
  { name: 'Kurapika', gender: 'Masculino', affiliation: 'Clã Kurta', nen_type: 'Materialização', origin: 'Vila Kurta', first_arc: 'Exame Hunter', status: 'Vivo', role: 'Aliado principal', age_group: 'Jovem', quote: 'Eu não temo a morte. Temo que minha raiva desapareça.', nen_hint: 'Correntes materializadas são usadas com regras e restrições severas.', silhouetteImage: "/silhouettes/kurapika.svg", },
  { name: 'Leorio Paradinight', gender: 'Masculino', affiliation: 'Caçador', nen_type: 'Emissão', origin: 'Desconhecida', first_arc: 'Exame Hunter', status: 'Vivo', role: 'Aliado principal', age_group: 'Jovem adulto', quote: 'Eu vou ser médico. E vou salvar quem não pode pagar.', nen_hint: 'Seu golpe atravessa distância usando emissão de aura.', silhouetteImage: "/silhouettes/leorio.svg", },
  { name: 'Hisoka Morow', gender: 'Masculino', affiliation: 'Independente', nen_type: 'Transmutação', origin: 'Desconhecida', first_arc: 'Exame Hunter', status: 'Vivo', role: 'Antagonista', age_group: 'Adulto', quote: 'O verdadeiro prazer está em enfrentar alguém promissor.', nen_hint: 'Sua aura tem propriedades de borracha e goma.', silhouetteImage: "/silhouettes/hisoka.svg", },
{ 
  name: 'Chrollo Lucilfer',
  gender: 'Masculino',
  affiliation: 'Trupe Fantasma',
  nen_type: 'Especialização',
  origin: 'Cidade Meteoro',
  first_arc: 'Yorknew City',
  status: 'Vivo',
  role: 'Antagonista',
  age_group: 'Adulto',
  quote: 'Não há motivo. Nós apenas fazemos.',
  nen_hint: 'Rouba habilidades de Nen e as registra em um livro.',
  silhouetteImage: "/silhouettes/chrollo.png",},
  { name: 'Meruem', gender: 'Masculino', affiliation: 'Formigas Quimera', nen_type: 'Especialização', origin: 'NGL', first_arc: 'Formigas Quimera', status: 'Morto', role: 'Antagonista', age_group: 'Desconhecida', quote: 'O que significa ser rei?', nen_hint: 'Sua aura cresce ao consumir outros seres com Nen.', silhouetteImage: "/silhouettes/meruem.svg", },
  { name: 'Neferpitou', gender: 'Indefinido', affiliation: 'Formigas Quimera', nen_type: 'Especialização', origin: 'NGL', first_arc: 'Formigas Quimera', status: 'Morto', role: 'Antagonista', age_group: 'Desconhecida', quote: 'Preciso proteger o Rei.', nen_hint: 'Usa marionetes e técnicas médicas ligadas a aura.', silhouetteImage: "/silhouettes/pitou.svg", },
  { name: 'Biscuit Krueger', gender: 'Feminino', affiliation: 'Caçador', nen_type: 'Transmutação', origin: 'Desconhecida', first_arc: 'Greed Island', status: 'Vivo', role: 'Mentora', age_group: 'Adulto', quote: 'Vocês dois ainda são diamantes brutos.', nen_hint: 'Aura voltada a transformação, cura e condicionamento.', silhouetteImage: 'Aparência pequena e fofa que esconde força monstruosa.' },
  { name: 'Isaac Netero', gender: 'Masculino', affiliation: 'Associação Hunter', nen_type: 'Reforço', origin: 'Desconhecida', first_arc: 'Exame Hunter', status: 'Morto', role: 'Mentor', age_group: 'Idoso', quote: 'A evolução humana é infinita.', nen_hint: 'Ataques velozes associados a uma estátua gigantesca.', silhouetteImage: "/silhouettes/netero.svg", }
];
