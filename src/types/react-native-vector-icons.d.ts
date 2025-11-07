declare module 'react-native-vector-icons/*' {
  import * as React from 'react';
  import { TextStyle } from 'react-native';

  export interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle;
  }

  export default class Icon extends React.Component<IconProps> {}
}
