export const STEPS = [
  {
    n: '01',
    title: 'Primeira conversa',
    short: 'Você conta, em poucas palavras, o que está acontecendo.',
    text: 'Por WhatsApp, telefone, e-mail ou formulário. Respondemos em até um dia útil para entender o assunto, indicar o advogado responsável e combinar a reunião. Nessa etapa ainda não damos orientação jurídica — e ninguém assume compromisso.',
    meta: 'Até 1 dia útil',
  },
  {
    n: '02',
    title: 'Reunião de análise',
    short: 'Uma hora com quem vai conduzir o caso.',
    text: 'Presencial, em Funcionários, ou por vídeo. É o momento de ouvir a história inteira, ler os documentos que você já tem e identificar as questões jurídicas envolvidas. As condições da reunião são informadas antes do agendamento.',
    meta: 'Cerca de 1 hora',
  },
  {
    n: '03',
    title: 'Mapa do Caso',
    short: 'O retrato da situação, por escrito, em linguagem clara.',
    text: 'Você recebe um documento com o que está em jogo, os caminhos possíveis — inclusive os que não passam por um processo —, os riscos de cada um, os documentos necessários e uma estimativa de prazos e custos.',
    meta: 'Até 5 dias úteis',
  },
  {
    n: '04',
    title: 'Decisão',
    short: 'Você decide se, e como, quer seguir.',
    text: 'Com o mapa em mãos, a decisão é sua. Se decidir seguir com o escritório, os honorários e o escopo do trabalho são definidos em contrato escrito, antes de qualquer providência.',
    meta: 'No seu tempo',
  },
  {
    n: '05',
    title: 'Condução',
    short: 'Um advogado responsável, do começo ao fim.',
    text: 'Quem fez a reunião de análise acompanha o caso até o encerramento. Você recebe um resumo por escrito a cada movimentação relevante e, mesmo quando nada muda, pelo menos uma vez por mês.',
    meta: 'Atualização mensal, no mínimo',
  },
] as const;

export const COMMITMENTS = [
  {
    title: 'Um nome, não um departamento',
    text: 'O advogado que conduz o caso é apresentado na primeira reunião e continua com você até o fim.',
  },
  {
    title: 'O que importa, por escrito',
    text: 'Diagnóstico, estratégia, honorários e atualizações ficam registrados — para você consultar quando quiser.',
  },
  {
    title: 'Honorários antes de começar',
    text: 'Escopo e valores definidos em contrato, com base na tabela da OAB/MG, antes de qualquer providência.',
  },
  {
    title: 'Nenhuma promessa de resultado',
    text: 'Nenhum advogado pode garanti-lo — e desconfiar de quem garante é um bom começo.',
  },
] as const;

/** Conteúdo ilustrativo do Mapa do Caso (exemplo de formato, sem dados de cliente). */
export const CASE_MAP_SAMPLE = {
  title: 'Mapa do Caso',
  subject: 'Inventário com imóvel sem registro',
  sections: [
    {
      label: 'O que está em jogo',
      text: 'Partilha de um apartamento e de aplicações financeiras entre três herdeiros. Um terreno comprado em 1998 nunca foi registrado em nome do falecido.',
    },
    {
      label: 'Caminhos possíveis',
      text: 'A · Inventário em cartório, se houver consenso entre os três herdeiros.\nB · Inventário judicial, se o desacordo sobre o apartamento persistir.\nC · Regularização do terreno em paralelo, antes da partilha.',
    },
    {
      label: 'Riscos e pontos de atenção',
      text: 'Multa sobre o imposto de transmissão se o inventário não for aberto no prazo legal. Sem o registro, o terreno não pode ser partilhado.',
    },
    {
      label: 'Documentos',
      text: 'Certidão de óbito · matrícula do apartamento · contrato de compra do terreno · extratos bancários.',
    },
    {
      label: 'Estimativa',
      text: 'Via A: de 3 a 6 meses. Via B: de 1 a 3 anos. Custos detalhados no anexo.',
    },
  ],
} as const;
