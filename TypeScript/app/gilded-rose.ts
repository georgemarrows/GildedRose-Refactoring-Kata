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
const MIN_QUALITY = 0;
const MAX_QUALITY = 50;
const SULFURAS_QUALITY = 80;
const NORMAL_QUALITY_CHANGE = 1;
const EXPIRED_MULTIPLIER = 2;
const CONJURED_MULTIPLIER = 2;
const BACKSTAGE_SOON_THRESHOLD = 10;
const BACKSTAGE_VERY_SOON_THRESHOLD = 5;
const BACKSTAGE_SOON_QUALITY_CHANGE = 2;
const BACKSTAGE_VERY_SOON_QUALITY_CHANGE = 3;

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
    // __"Sulfuras"__, being a legendary item, never has to be sold or decreases in `Quality`
    // Interpretation: sellIn also never changes for Sulfuras, since it never has to be sold.
    // Just for clarification, an item can never have its `Quality` increase above `50`, however __"Sulfuras"__ is a
    // legendary item and as such its `Quality` is `80` and it never alters.
    item.quality = SULFURAS_QUALITY;
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
  // At the end of each day our system lowers both values for every item
  // Once the sell by date has passed, `Quality` degrades twice as fast
  decreaseQuality(item, qualityChangeForNormalItem(item));
}

function updateAgedBrie(item: Item): void {
  // __"Aged Brie"__ actually increases in `Quality` the older it gets  
  increaseQuality(item, qualityChangeForNormalItem(item));
}

function updateBackstagePass(item: Item): void {
  // - __"Backstage passes"__, like aged brie, increases in `Quality` as its `SellIn` value approaches;
	// - `Quality` increases by `2` when there are `10` days or less and by `3` when there are `5` days or less but
	// - `Quality` drops to `0` after the concert

  if (hasExpired(item)) {
    item.quality = 0;
    return;
  }

  if (item.sellIn <= BACKSTAGE_VERY_SOON_THRESHOLD) {
    increaseQuality(item, BACKSTAGE_VERY_SOON_QUALITY_CHANGE);
    return;
  }

  if (item.sellIn <= BACKSTAGE_SOON_THRESHOLD) {
    increaseQuality(item, BACKSTAGE_SOON_QUALITY_CHANGE);
    return;
  }

  increaseQuality(item, NORMAL_QUALITY_CHANGE);
}

function updateConjuredItem(item: Item): void {
  // - __"Conjured"__ items degrade in `Quality` twice as fast as normal items
  decreaseQuality(item, qualityChangeForNormalItem(item) * CONJURED_MULTIPLIER);
}

function increaseQuality(item: Item, amount: number): void {
  // The `Quality` of an item is never more than `50`
  item.quality = Math.min(MAX_QUALITY, item.quality + amount);
}

function decreaseQuality(item: Item, amount: number): void {
  // The `Quality` of an item is never negative
  item.quality = Math.max(MIN_QUALITY, item.quality - amount);
}

function decreaseSellIn(item: Item): void {
  //  At the end of each day our system lowers both values for every item
  item.sellIn -= 1;
}

function hasExpired(item: Item): boolean {
  return item.sellIn <= 0;
}

function qualityChangeForNormalItem(item: Item): number {
  // Once the sell by date has passed, `Quality` degrades twice as fast
  return hasExpired(item) ? NORMAL_QUALITY_CHANGE * EXPIRED_MULTIPLIER : NORMAL_QUALITY_CHANGE;
}

function isSulfuras(item: Item): boolean {
  return item.name === SULFURAS;
}

function isConjured(item: Item): boolean {
  return item.name.startsWith(CONJURED_PREFIX);
}
