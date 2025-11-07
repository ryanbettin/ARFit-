declare module '@react-native-async-storage/async-storage' {
  type MultiGetResult = [string, string | null];
  type MultiSetEntry = [string, string];

  interface AsyncStorageStatic {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
    multiGet(keys: string[]): Promise<MultiGetResult[]>;
    multiSet(entries: MultiSetEntry[]): Promise<void>;
    multiRemove(keys: string[]): Promise<void>;
  }

  const AsyncStorage: AsyncStorageStatic;
  export default AsyncStorage;
  export type { MultiGetResult, MultiSetEntry, AsyncStorageStatic };
}
