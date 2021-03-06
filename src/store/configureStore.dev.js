import { createStore, compose } from 'redux';
import { DevTools } from '../tool/DevTools';

export default function configureStore(rootReducer, middle) {
  const enhancer = compose(middle, DevTools.instrument());
  const store = createStore(rootReducer, enhancer);

  return store;
}
