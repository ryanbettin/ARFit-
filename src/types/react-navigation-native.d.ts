declare module '@react-navigation/native' {
  export function useIsFocused(): boolean;

  export type NavigationProp = {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
    [key: string]: (...args: any[]) => any;
  };

  export function useNavigation<T extends NavigationProp = NavigationProp>(): T;
}
