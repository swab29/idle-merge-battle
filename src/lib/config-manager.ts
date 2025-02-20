import enemyStats from '@/config/stats/enemy-stats.json';
import playerStats from '@/config/stats/player-stats.json';
import equipmentStats from '@/config/stats/equipment-stats.json';

// Type definitions for the configuration
export interface ConfigManager {
  getConfig: (type: 'enemy' | 'player' | 'equipment') => any;
  saveConfig: (type: 'enemy' | 'player' | 'equipment', config: any) => void;
  resetConfig: (type: 'enemy' | 'player' | 'equipment') => void;
  exportConfigs: () => string;
  importConfigs: (jsonString: string) => void;
}

const defaultConfigs = {
  enemy: enemyStats,
  player: playerStats,
  equipment: equipmentStats
};

class ConfigManagerImpl implements ConfigManager {
  private configs: Record<string, any>;

  constructor() {
    this.configs = this.loadConfigs();
  }

  private loadConfigs() {
    const savedConfigs = localStorage.getItem('game-configs');
    if (savedConfigs) {
      try {
        return JSON.parse(savedConfigs);
      } catch (e) {
        console.error('Error loading configs:', e);
        return { ...defaultConfigs };
      }
    }
    return { ...defaultConfigs };
  }

  private persistConfigs() {
    localStorage.setItem('game-configs', JSON.stringify(this.configs));
  }

  getConfig(type: 'enemy' | 'player' | 'equipment') {
    return this.configs[type];
  }

  saveConfig(type: 'enemy' | 'player' | 'equipment', config: any) {
    this.configs[type] = config;
    this.persistConfigs();
  }

  resetConfig(type: 'enemy' | 'player' | 'equipment') {
    this.configs[type] = defaultConfigs[type];
    this.persistConfigs();
  }

  exportConfigs() {
    return JSON.stringify(this.configs, null, 2);
  }

  importConfigs(jsonString: string) {
    try {
      const newConfigs = JSON.parse(jsonString);
      this.configs = newConfigs;
      this.persistConfigs();
    } catch (e) {
      console.error('Error importing configs:', e);
      throw new Error('Invalid configuration format');
    }
  }
}

export const configManager = new ConfigManagerImpl(); 