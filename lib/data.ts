type ComponentData = {
  id: string;
  name?: string;
  code?: string;
};

export const components: ComponentData[] = [
  {
    id: 'card',
    name: 'Card',
    code: `<article class="w-64 bg-white p-6 rounded-lg shadow-xl">
  <p class="mb-4 text-sm uppercase text-gray-500">Total</p>
  <h1 class="text-4xl text-gray-800 font-bold leading-tight">77%</h1>
  <p class="mb-2 text-sm text-teal-400">+13%</p>

  <div class="relative">
    <div class="absolute w-full h-1 bg-gray-200"></div>
    <div class="absolute t-0 w-3/4 h-1 bg-pink-500"></div>
  </div>
</article>`,
  },
  {
    id: 'card-2',
    name: 'Card 2',
    code: `<div class="w-64 bg-white p-6 rounded-lg shadow-xl">
  <p class="mb-4 text-sm uppercase text-gray-500">Total</p>
  <h1 class="text-4xl text-gray-800 font-bold leading-tight">77%</h1>
  <p class="mb-2 text-sm text-teal-400">+13%</p>

  <div class="relative">
    <div class="absolute w-full h-1 bg-gray-200"></div>
    <div class="absolute t-0 w-3/4 h-1 bg-pink-500"></div>
  </div>
</div>`,
  },
];
