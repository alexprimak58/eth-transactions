interface Module {
  name: string;
  weight: number;
}

export function random(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function weightedRandom(modules: Module[]) {
  const totalWeight = modules.reduce((sum, module) => sum + module.weight, 0);
  let randomNum = Math.random() * totalWeight;

  for (let module of modules) {
    randomNum -= module.weight;
    if (randomNum <= 0) {
      return module;
    }
  }

  return null;
}

export const sleep = async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function shuffleWallets(array: Array<string>) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export function shuffleModules(array: Array<Module>) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
