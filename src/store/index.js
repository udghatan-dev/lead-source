import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
//import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export async function configureStore(initialState) {
  // const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middlewares)));
  // sagaMiddleware.run(rootSaga);
  // return store;

  const { default: rootSaga } = await import('./sagas');

  const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middlewares)));

  // Run the root saga
  sagaMiddleware.run(rootSaga);
  return store;
}
