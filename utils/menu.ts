import inquirer from 'inquirer';

export const entryPoint = async () => {
  const questions = [
    {
      name: 'choice',
      type: 'list',
      message: 'Choice:',
      choices: [{ name: 'Binance withdraw', value: 'binance' }],
      loop: false,
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers.choice;
};
