export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name: string, sellIn: number, quality: number) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items: Array<Item> = []) {
    this.items = items;
  }

  updateQuality() {
    for (const item of this.items) {
      this.updateItem(item);
    }

    return this.items;
  }

  private updateItem(item: Item) {
    if (this.isSulfuras(item)) {
      return;
    }

    this.updateQualityBeforeSellDate(item);
    item.sellIn -= 1;

    if (item.sellIn < 0) {
      this.updateQualityAfterSellDate(item);
    }
  }

  private updateQualityBeforeSellDate(item: Item) {
    if (this.isAgedBrie(item)) {
      this.increaseQuality(item, 1);
      return;
    }

    if (this.isBackstagePass(item)) {
      this.increaseQuality(item, this.backstageQualityIncrease(item.sellIn));
      return;
    }

    this.decreaseQuality(item, this.degradationRate(item));
  }

  private updateQualityAfterSellDate(item: Item) {
    if (this.isAgedBrie(item)) {
      this.increaseQuality(item, 1);
      return;
    }

    if (this.isBackstagePass(item)) {
      item.quality = 0;
      return;
    }

    this.decreaseQuality(item, this.degradationRate(item));
  }

  private backstageQualityIncrease(sellIn: number) {
    if (sellIn <= 5) {
      return 3;
    }

    if (sellIn <= 10) {
      return 2;
    }

    return 1;
  }

  private degradationRate(item: Item) {
    return this.isConjured(item) ? 2 : 1;
  }

  private increaseQuality(item: Item, amount: number) {
    item.quality = Math.min(50, item.quality + amount);
  }

  private decreaseQuality(item: Item, amount: number) {
    item.quality = Math.max(0, item.quality - amount);
  }

  private isAgedBrie(item: Item) {
    return item.name === 'Aged Brie';
  }

  private isBackstagePass(item: Item) {
    return item.name === 'Backstage passes to a TAFKAL80ETC concert';
  }

  private isSulfuras(item: Item) {
    return item.name === 'Sulfuras, Hand of Ragnaros';
  }

  private isConjured(item: Item) {
    return item.name.startsWith('Conjured');
  }
}
