import { computed, signal, Signal, WritableSignal } from '@angular/core';

export class PagedList<T> {
  public readonly totalItems: Signal<number>;
  public readonly totalPages: Signal<number>;
  public readonly hasPreviousPage: Signal<boolean>;
  public readonly hasNextPage: Signal<boolean>;
  public readonly pagedItems: Signal<T[]>;
  protected readonly _page: WritableSignal<number>;
  protected readonly _pageSize: WritableSignal<number>;
  protected readonly _items: WritableSignal<T[]>;

  constructor(items: T[], pageSize: number) {
    this._items = signal(items);
    this._pageSize = signal(pageSize);
    this._page = signal(1);

    this.totalItems = computed(() => this._items().length);
    this.totalPages = computed(() => Math.ceil(this.totalItems() / this._pageSize()));
    this.hasPreviousPage = computed(() => this.page() > 1);
    this.hasNextPage = computed(() => this.page() < this.totalPages());

    this.pagedItems = computed(() => {
      const startIndex = (this.page() - 1) * this._pageSize();
      const endIndex = Math.min(startIndex + this._pageSize(), this.totalItems());
      return this._items().slice(startIndex, endIndex);
    });
  }

  public get items() {
    return this._items as Signal<T[]>;
  }

  public get page() {
    return this._page as Signal<number>;
  }

  public get pageSize() {
    return this._pageSize as Signal<number>;
  }

  public setPage(page: number): void {
    if (page > 0 && page <= this.totalPages()) {
      this._page.set(page);
    }
  }

  public nextPage(): void {
    if (this.hasNextPage()) {
      this.setPage(this.page() + 1);
    }
  }

  public previousPage(): void {
    if (this.hasPreviousPage()) {
      this.setPage(this.page() - 1);
    }
  }

  public addItem(item: T): void {
    this._items.update((items) => [...items, item]);
  }

  public removeItem(predicate: (item: T) => boolean): void {
    this._items.update((items) => items.filter((item) => !predicate(item)));
  }

  public setData(items: T[]): void {
    this._items.set(items);
    this.setPage(1);
  }

  public setPageSize(pageSize: number) {
    this._pageSize.set(pageSize);
    this.setPage(1);
  }
}
