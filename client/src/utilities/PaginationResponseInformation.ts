/** represents a stored response from a pagination request */
export class PaginationResponseInformation<T> {
  public items: T[] = [];
  public nextPageToken: string | undefined;
  public hasMadeAtLeastOneFetch: boolean = false;

  /** gets the length of the items array */
  public get length(): number {
    return this.items.length;
  }

  /**
   * indicates whether there are more items which can be fetched
   * @return {boolean}
   */
  public isPotentialForMore(): boolean {
    return Boolean(this.nextPageToken) || !this.hasMadeAtLeastOneFetch;
  }

  /**
   * indicates whether the client should fetch more items
   * @param {number} paginationCurrent
   * @param {number | undefined} paginationPageSize
   * @return {boolean}
   */
  public shouldFetchMore(
      paginationCurrent: number, paginationPageSize?: number,
  ): boolean {
    const b: number = paginationPageSize || 0;
    const count: number = this.length;
    return count < paginationCurrent * b;
  }
}
