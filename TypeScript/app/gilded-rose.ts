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
    // __"Sulfuras"__, being a legendary item, never has to be sold or decreases in `Quality`
    // Interpretation: sellIn also never changes for Sulfuras, since it never has to be sold.
    // Just for clarification, an item can never have its `Quality` increase above `50`, however __"Sulfuras"__ is a
    // legendary item and as such its `Quality` is `80` and it never alters.
    // TODO ensure quality is always 80
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
  // TODO extract constants
  decreaseQuality(item, hasExpired(item) ? 2 : 1);
}

function updateAgedBrie(item: Item): void {
  // __"Aged Brie"__ actually increases in `Quality` the older it gets  
  // TODO extract constants
  increaseQuality(item, hasExpired(item) ? 2 : 1);
}

function updateBackstagePass(item: Item): void {
  // - __"Backstage passes"__, like aged brie, increases in `Quality` as its `SellIn` value approaches;
	// - `Quality` increases by `2` when there are `10` days or less and by `3` when there are `5` days or less but
	// - `Quality` drops to `0` after the concert

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
  // - __"Conjured"__ items degrade in `Quality` twice as fast as normal items
  // TODO make the doubling explicit using constants for doubling and for normal item aging
  decreaseQuality(item, hasExpired(item) ? 4 : 2);
}

function increaseQuality(item: Item, amount: number): void {
  // The `Quality` of an item is never more than `50`
  item.quality = Math.min(MAX_QUALITY, item.quality + amount);
}

function decreaseQuality(item: Item, amount: number): void {
  // The `Quality` of an item is never negative
  // TODO extract MIN_QUALITY constant
  item.quality = Math.max(0, item.quality - amount);
}

function decreaseSellIn(item: Item): void {
  //  At the end of each day our system lowers both values for every item
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
