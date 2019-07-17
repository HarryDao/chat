import React from 'react';
import { stringifyTime } from './utils';
import { Fade } from '../styles/animations';

export default class extends React.PureComponent {
  state = { _id: null }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState._id && nextProps._id && !nextProps.isNewMessage) {
      return { _id: nextProps._id };
    }
    return null;
  }

  componentDidMount() {
    const { _id, isNewMessage, scrollToBottom } = this.props;

    if (!this.state._id && _id && isNewMessage) {
      this.setState({ _id });
    }

    if (scrollToBottom) {
      scrollToBottom(isNewMessage);
    }
  }

  renderTime() {
    const { isNewTime, time } = this.props;

    if (isNewTime) {
      return <h5>{stringifyTime(time)}</h5>;
    }
  };

  render() {
    const { uid, from, content, isFirst, isLast } = this.props;
    const optionClassName = (uid === from ? 'own' : '') +
      (isFirst ? ' first' : '') +
      (isLast ? ' last' : '');

    return Fade({ in: this.state._id }, (style) => {
      return (
        <li
          className='MessageListItem'
          style={style}
        >
          {this.renderTime()}
          <div className={`content ${optionClassName}`}>
            <p>{content}</p>
          </div>
        </li>        
      );
    });
  }
};