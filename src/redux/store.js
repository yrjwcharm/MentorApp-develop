import { applyMiddleware, createStore } from 'redux'

import { composeWithDevTools } from 'redux-devtools-extension'
import { offline } from '@redux-offline/redux-offline'
import offlineConfig from '@redux-offline/redux-offline/lib/defaults'
import { rootReducer } from './reducer'
import { setHydrated } from './actions'
import { setLanguage } from '../i18n'
import thunk from 'redux-thunk'

let rehydrated = false

export const getHydrationState = () => rehydrated

const setHydratedState = () => store.dispatch(setHydrated())

const store = createStore(
  rootReducer,
  composeWithDevTools(
    offline({
      ...offlineConfig,
      persistOptions: {
        blacklist: ['hydration']
      },
      // this fires after store hydration is done
      persistCallback: () => {
        setLanguage()
        setHydratedState()
      },
      retry: () => 300000 // retry  every 5 minutes
    }),
    applyMiddleware(thunk)
  )
)

export default store
