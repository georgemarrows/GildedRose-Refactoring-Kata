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

export class GildedRose {
  items: Array<Item>;
  private readonly strategies: Array<ItemUpdateStrategy>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
    this.strategies = [
      new SulfurasStrategy(),
      new AgedBrieStrategy(),
      new BackstagePassStrategy(),
      new ConjuredItemStrategy(),
      new NormalItemStrategy(), // must be last as it matches all items
    ];
  }

  updateQuality() {
    for (const item of this.items) {
      this.strategyFor(item).update(item);
    }

    return this.items;
  }

  private strategyFor(item: Item): ItemUpdateStrategy {
    return this.strategies.find((strategy) => strategy.canHandle(item))!;
  }
}

interface ItemUpdateStrategy {
  canHandle(item: Item): boolean;
  update(item: Item): void;
}

abstract class BaseItemStrategy implements ItemUpdateStrategy {
  private static readonly MIN_QUALITY = 0;
  private static readonly MAX_QUALITY = 50;

  private static readonly STANDARD_QUALITY_CHANGE = 1;
  private static readonly STANDARD_EXPIRED_MULTIPLIER = 2;

  abstract canHandle(item: Item): boolean;

  abstract update(item: Item): void;

  protected standardQualityChange(item: Item): number {
    const qualityChange = BaseItemStrategy.STANDARD_QUALITY_CHANGE;
    return this.hasExpired(item) ? qualityChange * BaseItemStrategy.STANDARD_EXPIRED_MULTIPLIER : qualityChange;
  }

  protected increaseQuality(item: Item, amount: number): void {
    item.quality = Math.min(BaseItemStrategy.MAX_QUALITY, item.quality + amount);
  }

  protected decreaseQuality(item: Item, amount: number): void {
    item.quality = Math.max(BaseItemStrategy.MIN_QUALITY, item.quality - amount);
  }

  protected decreaseSellIn(item: Item): void {
    item.sellIn -= 1;
  }

  protected hasExpired(item: Item): boolean {
    return item.sellIn <= 0;
  }
}

class AgedBrieStrategy extends BaseItemStrategy {
  private static readonly NAME = 'Aged Brie';

  canHandle(item: Item): boolean {
    return item.name === AgedBrieStrategy.NAME;
  }

  update(item: Item): void {
    this.increaseQuality(item, this.standardQualityChange(item));
    this.decreaseSellIn(item);
  }
}

class BackstagePassStrategy extends BaseItemStrategy {
  private static readonly NAME = 'Backstage passes to a TAFKAL80ETC concert';
  private static readonly SOON_THRESHOLD = 10;
  private static readonly VERY_SOON_THRESHOLD = 5;
  private static readonly DEFAULT_QUALITY_CHANGE = 1;
  private static readonly SOON_QUALITY_CHANGE = 2;
  private static readonly VERY_SOON_QUALITY_CHANGE = 3;

  canHandle(item: Item): boolean {
    return item.name === BackstagePassStrategy.NAME;
  }

  update(item: Item): void {
    if (this.hasExpired(item)) {
      item.quality = 0;
      this.decreaseSellIn(item);
      return;
    }

    if (item.sellIn <= BackstagePassStrategy.VERY_SOON_THRESHOLD) {
      this.increaseQuality(item, BackstagePassStrategy.VERY_SOON_QUALITY_CHANGE);
    } else if (item.sellIn <= BackstagePassStrategy.SOON_THRESHOLD) {
      this.increaseQuality(item, BackstagePassStrategy.SOON_QUALITY_CHANGE);
    } else {
      this.increaseQuality(item, BackstagePassStrategy.DEFAULT_QUALITY_CHANGE);
    }

    this.decreaseSellIn(item);
  }
}

class SulfurasStrategy implements ItemUpdateStrategy {
  private static readonly NAME = 'Sulfuras, Hand of Ragnaros';
  private static readonly QUALITY = 80;

  canHandle(item: Item): boolean {
    return item.name === SulfurasStrategy.NAME;
  }

  update(item: Item): void {
    item.quality = SulfurasStrategy.QUALITY;
  }
}

class ConjuredItemStrategy extends BaseItemStrategy {
  private static readonly PREFIX = 'Conjured';
  private static readonly CONJURED_MULTIPLIER = 2;

  canHandle(item: Item): boolean {
    return item.name.startsWith(ConjuredItemStrategy.PREFIX);
  }

  update(item: Item): void {
    const qualityChange = this.standardQualityChange(item);

    this.decreaseQuality(item, qualityChange * ConjuredItemStrategy.CONJURED_MULTIPLIER);
    this.decreaseSellIn(item);
  }
}

class NormalItemStrategy extends BaseItemStrategy {

  canHandle(_item: Item): boolean {
    return true;
  }

  update(item: Item): void {
    this.decreaseQuality(item, this.standardQualityChange(item));
    this.decreaseSellIn(item);
  }
}


