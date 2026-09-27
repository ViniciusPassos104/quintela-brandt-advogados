export interface Faq {
  q: string;
  a: string;
}

export interface Area {
  slug: string;
  index: string;
  name: string;
  /** Título da página (H1), com o termo que as pessoas buscam. */
  h1: string;
  /** Nome curto, usado em CTAs e na mensagem de WhatsApp ("sobre …"). */
  topic: string;
  /** Valor do campo "assunto" no formulário. */
  formValue: string;
  seoTitle: string;
  metaDescription: string;
  lead: string;
  intro: string;
  forWhom: string;
  situations: string[];
  topics: string[];
  approach: { title: string; text: string }[];
  documents: string[];
  lawyers: string[];
  faqs: Faq[];
}

export const AREAS: Area[] = [
  {
    slug: 'familia',
    h1: 'Direito de família',
    index: '01',
    name: 'Família',
    topic: 'direito de família',
    formValue: 'familia',
    seoTitle: 'Advogado de família em Belo Horizonte — divórcio, guarda e pensão',
    metaDescription:
      'Divórcio, partilha de bens, guarda, convivência e pensão em Belo Horizonte. Conduzimos cada caso buscando acordos que funcionem depois de assinados.',
    lead: 'Separações, filhos e acordos que precisam funcionar depois de assinados.',
    intro:
      'Questões de família chegam carregadas de urgência e de história. O trabalho jurídico começa por separar o que precisa ser decidido agora do que pode ser construído com calma — e por lembrar que, quase sempre, as pessoas envolvidas continuarão se relacionando depois do fim do processo.',
    forWhom:
      'Pessoas e casais em processo de separação, pais que precisam organizar guarda e convivência dos filhos e casais que querem definir o regime de bens antes do casamento ou da união.',
    situations: [
      'Decidimos nos separar e não sabemos como dividir o que construímos juntos.',
      'Precisamos definir guarda e convivência sem transformar isso numa disputa.',
      'A pensão fixada anos atrás já não corresponde à realidade.',
      'Vamos nos casar e queremos escolher o regime de bens com consciência.',
    ],
    topics: [
      'Divórcio consensual e litigioso',
      'Dissolução de união estável',
      'Partilha de bens',
      'Guarda e regime de convivência',
      'Pensão alimentícia: fixação, revisão e cobrança',
      'Pacto antenupcial e contrato de convivência',
    ],
    approach: [
      {
        title: 'Primeiro, o que não pode esperar',
        text: 'Se há filhos, pensão ou moradia em jogo, identificamos logo no início as medidas provisórias que protegem a rotina de todos enquanto o restante é decidido.',
      },
      {
        title: 'Um retrato completo',
        text: 'Levantamos bens, dívidas, rendas e a rotina dos filhos. Boa parte dos conflitos nasce de informação incompleta, não de má-fé.',
      },
      {
        title: 'Acordo quando possível',
        text: 'Negociação direta ou mediação, e divórcio em cartório quando a lei permite. Um acordo construído pelas partes costuma ser mais cumprido do que uma decisão imposta.',
      },
      {
        title: 'Processo quando necessário',
        text: 'Quando não há acordo possível, conduzimos a ação judicial com a mesma organização — e sempre com a porta aberta para uma solução negociada.',
      },
    ],
    documents: [
      'Certidão de casamento ou documentos da união',
      'Certidão de nascimento dos filhos',
      'Lista aproximada de bens e dívidas',
      'Comprovantes de renda recentes',
      'Acordos ou decisões anteriores, se houver',
    ],
    lawyers: ['helena-quintela'],
    faqs: [
      {
        q: 'É possível fazer o divórcio em cartório?',
        a: 'Em muitos casos, sim. Quando há consenso e os requisitos legais são atendidos, o divórcio pode ser formalizado por escritura pública, com assistência obrigatória de advogado. Se houver filhos menores ou incapazes, as questões de guarda, convivência e pensão precisam estar resolvidas antes na via judicial. Na reunião de análise, verificamos qual via é possível e qual faz mais sentido.',
      },
      {
        q: 'Guarda compartilhada significa que a criança passa metade do tempo com cada um?',
        a: 'Não necessariamente. A guarda compartilhada diz respeito à divisão das responsabilidades e das decisões sobre a vida do filho. O tempo de convivência é definido à parte, de forma equilibrada e de acordo com a rotina e o interesse da criança — o que nem sempre significa metade do tempo com cada um.',
      },
      {
        q: 'O valor da pensão pode ser revisto?',
        a: 'Sim. Se mudar a situação financeira de quem paga ou a necessidade de quem recebe, o valor pode ser revisto por acordo ou por ação revisional. Até que haja novo acordo homologado ou nova decisão, continua valendo o valor fixado.',
      },
      {
        q: 'Quem vive em união estável tem os mesmos direitos de quem é casado?',
        a: 'A união estável é reconhecida como entidade familiar e produz efeitos patrimoniais e sucessórios. Sem contrato escrito, aplica-se em regra o regime da comunhão parcial de bens. A comprovação da união e do seu período, porém, costuma ser o ponto central — por isso a documentação importa.',
      },
    ],
  },
  {
    slug: 'sucessoes',
    h1: 'Inventários e sucessões',
    index: '02',
    name: 'Sucessões',
    topic: 'inventário e planejamento sucessório',
    formValue: 'sucessoes',
    seoTitle: 'Inventário e planejamento sucessório em Belo Horizonte',
    metaDescription:
      'Inventário em cartório ou judicial, testamentos, doações e planejamento sucessório em Belo Horizonte, com custos e etapas explicados antes de começar.',
    lead: 'Inventários conduzidos com método e planejamentos feitos antes da urgência.',
    intro:
      'A morte de alguém próximo costuma vir acompanhada de uma sequência de decisões práticas para as quais ninguém está preparado: bancos, imóveis, impostos, prazos. Em outros casos, a preocupação vem antes — organizar a sucessão enquanto ainda é possível conversar sobre ela. Atuamos nos dois momentos.',
    forWhom:
      'Famílias que precisam abrir ou destravar um inventário, herdeiros em desacordo sobre a partilha e pessoas que querem organizar a própria sucessão com tranquilidade.',
    situations: [
      'Meu pai faleceu e não sabemos por onde começar o inventário.',
      'Os herdeiros não chegam a um acordo sobre a divisão dos bens.',
      'Há um imóvel da família que nunca passou por inventário.',
      'Quero organizar minha sucessão sem criar conflito entre os filhos.',
    ],
    topics: [
      'Inventário e partilha, em cartório ou judicial',
      'Sobrepartilha e bens esquecidos',
      'Testamentos',
      'Doação em vida com reserva de usufruto',
      'Planejamento sucessório e patrimonial',
      'Orientação sobre ITCMD e custos do inventário',
    ],
    approach: [
      {
        title: 'Levantamento completo',
        text: 'Bens, dívidas, herdeiros, documentos e eventuais testamentos. É o que define tudo o que vem depois — inclusive o custo.',
      },
      {
        title: 'Escolha da via',
        text: 'Cartório ou Judiciário: explicamos o que cada caminho exige, quanto tempo costuma levar e por que um deles faz mais sentido no seu caso.',
      },
      {
        title: 'Custos antes de começar',
        text: 'Imposto de transmissão, emolumentos e custas estimados por escrito, para que a família possa se planejar e não seja surpreendida no meio do caminho.',
      },
      {
        title: 'Até o registro',
        text: 'O trabalho não termina na partilha: acompanhamos o registro dos bens em nome dos herdeiros, que é quando o inventário de fato se encerra.',
      },
    ],
    documents: [
      'Certidão de óbito',
      'Documentos pessoais do falecido e dos herdeiros',
      'Matrículas dos imóveis e documentos de veículos',
      'Extratos bancários e de investimentos',
      'Última declaração de imposto de renda do falecido',
    ],
    lawyers: ['helena-quintela', 'otavio-brandt'],
    faqs: [
      {
        q: 'Existe prazo para abrir o inventário?',
        a: 'A lei prevê que o inventário seja aberto em até dois meses a partir do falecimento. O atraso não impede o inventário, mas pode gerar multa sobre o imposto de transmissão (ITCMD), conforme a legislação de cada estado. Por isso, vale começar a reunir os documentos o quanto antes.',
      },
      {
        q: 'Quando o inventário pode ser feito em cartório?',
        a: 'Quando há acordo entre os herdeiros e os demais requisitos legais estão presentes. Desde 2024, as normas do Conselho Nacional de Justiça passaram a admitir a via extrajudicial também em situações que antes exigiam o Judiciário, como a existência de herdeiros menores ou de testamento, desde que observadas condições específicas. A análise do caso indica se a via é possível.',
      },
      {
        q: 'Posso deixar meus bens para quem eu quiser?',
        a: 'Em parte. Quem tem herdeiros necessários — descendentes, ascendentes ou cônjuge — só pode dispor livremente de metade do patrimônio. A outra metade, chamada legítima, é reservada por lei a esses herdeiros.',
      },
      {
        q: 'Holding familiar é sempre a melhor forma de planejamento?',
        a: 'Não. A holding é um instrumento entre vários — como testamento, doação com reserva de usufruto e previdência privada — e só faz sentido depois de analisados o patrimônio, a família, os custos de manutenção e os efeitos tributários. Para muitas famílias, soluções mais simples atendem melhor.',
      },
    ],
  },
  {
    slug: 'empresas-familiares',
    h1: 'Empresas familiares',
    index: '03',
    name: 'Empresas familiares',
    topic: 'empresa familiar',
    formValue: 'empresas-familiares',
    seoTitle: 'Advocacia para empresas familiares — acordo de sócios e sucessão',
    metaDescription:
      'Acordo de sócios, protocolo familiar, sucessão na gestão e saída de sócios em empresas familiares. Escritório em Belo Horizonte.',
    lead: 'Regras claras entre sócios que também são parentes.',
    intro:
      'Numa empresa familiar, uma discordância entre sócios raramente é só societária — e uma questão de família raramente deixa a empresa de fora. Ajudamos a construir regras que protejam o negócio das mudanças naturais da família: casamentos, separações, falecimentos e a chegada de uma nova geração.',
    forWhom:
      'Fundadores que querem preparar a sucessão, irmãos e primos que dividem uma sociedade e famílias empresárias que precisam separar o que é da empresa do que é da família.',
    situations: [
      'Meu irmão e eu somos sócios e já não concordamos sobre os rumos da empresa.',
      'Meu pai quer passar a gestão para os filhos, mas nada está no papel.',
      'Um dos sócios vai se divorciar e temos receio dos efeitos na empresa.',
      'Precisamos que um sócio saia sem paralisar o negócio.',
    ],
    topics: [
      'Acordo de sócios e protocolo familiar',
      'Contrato social e alterações',
      'Sucessão na gestão e na propriedade',
      'Holding patrimonial, quando indicada',
      'Saída de sócios e apuração de haveres',
      'Mediação de conflitos entre sócios',
    ],
    approach: [
      {
        title: 'Ouvir a empresa e a família',
        text: 'Conversas individuais com os sócios e leitura atenta dos documentos societários. As regras só funcionam se refletirem como a empresa realmente opera.',
      },
      {
        title: 'Testar o cenário',
        text: 'O que acontece hoje se um sócio falecer, se divorciar ou quiser sair? Mostramos as respostas que os documentos atuais dão — e as lacunas.',
      },
      {
        title: 'Escrever as regras',
        text: 'Acordo de sócios, cláusulas do contrato social e, quando útil, um protocolo familiar sobre o papel de cada geração no negócio.',
      },
      {
        title: 'Revisar com o tempo',
        text: 'Famílias mudam. Recomendamos revisões periódicas para que as regras acompanhem casamentos, nascimentos e mudanças na gestão.',
      },
    ],
    documents: [
      'Contrato social e todas as alterações',
      'Acordo de sócios, se existir',
      'Organograma e papel de cada familiar na gestão',
      'Últimos balanços, se disponíveis',
    ],
    lawyers: ['otavio-brandt'],
    faqs: [
      {
        q: 'O que acontece com as cotas se um sócio se divorciar?',
        a: 'Depende do regime de bens e do que dizem o contrato social e o acordo de sócios. Em regra, o ex-cônjuge pode ter direito ao valor correspondente às cotas partilháveis, mas não se torna sócio automaticamente. Cláusulas bem redigidas evitam que a separação de um sócio afete a gestão da empresa.',
      },
      {
        q: 'O que é um acordo de sócios e por que fazer um?',
        a: 'É um contrato entre os sócios que regula o que o contrato social normalmente não detalha: como as decisões são tomadas, a entrada de herdeiros, a saída de sócios, a distribuição de lucros e os cargos da família na gestão. É justamente na ausência dessas regras que os conflitos costumam surgir.',
      },
      {
        q: 'É possível planejar a sucessão sem afastar o fundador da gestão?',
        a: 'Sim. A sucessão pode acontecer em etapas, separando a transferência da propriedade da transferência da gestão. Instrumentos como a doação de cotas com reserva de usufruto permitem que o fundador mantenha direitos enquanto a próxima geração é preparada.',
      },
      {
        q: 'Vocês atendem empresas de qualquer porte?',
        a: 'Atendemos principalmente empresas familiares de pequeno e médio porte, em que as relações pessoais e a estrutura societária estão muito próximas. Para demandas empresariais fora desse contexto, indicamos colegas de confiança.',
      },
    ],
  },
  {
    slug: 'imobiliario',
    h1: 'Direito imobiliário',
    index: '04',
    name: 'Imobiliário',
    topic: 'direito imobiliário',
    formValue: 'imobiliario',
    seoTitle: 'Advogado imobiliário em Belo Horizonte — compra, venda e regularização',
    metaDescription:
      'Análise de documentação antes da compra, contratos, usucapião e regularização de imóveis em Belo Horizonte. Segurança antes de assinar.',
    lead: 'Segurança antes de assinar e regularização do que ficou para trás.',
    intro:
      'Um imóvel costuma ser o maior patrimônio de uma família — e também uma das maiores fontes de problemas quando a documentação não acompanha a realidade. Atuamos na prevenção, analisando negócios antes da assinatura, e na regularização de imóveis que ficaram sem registro, sem inventário ou sem escritura.',
    forWhom:
      'Quem vai comprar ou vender um imóvel, famílias com imóveis herdados ou irregulares e proprietários e inquilinos em contratos de locação.',
    situations: [
      'Vou comprar um imóvel e quero saber se a documentação está em ordem.',
      'Moro há anos num imóvel que nunca foi passado para o meu nome.',
      'Herdamos um imóvel e um dos herdeiros quer vender a parte dele.',
      'O contrato de locação terminou em conflito.',
    ],
    topics: [
      'Análise de documentação antes da compra',
      'Contratos de compra e venda e promessa',
      'Usucapião judicial e em cartório',
      'Regularização e retificação de registro',
      'Imóveis em condomínio entre herdeiros',
      'Locação residencial e comercial',
    ],
    approach: [
      {
        title: 'Ler a matrícula',
        text: 'A matrícula conta a história do imóvel: quem foi dono, o que foi registrado, o que pesa sobre ele. É por ela que começamos.',
      },
      {
        title: 'Checar as partes',
        text: 'Avaliamos quais certidões do vendedor e do imóvel fazem sentido no caso concreto — sem pedir papel por pedir, sem deixar lacuna.',
      },
      {
        title: 'Contrato sob medida',
        text: 'Prazos, condições de pagamento, responsabilidade por pendências e o que acontece se algo der errado, escritos com clareza.',
      },
      {
        title: 'Até o registro',
        text: 'Quem só tem a escritura ainda não é dono. Acompanhamos o negócio até o registro no cartório de imóveis.',
      },
    ],
    documents: [
      'Matrícula atualizada do imóvel, se já tiver',
      'Proposta, contrato ou recibos existentes',
      'Carnê ou certidão de IPTU',
      'Documentos pessoais das partes',
    ],
    lawyers: ['beatriz-nobrega'],
    faqs: [
      {
        q: 'Quais documentos devo verificar antes de comprar um imóvel?',
        a: 'O ponto de partida é a matrícula atualizada, emitida pelo cartório de registro de imóveis, que mostra o proprietário e eventuais ônus, como hipotecas e penhoras. A partir dela, avaliamos quais certidões do vendedor e do imóvel são recomendáveis no caso — a lista varia conforme o tipo de imóvel e a situação de quem vende.',
      },
      {
        q: 'O que é usucapião em cartório?',
        a: 'É o reconhecimento da propriedade pela posse prolongada feito diretamente no cartório de registro de imóveis, sem processo judicial, quando os requisitos legais estão presentes e não há oposição. Exige ata notarial, planta, memorial descritivo e outros documentos, sempre com advogado.',
      },
      {
        q: 'Um herdeiro pode vender sozinho um imóvel da herança?',
        a: 'Não. Até a partilha, a herança pertence ao conjunto dos herdeiros. A venda do imóvel depende da concordância de todos ou de autorização judicial no inventário. O herdeiro pode, porém, ceder os seus direitos hereditários, observadas as regras legais.',
      },
      {
        q: 'Escritura e registro são a mesma coisa?',
        a: 'Não. A escritura, lavrada no tabelionato de notas, formaliza o negócio; o registro, feito no cartório de registro de imóveis, é o que transfere a propriedade. Quem só tem a escritura ainda não é, juridicamente, o proprietário.',
      },
    ],
  },
];

export const getArea = (slug: string) => AREAS.find((a) => a.slug === slug);
