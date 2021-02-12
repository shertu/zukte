export class PaginationResponseInformation<T> {
    public items: T[] = [];
    public nextPageToken: string | undefined;
    public hasMadeAtLeastOneFetch: boolean = false;

    /**
     * Counts the number of items.
     */
    public measureLength(): number {
        return this.items.length;
    }

    /**
     * Indication of whether there are more items which can be fetched.
     */
    public isPotentialForMore(): boolean {
        return Boolean(this.nextPageToken) || !this.hasMadeAtLeastOneFetch;
    }

    /**
     * Indication of whether the client should fetch more items.
     */
    public shouldFetchMore(paginationCurrent: number, paginationPageSize?: number): boolean {
        const b: number = paginationPageSize || 0;
        const count: number = this.measureLength();
        return count < paginationCurrent * b;
    }
}
