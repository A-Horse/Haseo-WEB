import React, { Component } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import R from 'ramda';

export default class Status extends Component {
  static propTypes = {
    status: PropTypes.object.isRequired
  };

  render() {
    const { status } = this.props;
    let statusDom;
    if (status.isWaitting) {
      statusDom = <i className="fa fa-clock-o" aria-hidden="true" />;
    } else if (status.isRunning) {
      statusDom = <i className="fa fa-spinner" aria-hidden="true" />;
    } else if (status.isSuccess) {
      statusDom = <i className="fa fa-check-square" aria-hidden="true" />;
    } else {
      statusDom = <Icon type="close-circle" />;
    }

    return <div className="project-status">{statusDom}</div>;
  }
}
