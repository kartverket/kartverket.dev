/**
 * Prevents duplicate API calls across all hook instances
 */

import { minutesToMilliseconds } from 'date-fns';

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  isLoading: boolean;
}

class GlobalCache {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL_MS = minutesToMilliseconds(5);
  private readonly loadingPromises = new Map<string, Promise<any>>();

  /**
   * Generate a cache key for an API endpoint and parameters
   */
  generateKey(endpoint: string, params: Record<string, any> = {}): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${JSON.stringify(params[key])}`)
      .join('&');
    return `${endpoint}?${sortedParams}`;
  }

  /**
   * Get cached data if available and not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Sjekk om cache fortsatt er gyldig
    if (Date.now() - entry.timestamp > this.CACHE_TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      isLoading: false,
    });
  }

  /**
   * Check if data is currently being loaded
   */
  isLoading(key: string): boolean {
    const entry = this.cache.get(key);
    return entry?.isLoading || this.loadingPromises.has(key);
  }

  /**
   * Mark data as loading
   */
  setLoading(key: string): void {
    const existing = this.cache.get(key);
    this.cache.set(key, {
      data: existing?.data,
      timestamp: existing?.timestamp || Date.now(),
      isLoading: true,
    });
  }

  /**
   * Clear loading state
   */
  clearLoading(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      entry.isLoading = false;
    }
  }

  /**
   * Execute a function with caching and loading state management
   * Prevents duplicate API calls for the same key
   */
  async executeWithCache<T>(
    key: string,
    fetchFunction: () => Promise<T>,
  ): Promise<T> {
    // Sjekk om data allerede er cachet
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Sjekk om allerede laster
    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key)!;
    }

    // Mark as loading
    this.setLoading(key);

    // Create the loading promise
    const loadingPromise = fetchFunction()
      .then(result => {
        this.set(key, result);
        this.clearLoading(key);
        this.loadingPromises.delete(key);
        return result;
      })
      .catch(error => {
        this.clearLoading(key);
        this.loadingPromises.delete(key);
        throw error;
      });

    this.loadingPromises.set(key, loadingPromise);
    return loadingPromise;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  /**
   * Clear expired cache entries
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.CACHE_TTL_MS) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics for debugging
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      loadingPromises: this.loadingPromises.size,
      entries: Array.from(this.cache.keys()),
      cacheContent: Object.fromEntries(this.cache.entries()),
    };
  }
}

// Export a singleton instance
export const globalCache = new GlobalCache();

// Make cache available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).securityMetricsGlobalCache = globalCache;
}

// Clean up expired entries periodically
setInterval(() => {
  globalCache.clearExpired();
}, 60000); // Every minute
