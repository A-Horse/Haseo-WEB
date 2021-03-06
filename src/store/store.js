import { combineReducers } from 'redux';

import { createEpicMiddleware } from 'redux-observable';
import { applyMiddleware } from 'redux';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

import reducers from '../reducer';
import rootEpic from '../epic';

import { createSocket$ } from '../socket/socket';

import DI from '../service/di';
import { EpicAdapterService } from '../service/epic-adapter.service';
import { createSocketDispatcher } from '../ws-listener/';

import configureStore from './configureStore';

import 'rxjs/add/observable/dom/webSocket';

const socket$: WebSocketSubject<FSAction> = createSocket$();

const epicMiddleware = createEpicMiddleware(rootEpic, {
  dependencies: socket$,
  adapter: DI.get(EpicAdapterService)
});

const reducer = combineReducers({
  ...reducers
});

const store = configureStore(reducer, applyMiddleware(epicMiddleware));

createSocketDispatcher(store, socket$);

export default store;
