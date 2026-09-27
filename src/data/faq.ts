import type { Faq } from './areas';

export interface FaqGroup {
  id: string;
  title: string;
  items: (Faq & { id: string; home?: boolean })[];
}

/**
 * Perguntas gerais — respostas diretas na primeira frase, nuance depois.
 * Quando a resposta depende do caso, isso é dito com todas as letras.
 */
export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: 'primeiro-contato',
    title: 'Primeiro contato',
    items: [
      {
        id: 'como-funciona-primeiro-contato',
        home: true,
        q: 'Como funciona o primeiro contato?',
        a: 'Você nos escreve ou liga e conta brevemente o que está acontecendo. Em até um dia útil, respondemos para entender o assunto, dizer se é algo em que podemos ajudar e agendar a reunião de análise com o advogado responsável. Essa primeira conversa é curta e não inclui orientação jurídica.',
      },
      {
        id: 'documentos-antes',
        home: true,
        q: 'Preciso reunir documentos antes de falar com o escritório?',
        a: 'Não para o primeiro contato. Para a reunião de análise, indicamos com antecedência o que vale trazer — normalmente documentos que você já tem em casa. Se algo estiver faltando, a própria reunião ajuda a descobrir como obtê-lo.',
      },
      {
        id: 'obrigacao-contratar',
        q: 'Entrar em contato me obriga a contratar o escritório?',
        a: 'Não. O primeiro contato e a reunião de análise servem justamente para que você entenda a situação e decida com calma. O trabalho só começa depois de um contrato de honorários assinado.',
      },
      {
        id: 'nao-sei-a-area',
        q: 'Não sei em qual área meu problema se encaixa. Posso escrever mesmo assim?',
        a: 'Pode — e é mais comum do que parece. Muitas situações envolvem família, herança e imóveis ao mesmo tempo. Conte o que está acontecendo com as suas palavras; a triagem é feita por nós.',
      },
    ],
  },
  {
    id: 'atendimento',
    title: 'Atendimento',
    items: [
      {
        id: 'atendimento-online',
        home: true,
        q: 'É possível ser atendido online?',
        a: 'Sim. A reunião de análise e os encontros seguintes podem ser feitos por videoconferência, e os documentos são trocados por meio seguro. Muitos clientes nunca precisam ir ao escritório.',
      },
      {
        id: 'outras-cidades',
        home: true,
        q: 'Vocês atendem clientes de outras cidades?',
        a: 'Sim. Atendemos presencialmente em Belo Horizonte e por vídeo em qualquer cidade. Quando o caso tramita em outro estado, avaliamos na reunião de análise se conduzimos diretamente ou em conjunto com um escritório local — e explicamos o motivo.',
      },
      {
        id: 'qual-advogado',
        home: true,
        q: 'Como saber qual advogado vai analisar minha situação?',
        a: 'Você não precisa escolher. Na triagem, indicamos o advogado cuja área corresponde ao seu caso, e é ele quem faz a reunião de análise e acompanha o trabalho até o fim. Se o caso envolver mais de uma área, os dois atuam juntos, com um responsável definido.',
      },
      {
        id: 'acompanhante',
        q: 'Posso levar alguém à reunião?',
        a: 'Pode. Muitas pessoas preferem ir acompanhadas de um familiar ou de alguém de confiança. Só pedimos que nos avise antes, porque algumas conversas — especialmente em casos de família — pedem cuidado com quem está presente.',
      },
    ],
  },
  {
    id: 'honorarios',
    title: 'Honorários',
    items: [
      {
        id: 'como-honorarios',
        q: 'Como são definidos os honorários?',
        a: 'Depois da reunião de análise, quando já é possível dimensionar o trabalho. Escopo, valores e forma de pagamento ficam em contrato escrito, tendo como referência a tabela de honorários da OAB/MG. Nenhuma providência é tomada antes disso.',
      },
      {
        id: 'reuniao-cobrada',
        q: 'A reunião de análise é cobrada?',
        a: 'Sim. É uma consulta jurídica, com leitura de documentos e orientação sobre o caso. As condições são informadas antes do agendamento, para que você decida com todas as informações.',
      },
    ],
  },
  {
    id: 'prazos',
    title: 'Processos e prazos',
    items: [
      {
        id: 'quanto-tempo',
        home: true,
        q: 'Quanto tempo demora um processo?',
        a: 'Depende do tipo de caso, da via escolhida e, quando há processo, do ritmo do Judiciário — que não controlamos. Um divórcio consensual em cartório pode ser resolvido em semanas; uma disputa judicial pode levar anos. No Mapa do Caso, você recebe uma estimativa realista para cada caminho possível, sempre como faixa, nunca como promessa.',
      },
      {
        id: 'acompanhar',
        q: 'Como vou acompanhar o andamento do caso?',
        a: 'Você recebe um resumo por escrito a cada movimentação relevante e, mesmo quando nada muda, pelo menos uma vez por mês. Em qualquer momento, pode falar diretamente com o advogado responsável.',
      },
      {
        id: 'forum',
        q: 'Vou precisar ir ao fórum?',
        a: 'Na maioria dos casos, não. Os processos são eletrônicos e muitas audiências acontecem por vídeo. Quando sua presença for necessária, avisamos com antecedência e explicamos o que vai acontecer.',
      },
    ],
  },
  {
    id: 'sigilo',
    title: 'Sigilo e dados',
    items: [
      {
        id: 'sigilo-profissional',
        q: 'O que eu contar ao escritório fica em sigilo?',
        a: 'Sim. O sigilo profissional é um dever do advogado previsto no Estatuto da Advocacia e no Código de Ética da OAB, e vale desde o primeiro contato — mesmo que você não chegue a contratar o escritório.',
      },
      {
        id: 'dados-formulario',
        q: 'O que acontece com os dados que envio pelo formulário?',
        a: 'São usados apenas para responder ao seu contato. Não enviamos newsletter nem compartilhamos com terceiros para fins comerciais. Os detalhes estão na política de privacidade.',
      },
    ],
  },
];

export const HOME_FAQ = FAQ_GROUPS.flatMap((g) => g.items).filter((i) => i.home);
