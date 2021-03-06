// @flow
import { map, splitAt, join, split, compose } from 'ramda';
import Actions from '../action/actions';
import type { Store } from 'redux';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/delay';

export const createSocketDispatcher = (store: Store<*, *>, socket$: WebSocketSubject<FSAction>) => {
  const { dispatch } = store;

  socket$.retryWhen(error => error.delay(1000)).subscribe((wsAction: FSAction): void => {
    // $flow-ignore
    const [actionName, status: ActionType] = compose(map(join('_')), splitAt(-1), split('_'))(
      wsAction.type
    );

    const actionAdapter: ActionAdapter = Actions[actionName];

    if (!actionAdapter) {
      console.warn(`Can not found action "${actionName}" adapter.`);
      return;
    }

    // $flow-ignore
    const actionFn = actionAdapter[status.toLowerCase()];

    process.env.NODE_ENV !== 'production' && console.log(actionFn(wsAction.payload, wsAction.meta));
    dispatch(actionFn(wsAction.payload, wsAction.meta));
  });
};
