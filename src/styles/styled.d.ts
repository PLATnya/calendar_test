import 'styled-components';
import type { Theme } from './theme';

// Augment the DefaultTheme interface for styled-components theming
declare module 'styled-components' {
  // eslint-disable-next-line
  export interface DefaultTheme extends Theme {}
}
