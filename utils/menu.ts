import inquirer from 'inquirer';

export const entryPoint = async (): Promise<any> => {
  const mainQuestions = [
    {
      name: 'category',
      type: 'list',
      message: 'Choose a category:',
      choices: ['Custom', 'Bridges', 'Deposits', 'Mints'],
      loop: false,
    },
  ];

  const customQuestions = [
    {
      name: 'choice',
      type: 'list',
      message: 'Choose custom action:',
      choices: [
        { name: 'Custom eth txs', value: 'custom' },
        { name: '🔙 Back', value: 'back' },
      ],
      loop: false,
    },
  ];

  const bridgesQuestions = [
    {
      name: 'choice',
      type: 'list',
      message: 'Choose a bridge:',
      choices: [
        { name: 'Base bridge', value: 'base_bridge' },
        { name: 'Bungee refuel', value: 'bungee' },
        { name: 'Linea bridge', value: 'linea_bridge' },
        { name: 'Scroll bridge', value: 'scroll_bridge' },
        { name: 'Relay bridge from eth', value: 'relay_bridge_from_eth' },
        { name: 'ZkSync bridge', value: 'zksync_bridge' },
        { name: 'Zora bridge', value: 'zora_bridge' },
        { name: '🔙 Back', value: 'back' },
      ],
      loop: false,
    },
  ];

  const depositsQuestions = [
    {
      name: 'choice',
      type: 'list',
      message: 'Choose a deposit:',
      choices: [
        { name: 'Blast deposit', value: 'blast_deposit' },
        { name: 'Blur deposit', value: 'blur_deposit' },
        { name: 'Etherfi deposit', value: 'etherfi_deposit' },
        { name: 'Swell deposit', value: 'swell_deposit' },
        { name: 'Wrap eth', value: 'wrap_eth' },
        { name: 'ZkSync Lite deposit', value: 'zksync_lite_deposit' },
        { name: '🔙 Back', value: 'back' },
      ],
      loop: false,
    },
  ];

  const mintsQuestions = [
    {
      name: 'choice',
      type: 'list',
      message: 'Choose a mint:',
      choices: [
        { name: 'Mint Zerion DNA', value: 'mintfun' },
        { name: '🔙 Back', value: 'back' },
      ],
      loop: false,
    },
  ];

  const mainAnswer = await inquirer.prompt(mainQuestions);
  switch (mainAnswer.category) {
    case 'Custom':
      const customAnswer = await inquirer.prompt(customQuestions);
      if (customAnswer.choice === 'back') {
        return entryPoint();
      }
      return customAnswer.choice;
    case 'Bridges':
      const bridgeAnswer = await inquirer.prompt(bridgesQuestions);
      if (bridgeAnswer.choice === 'back') {
        return entryPoint();
      }
      return bridgeAnswer.choice;
    case 'Deposits':
      const depositAnswer = await inquirer.prompt(depositsQuestions);
      if (depositAnswer.choice === 'back') {
        return entryPoint();
      }
      return depositAnswer.choice;
    case 'Mints':
      const mintAnswer = await inquirer.prompt(mintsQuestions);
      if (mintAnswer.choice === 'back') {
        return entryPoint();
      }
      return mintAnswer.choice;
  }
};
