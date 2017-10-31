import Actions from '../action/actions';
import R from 'ramda';
import { Map, List, fromJS } from 'immutable';

function transformProject(project) {
  const flowsNameSeq = [];
  return {
    ...project,
    flowState: project.flows.map(flow => {
      const [flowName, flowCommand] = R.flatten([R.keys(flow), R.values(flow)]);
      flowsNameSeq.push(flowName);

      const isRunning = project.status.isRunning
        ? project.status.currentFlowName === flowName
        : false;
      const isWaitting =
        !isRunning &&
        flowsNameSeq.indexOf(project.status.currentFlowName) < flowsNameSeq.indexOf(flowName) &&
        flowsNameSeq.indexOf(project.status.currentFlowName) > -1;
      return {
        name: flowName,
        isRunning,
        isWaitting,
        isSuccess: isRunning
          ? false
          : project.report.flowErrorName !== flowName &&
            flowsNameSeq.indexOf(flowName) >= 0 &&
            flowsNameSeq.indexOf(project.status.currentFlowName) <= 0
        // isFailure: project.status.flowErrorName === flowName
      };
    })
  };
}

export function projects(state = Map({ items: List() }), action) {
  switch (action.type) {
    case Actions.WS_GET_PROJECTS.SUCCESS:
      const items = action.playload.reduce((result, item) => {
        result[item.name] = transformProject(item);
        return result;
      }, {});
      return state.set('items', fromJS(items));
      break;

    case Actions.WS_PROJECT_UPDATE.SUCCESS:
      return state.updateIn(['items', action.playload.name], () =>
        fromJS(transformProject(action.playload))
      );

      break;

    case Actions.WS_PROJECT_UNIT_FRAGMENT_UPDATE.SUCCESS:
      return state.updateIn(
        ['items', action.playload.name, 'status', 'flowsOutput'],
        flowsOutput => {
          if ((flowsOutput.last() || Map({})).get('flowName') === action.playload.flowName) {
            return flowsOutput.set(
              -1,
              flowsOutput
                .last()
                .update('output', fragments => fragments.push(action.playload.fragment))
            );
          }
          return flowsOutput.push(
            Map({ flowName: action.playload.flowName, output: List([action.playload.fragment]) })
          );
        }
      );
      break;

    default:
      return state;
  }
}
