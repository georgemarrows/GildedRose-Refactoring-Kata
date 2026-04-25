export interface RequirementCase {
  description: string;
  input: {
    name: string;
    sellIn: number;
    quality: number;
  };
  expected: {
    sellIn: number;
    quality: number;
  };
}

export const requirementCases: RequirementCase[] = [
  {
    description: 'degrades normal items by 1 before the sell date',
    input: { name: '+5 Dexterity Vest', sellIn: 10, quality: 20 },
    expected: { sellIn: 9, quality: 19 },
  },
  {
    description: 'degrades normal items twice as fast once the sell date has passed',
    input: { name: '+5 Dexterity Vest', sellIn: 0, quality: 20 },
    expected: { sellIn: -1, quality: 18 },
  },
  {
    description: 'never lets normal item quality go negative before the sell date',
    input: { name: 'Elixir of the Mongoose', sellIn: 5, quality: 0 },
    expected: { sellIn: 4, quality: 0 },
  },
  {
    description: 'never lets expired normal item quality go negative',
    input: { name: 'Elixir of the Mongoose', sellIn: 0, quality: 1 },
    expected: { sellIn: -1, quality: 0 },
  },
  {
    description: 'increases aged brie quality as it gets older',
    input: { name: 'Aged Brie', sellIn: 2, quality: 0 },
    expected: { sellIn: 1, quality: 1 },
  },
  {
    description: 'increases aged brie quality twice as fast after the sell date',
    input: { name: 'Aged Brie', sellIn: 0, quality: 10 },
    expected: { sellIn: -1, quality: 12 },
  },
  {
    description: 'caps aged brie quality at 50',
    input: { name: 'Aged Brie', sellIn: 0, quality: 49 },
    expected: { sellIn: -1, quality: 50 },
  },
  {
    description: 'never changes sulfuras quality or sellIn',
    input: { name: 'Sulfuras, Hand of Ragnaros', sellIn: 0, quality: 80 },
    expected: { sellIn: 0, quality: 80 },
  },
  {
    description: 'increases backstage passes quality by 1 when more than 10 days remain',
    input: { name: 'Backstage passes to a TAFKAL80ETC concert', sellIn: 15, quality: 20 },
    expected: { sellIn: 14, quality: 21 },
  },
  {
    description: 'increases backstage passes quality by 2 when 10 days or fewer remain',
    input: { name: 'Backstage passes to a TAFKAL80ETC concert', sellIn: 10, quality: 20 },
    expected: { sellIn: 9, quality: 22 },
  },
  {
    description: 'increases backstage passes quality by 3 when 5 days or fewer remain',
    input: { name: 'Backstage passes to a TAFKAL80ETC concert', sellIn: 5, quality: 20 },
    expected: { sellIn: 4, quality: 23 },
  },
  {
    description: 'drops backstage passes quality to 0 after the concert',
    input: { name: 'Backstage passes to a TAFKAL80ETC concert', sellIn: 0, quality: 20 },
    expected: { sellIn: -1, quality: 0 },
  },
  {
    description: 'caps backstage passes quality at 50',
    input: { name: 'Backstage passes to a TAFKAL80ETC concert', sellIn: 5, quality: 49 },
    expected: { sellIn: 4, quality: 50 },
  },
  {
    description: 'degrades conjured items twice as fast as normal items before the sell date',
    input: { name: 'Conjured Mana Cake', sellIn: 3, quality: 6 },
    expected: { sellIn: 2, quality: 4 },
  },
  {
    description: 'degrades conjured items twice as fast as normal items after the sell date',
    input: { name: 'Conjured Mana Cake', sellIn: 0, quality: 6 },
    expected: { sellIn: -1, quality: 2 },
  },
  {
    description: 'never lets conjured item quality go negative',
    input: { name: 'Conjured Mana Cake', sellIn: 0, quality: 3 },
    expected: { sellIn: -1, quality: 0 },
  },
];
