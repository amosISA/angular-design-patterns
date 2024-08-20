export interface SearchStrategy {
  filter(searchTerm: string): void;
}
