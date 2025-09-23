import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'session';

export async function saveSession(session) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Erro ao salvar sessão', e);
  }
}

export async function getSession() {
  try {
    const s = await AsyncStorage.getItem(KEY);
    return s ? JSON.parse(s) : null;
  } catch (e) {
    return null;
  }
}

export async function getToken() {
  const session = await getSession();
  return session?.token || null;
}

export async function clearSession() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {
    console.error('Erro ao limpar sessão', e);
  }
}
