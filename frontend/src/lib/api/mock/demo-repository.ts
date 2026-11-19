import type { DemoRepository } from '../repositories'
import { simulateLatency } from './latency'
import type { DemoStore } from './store'

export function createDemoRepository(store: DemoStore): DemoRepository {
  return {
    async reset() {
      await simulateLatency()
      store.reset()
    },

    isPersistent() {
      return store.persistent
    },
  }
}
