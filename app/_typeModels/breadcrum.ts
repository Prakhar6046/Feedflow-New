export interface Sort {
  column: string;
  direction: string;
}

export interface BreadcrumInitialState {
  sort: Sort;
}
