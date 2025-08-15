import * as SecureStore from 'expo-secure-store';

const save = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

const getValueFor = async (key: string) => {
  let result = await SecureStore.getItemAsync(key);
  if (result) return result;
};

const deleteValue = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};

export {save, getValueFor, deleteValue};
