/** represents a state for a pageable list */
export interface IPageableListState<T> {
  items: T[];
  nextPageToken: string | null | undefined;
  hasMadeAtLeastOneFetch: boolean;
}

/** a wrapper class for the pageable state interface */
export class PageableListState<T> {
  public state: IPageableListState<T> = {
    items: [],
    nextPageToken: undefined,
    hasMadeAtLeastOneFetch: false,
  }

  /**
   * @param {IPageableListState<T>} state
   */
  constructor(state?: IPageableListState<T>) {
    if (state) {
      this.state = state;
    }
  }

  /**
   * The number of items currently in the list.
   * @return {number}
   */
  public get length(): number {
    return this.state.items.length;
  }


  /**
   * Is there the potential to fetch more items?
   * @return {boolean}
   */
  public isPotentialForMore(): boolean {
    return Boolean(this.state.nextPageToken) ||
      !this.state.hasMadeAtLeastOneFetch;
  }

  /**
   * Should the client try to fetch more items regardless of potential?
   * @param {number} paginationCurrent
   * @param {number | undefined} paginationPageSize
   * @return {boolean}
   */
  public shouldFetchMore(
      paginationCurrent: number, paginationPageSize?: number,
  ): boolean {
    const b: number = paginationPageSize || 0;
    const count: number = this.state.items.length;
    return count < paginationCurrent * b;
  }
}
