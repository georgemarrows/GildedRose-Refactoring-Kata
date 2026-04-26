import { Item, GildedRose } from '@/gilded-rose';

describe('Gilded Rose', () => {
  const updateOneItem = (item: Item) => new GildedRose([item]).updateQuality()[0];

  describe('normal items', () => {
    it('decreases sellIn and quality by 1 before the sell-by date', () => {
      const item = updateOneItem(new Item('Elixir of the Mongoose', 5, 7));

      expect(item.sellIn).toBe(4);
      expect(item.quality).toBe(6);
    });

    it('decreases quality twice as fast after the sell-by date', () => {
      const item = updateOneItem(new Item('Elixir of the Mongoose', 0, 7));

      expect(item.sellIn).toBe(-1);
      expect(item.quality).toBe(5);
    });

    it('never decreases quality below 0', () => {
      const item = updateOneItem(new Item('Elixir of the Mongoose', 0, 0));

      expect(item.sellIn).toBe(-1);
      expect(item.quality).toBe(0);
    });
  });

  describe('Aged Brie', () => {
    it('increases in quality before the sell-by date', () => {
      const item = updateOneItem(new Item('Aged Brie', 2, 0));

      expect(item.sellIn).toBe(1);
      expect(item.quality).toBe(1);
    });

    it('increases in quality twice as fast after the sell-by date', () => {
      const item = updateOneItem(new Item('Aged Brie', 0, 10));

      expect(item.sellIn).toBe(-1);
      expect(item.quality).toBe(12);
    });

    it('never increases quality above 50', () => {
      const item = updateOneItem(new Item('Aged Brie', 0, 49));

      expect(item.sellIn).toBe(-1);
      expect(item.quality).toBe(50);
    });
  });

  describe('Sulfuras', () => {
    it('never changes sellIn or quality', () => {
      const item = updateOneItem(new Item('Sulfuras, Hand of Ragnaros', 0, 80));

      expect(item.sellIn).toBe(0);
      expect(item.quality).toBe(80);
    });
  });

  describe('Backstage passes', () => {
    it('increases in quality by 1 when there are more than 10 days left', () => {
      const item = updateOneItem(new Item('Backstage passes to a TAFKAL80ETC concert', 11, 20));

      expect(item.sellIn).toBe(10);
      expect(item.quality).toBe(21);
    });

    it('increases in quality by 2 when there are 10 days or less left', () => {
      const item = updateOneItem(new Item('Backstage passes to a TAFKAL80ETC concert', 10, 20));

      expect(item.sellIn).toBe(9);
      expect(item.quality).toBe(22);
    });

    it('increases in quality by 3 when there are 5 days or less left', () => {
      const item = updateOneItem(new Item('Backstage passes to a TAFKAL80ETC concert', 5, 20));

      expect(item.sellIn).toBe(4);
      expect(item.quality).toBe(23);
    });

    it('drops quality to 0 after the concert', () => {
      const item = updateOneItem(new Item('Backstage passes to a TAFKAL80ETC concert', 0, 20));

      expect(item.sellIn).toBe(-1);
      expect(item.quality).toBe(0);
    });

    it('never increases quality above 50', () => {
      const item = updateOneItem(new Item('Backstage passes to a TAFKAL80ETC concert', 5, 49));

      expect(item.sellIn).toBe(4);
      expect(item.quality).toBe(50);
    });
  });

  describe('Conjured items', () => {
    it('decrease in quality twice as fast as normal items before the sell-by date', () => {
      const item = updateOneItem(new Item('Conjured Mana Cake', 3, 6));

      expect(item.sellIn).toBe(2);
      expect(item.quality).toBe(4);
    });

    it('decrease in quality twice as fast as normal items after the sell-by date', () => {
      const item = updateOneItem(new Item('Conjured Mana Cake', 0, 6));

      expect(item.sellIn).toBe(-1);
      expect(item.quality).toBe(2);
    });

    it('never decreases quality below 0', () => {
      const item = updateOneItem(new Item('Conjured Mana Cake', 0, 3));

      expect(item.sellIn).toBe(-1);
      expect(item.quality).toBe(0);
    });
  });
});
