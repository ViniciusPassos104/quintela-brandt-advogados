export interface Lawyer {
  slug: string;
  name: string;
  firstName: string;
  initials: string;
  role: string;
  since: number;
  areas: string[];
  /** Uma frase — aparece nos cartões e na meta description. */
  summary: string;
  /** Primeira pessoa: como a pessoa descreve o próprio trabalho. */
  quote: string;
  trajectory: string[];
  education: { title: string; detail: string }[];
  focus: string[];
  languages: string;
  /** Número de inscrição na OAB. Vazio de propósito — ver src/data/site.ts. */
  oab: string;
  /** Caminho de uma foto real, quando existir. Sem foto, usa o retrato tipográfico. */
  photo?: string;
  tone: 'paper' | 'stone' | 'lacre';
}

export const TEAM: Lawyer[] = [
  {
    slug: 'helena-quintela',
    name: 'Helena Quintela',
    firstName: 'Helena',
    initials: 'HQ',
    role: 'Sócia fundadora',
    since: 2014,
    areas: ['familia', 'sucessoes'],
    summary:
      'Conduz as questões de família e sucessões do escritório, com atenção especial a separações que envolvem patrimônio e a inventários com muitos herdeiros.',
    quote:
      'Quase ninguém procura um advogado de família no melhor momento da vida. O mínimo que posso oferecer é clareza: o que está acontecendo, o que pode acontecer e o que depende de cada um.',
    trajectory: [
      'Helena começou a advogar em 2005, num escritório de contencioso de família no centro de Belo Horizonte. Foram quase dez anos acompanhando divórcios, disputas de guarda e inventários que já chegavam em conflito aberto — e percebendo que muitos deles poderiam ter tomado outro rumo se alguém tivesse organizado a situação antes.',
      'Em 2014, fundou o escritório com Otávio Brandt, com a proposta de tratar família e patrimônio como partes de uma mesma conversa. Foi dela a ideia do Mapa do Caso: entregar ao cliente, por escrito, o retrato da situação antes de qualquer decisão.',
      'Hoje dedica-se sobretudo a separações com patrimônio relevante, guarda e convivência de filhos e inventários com herdeiros em desacordo. Sempre que possível, conduz os casos pela via consensual — e, quando não é possível, pelo processo, sem perder a organização.',
    ],
    education: [
      { title: 'Graduação em Direito', detail: 'Universidade Federal de Minas Gerais' },
      { title: 'Especialização em Direito de Família e Sucessões', detail: 'Pós-graduação lato sensu' },
      { title: 'Formação em mediação de conflitos', detail: 'Curso de capacitação' },
    ],
    focus: ['Divórcio e partilha', 'Guarda e convivência', 'Inventários litigiosos', 'Mediação familiar'],
    languages: 'Português e espanhol',
    oab: '',
    tone: 'paper',
  },
  {
    slug: 'otavio-brandt',
    name: 'Otávio Brandt',
    firstName: 'Otávio',
    initials: 'OB',
    role: 'Sócio fundador',
    since: 2014,
    areas: ['empresas-familiares', 'sucessoes'],
    summary:
      'Assessora empresas familiares e famílias empresárias em acordos de sócios, sucessão na gestão e planejamento patrimonial.',
    quote:
      'Acordo de sócios bom é o que foi escrito quando todos ainda concordavam. Meu trabalho é fazer essa conversa acontecer antes de ela ficar difícil.',
    trajectory: [
      'Otávio passou a primeira parte da carreira no departamento societário de um escritório empresarial, estruturando contratos e reorganizações para empresas de médio porte. Com o tempo, notou que os problemas mais difíceis dessas empresas não estavam nos contratos, mas na família por trás deles: sucessões adiadas, irmãos com expectativas diferentes, cônjuges sem nenhuma informação sobre o negócio.',
      'É desse ponto que parte o seu trabalho no escritório, que fundou com Helena Quintela em 2014. Atua em acordos de sócios, protocolos familiares, sucessão na gestão e, ao lado de Helena, no planejamento sucessório de famílias com patrimônio empresarial.',
      'Tem um cuidado particular com a linguagem: os documentos que redige precisam ser entendidos por todos os sócios, e não apenas por quem os escreveu.',
    ],
    education: [
      { title: 'Graduação em Direito', detail: 'Pontifícia Universidade Católica de Minas Gerais' },
      { title: 'LL.M. em Direito Societário', detail: 'Pós-graduação' },
      { title: 'Governança em empresas familiares', detail: 'Curso de extensão' },
    ],
    focus: ['Acordo de sócios', 'Protocolo familiar', 'Sucessão empresarial', 'Planejamento patrimonial'],
    languages: 'Português, inglês e alemão',
    oab: '',
    tone: 'stone',
  },
  {
    slug: 'beatriz-nobrega',
    name: 'Beatriz Nóbrega',
    firstName: 'Beatriz',
    initials: 'BN',
    role: 'Advogada associada',
    since: 2019,
    areas: ['imobiliario', 'sucessoes'],
    summary:
      'Responsável pela área imobiliária: análise de negócios antes da assinatura, contratos e regularização de imóveis.',
    quote:
      'A matrícula de um imóvel conta uma história. Meu trabalho é ler essa história com atenção antes que ela vire um problema.',
    trajectory: [
      'Antes de chegar ao escritório, em 2019, Beatriz trabalhou alguns anos em um cartório de registro de imóveis da região metropolitana de Belo Horizonte. Dali trouxe uma leitura muito prática de matrículas, escrituras e exigências registrais.',
      'Trouxe também uma convicção: boa parte dos problemas imobiliários que chegam aos tribunais poderia ter sido evitada com uma checagem cuidadosa antes da assinatura. É por isso que a área imobiliária do escritório dá tanto peso à análise prévia.',
      'Conduz compras e vendas, contratos de locação e processos de regularização, e apoia os inventários que envolvem imóveis com pendências de registro.',
    ],
    education: [
      { title: 'Graduação em Direito', detail: 'Faculdade de Direito Milton Campos' },
      { title: 'Especialização em Direito Notarial e Registral', detail: 'Pós-graduação lato sensu' },
    ],
    focus: ['Análise prévia de compra', 'Usucapião', 'Regularização de registro', 'Locação'],
    languages: 'Português e inglês',
    oab: '',
    tone: 'lacre',
  },
];

export const getLawyer = (slug: string) => TEAM.find((l) => l.slug === slug);
