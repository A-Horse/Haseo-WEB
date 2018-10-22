// @flow
import React, { Component } from 'react';
import { Row, Col } from 'antd';

import './ProjectFlowProcess.less';

class FlowUnit extends Component<{ flow: any, percentage: number }> {
  render() {
    const { flow } = this.props;
    const percentageWidth = `${this.props.percentage * 100}%`;
    return (
      <div className={`flow-process-unit ${flow.status.toLowerCase()}`} style={{ width: percentageWidth }}>
        <div className="flow-process-unit--name">{flow.name}</div>
      </div>
    );
  }
}

export class ProjectFlowProcess extends Component<{
  flows: Array<Flow>
}> {
  render() {
    const { flows } = this.props;
    const length: number = flows.length;
    return (
      <div className="project-flow-process">
        <div>
          {flows.map((flow: Flow) => {
            const percentage = 1 / length;
            return (
              <div key={flow.name}>
                <FlowUnit flow={flow} percentage={percentage} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}