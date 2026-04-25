export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

const AGED_BRIE = 'Aged Brie';
const BACKSTAGE_PASSES = 'Backstage passes to a TAFKAL80ETC concert';
const SULFURAS = 'Sulfuras, Hand of Ragnaros';
const CONJURED_PREFIX = 'Conjured';
const MAX_QUALITY = 50;

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    for (const item of this.items) {
      updateItem(item);
    }

    return this.items;
  }
}

function updateItem(item: Item): void {
  if (isSulfuras(item)) {
    return;
  }

  if (item.name === AGED_BRIE) {
    updateAgedBrie(item);
  } else if (item.name === BACKSTAGE_PASSES) {
    updateBackstagePass(item);
  } else if (isConjured(item)) {
    updateConjuredItem(item);
  } else {
    updateNormalItem(item);
  }

  decreaseSellIn(item);
}

function updateNormalItem(item: Item): void {
  decreaseQuality(item, hasExpired(item) ? 2 : 1);
}

function updateAgedBrie(item: Item): void {
  increaseQuality(item, hasExpired(item) ? 2 : 1);
}

function updateBackstagePass(item: Item): void {
  if (hasExpired(item)) {
    item.quality = 0;
    return;
  }

  if (item.sellIn <= 5) {
    increaseQuality(item, 3);
    return;
  }

  if (item.sellIn <= 10) {
    increaseQuality(item, 2);
    return;
  }

  increaseQuality(item, 1);
}

function updateConjuredItem(item: Item): void {
  decreaseQuality(item, hasExpired(item) ? 4 : 2);
}

function increaseQuality(item: Item, amount: number): void {
  item.quality = Math.min(MAX_QUALITY, item.quality + amount);
}

function decreaseQuality(item: Item, amount: number): void {
  item.quality = Math.max(0, item.quality - amount);
}

function decreaseSellIn(item: Item): void {
  item.sellIn -= 1;
}

function hasExpired(item: Item): boolean {
  return item.sellIn <= 0;
}

function isSulfuras(item: Item): boolean {
  return item.name === SULFURAS;
}

function isConjured(item: Item): boolean {
  return item.name.startsWith(CONJURED_PREFIX);
}
