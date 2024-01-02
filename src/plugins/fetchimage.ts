import type { App as AppType } from 'vue'
import { useMemoize, type UseMemoizeCache } from '@vueuse/core'

// cache for fetchImage
class Cache extends Map {
  constructor() {
    super();
  }

  delete(key: string) {
    const result = super.get(key);
    if (result) {
      URL.revokeObjectURL(result);
    }
    return super.delete(key);
  }
}

export default {
  install: (app: AppType, options: object) => {
    // init
    const fetchImage = useMemoize(
      async (url: string): Promise<string> => {
        return fetch(url)
          .then((res) => res.blob())
          .then((blob) => URL.createObjectURL(blob));
      },
      { cache: new Cache() as UseMemoizeCache<string, Promise<string>> }
    );

    app.provide('$fetchImage', fetchImage);
  }
}
