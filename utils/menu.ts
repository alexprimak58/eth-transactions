import inquirer from 'inquirer';

export const entryPoint = async () => {
  const questions = [
    {
      name: 'choice',
      type: 'list',
      message: 'Choice:',
      choices: [
        { name: 'Binance withdraw', value: 'binance' },
        { name: 'Mintfun', value: 'mintfun' },
        { name: 'Bungee', value: 'bungee' },
        { name: 'Base bridge', value: 'base_bridge' },
        { name: 'Zora bridge', value: 'zora_bridge' },
      ],
      loop: false,
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers.choice;
};
