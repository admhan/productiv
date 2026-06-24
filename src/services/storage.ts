import type { AppData } from '../types';

const STORAGE_KEY = 'productiv-data';
const API_KEY_STORAGE = 'productiv-api-key';

function getDefaultData(): AppData {
  return {
    tasks: [],
    inbox: [],
    spaces: [],
    projects: [],
    notes: [],
  };
}

export function loadData(): AppData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return getDefaultData();
  try {
    return JSON.parse(raw) as AppData;
  } catch {
    return getDefaultData();
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function exportData(): string {
  return JSON.stringify(loadData(), null, 2);
}

export function importData(json: string): AppData {
  const data = JSON.parse(json) as AppData;
  saveData(data);
  return data;
}

export function getApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE) ?? '';
}

export function setApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE, key);
}
