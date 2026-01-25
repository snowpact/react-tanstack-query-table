/**
 * Styles Registry
 *
 * Stores custom CSS class names for SnowTable components.
 */

export interface StylesConfig {
  /** Custom className for SearchBar input */
  searchBar?: string;
}

let styles: StylesConfig = {};

export const setStyles = (config: StylesConfig) => {
  styles = config;
};

export const getSearchBarClassName = () => styles.searchBar ?? '';

export const resetStylesRegistry = () => {
  styles = {};
};
