import React from 'react';
import { connect } from 'react-redux';
import {
  fetchMessages,
  switchToUsersPanel,
  finishRenderNewMessage,
} from '../redux/actions';
import Spinner from './helpers/Spinner';
import MessageListItem from './MessageListItem';
import IsTyping from './IsTyping';
import { classifyMessages } from './utils';

class Messages extends React.Component {
  state = {
    loading: false,
    error: null,
  }

  scrollTimeout = null

  componentDidUpdate(prevProps, prevState) {
    const { live, messages, fetchMessages } = this.props;

    if (prevProps.live !== live && !messages[live]) {
      this.setState({ loading: true }, () => {
        fetchMessages(live, (error) => {
          this.setState({
            loading: false,
            error: error || null
          });
        });
      });
    }
  }

  scrollToBottom = (isNew) => {
    clearTimeout(this.scrollTimeout);
    if (isNew) {
      this.props.finishRenderNewMessage(this.props.live);
    }
    this.scrollTimeout = setTimeout(() => {
      if (this.panel) {
        this.panel.scrollTop = this.panel.scrollHeight;
      }

      if (this.list) {
        this.list.scrollTop = this.list.scrollHeight;
      }
    }, isNew ? 100: 0);
  }

  renderBackButton() {
    return (
      <button onClick={this.props.switchToUsersPanel}>
        <i className="fas fa-chevron-left"/>
      </button>
    );
  }

  renderHeading() {
    const { friend, live, messages } = this.props;
    const { error, loading } = this.state;
    
    if (!live) {
      return <h4 className='empty'>Select a friend to start the conversation</h4>
    }

    if (error) {
      return <h4 className='error'>
        {this.renderBackButton()}
        Something went wrong
      </h4>;
    }

    if (!loading && messages[live]) {
      return (
        <h4 className={friend.active ? 'active' : ''}>
          {this.renderBackButton()}
          <i className='far fa-user'/> {friend.username}
        </h4>
      );
    }
  }

  renderContent() {
    const { live, messages, uid } = this.props;
    const { loading } = this.state;

    if (!loading && messages[live]) {
      return (
        <div className='inner'>
          <ul ref={list => this.list = list}>
            {classifyMessages(messages[live]).map((message, index, arr) => {
              const isLast = index === arr.length - 1;
              return (
                <MessageListItem
                  key={message._id}
                  uid={uid}
                  {...message}
                  scrollToBottom={isLast ? this.scrollToBottom: null}
                />
              );
            })}
            <IsTyping
              scrollToBottom={this.scrollToBottom}
            />
          </ul>
        </div>
      );      
    }
  }

  render() {
    const className = `Messages ${this.props.safari ? 'safari' : ''}`;

    return (
      <div
        className={className}
        ref={panel => this.panel = panel}
      >
        <Spinner
          loading={this.state.loading}
          bar
        />
        {this.renderHeading()}
        {this.renderContent()}
        
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let {
    browser: { safari },
    auth: { user },
    message: { live, messages },
    users: { users, active }
  } = state;

  const uid = (user && user.uid) || null;
  const friend = users[live] ? {
    ...users[live],
    active: active.includes(live)
  } : null;

  return { safari, messages, uid, friend, live };
}

export default connect(
  mapStateToProps,
  {
    fetchMessages,
    switchToUsersPanel,
    finishRenderNewMessage,
  }
)(Messages);