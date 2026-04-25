import { Item, GildedRose } from '@/gilded-rose';
import { requirementCases } from '../gilded-rose-requirement-cases';

describe('Gilded Rose', () => {
  it.each(requirementCases)('$description', ({ input, expected }) => {
    const gildedRose = new GildedRose([new Item(input.name, input.sellIn, input.quality)]);
    const [updatedItem] = gildedRose.updateQuality();

    expect(updatedItem.name).toBe(input.name);
    expect(updatedItem.sellIn).toBe(expected.sellIn);
    expect(updatedItem.quality).toBe(expected.quality);
  });
});
