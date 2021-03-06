// @flow
import { Map, List, fromJS } from 'immutable';
import Actions from '../action/actions';
import { transformFlowDescriptionMap } from '../util/project-helpers';

export function report(state: Map<string, *> = Map({}), action: FSAction) {
  switch (action.type) {
    case Actions.WS_GET_PROJECT_LAST_REPORT.SUCCESS: {
      const report: ProjectReport = action.payload;

      if (!report) {
        return state;
      }
      return state.updateIn([report.projectName], (list: List<ProjectReport>) => {
        if (!list) {
          return List([
            fromJS({
              ...report,
              flows: report.flows.map(transformFlowDescriptionMap)
            })
          ]);
        }
        return list.update(list.findKey((report: Map<ProjectReport>) => report.get('id') === action.payload.id), () =>
          fromJS({
            ...report,
            flows: report.flows.map(transformFlowDescriptionMap)
          })
        );
      });
    }

    case Actions.WS_GET_PROEJCT_COMMIT_MESSAGE.SUCCESS: {
      return state.updateIn([action.meta.projectName], (list: List<ProjectReport>) => {
        return list.update(
          list.findKey((report: Map<ProjectReport>) => report.get('id') === action.meta.reportId),
          report => report.update('commitMessage', () => action.payload)
        );
      });
    }

    case Actions.WS_TASK_PROJECT_FLOW_START.SUCCESS: {
      return state;
    }

    case Actions.WS_GET_PROJECT_REPORT.SUCCESS: {
      // TODO transformFlowDescriptionMap 这个到处都是，都要疯了
      const report: ProjectReport = {
        ...action.payload,
        flows: action.payload.flows.map(transformFlowDescriptionMap)
      };

      if (!report) {
        return state;
      }

      return state.updateIn([report.projectName], (list: List<ProjectReport>) => {
        if (!list) {
          return List([fromJS(report)]);
        }
        return list.unshift(fromJS(report));
      });
    }

    case Actions.TASK_PROJECT_FLOW_UNIT_UPDATE_WITH_PROJECT.SUCCESS: {
      const payload: {
        project: { name: string },
        report: {
          id: number,
          status: FlowStatus,
          flowResult: FlowResult
        }
      } =
        action.payload;

      // $flow-ignore
      const project: Map<Project> = action.meta.project;

      const reportKey: number = state
        .getIn([payload.project.name], List())
        .findKey(report => report.get('id') === payload.report.id);

      if (!(reportKey > -1)) {
        return state;
      }

      return state.updateIn([payload.project.name, reportKey], report => {
        const recievedFlowIndex = project
          .get('flows')
          .findKey(flow => flow.get('name') === payload.report.flowResult.flowName);

        const result = project.get('flows').map((flow: Map<Flow>, index: number): FlowResult => {
          const oldResultUnit: Map<FlowResult> = (report.get('result') || List()).get(index);

          return oldResultUnit
            ? oldResultUnit.get('flowName') === payload.report.flowResult.flowName
              ? fromJS(payload.report.flowResult)
              : oldResultUnit
            : index === recievedFlowIndex
              ? fromJS(payload.report.flowResult)
              : fromJS({
                  flowName: flow.get('name'),
                  status:
                    index < recievedFlowIndex ? 'SUCCESS' : index === recievedFlowIndex + 1 ? 'RUNNING' : 'WAITTING',
                  mock: true
                });
        });

        return report.update('result', () => fromJS(result));
      });
    }

    default:
      return state;
  }
}
