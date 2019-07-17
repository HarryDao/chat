import React from 'react';
import { connect } from 'react-redux';
import {
  sendMessage,
  isTyping
} from '../redux/actions';

class MessageInput extends React.Component {
  state = {
    text: '',
    loading: false,
    error: null,
  }

  onInputChange = (e) => {
    if (e.target.value.length > this.state.text.length) {
      this.props.isTyping(this.props.live);
    }
    this.setState({ text: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { live, sendMessage } = this.props;

    this.setState({ loading: true }, () => {
      sendMessage(live, this.state.text, (error) => {
        this.setState({
          text: error ? this.state.text : '',
          loading: false,
          error: error || null
        });
        
        this.input.focus();
      });
    });
  }

  render() {
    return (
      <form
        className='MessageInput'
        onSubmit={this.onSubmit}
      >
        <input
          ref={input => this.input = input}
          placeholder='Type a message...'
          value={this.state.text}
          onChange={this.onInputChange}
          disabled={this.state.loading || !this.props.live}
        />
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  const { message: { live } } = state;

  return { live };
}

export default connect(
  mapStateToProps,
  {
    sendMessage,
    isTyping
  }
)(MessageInput);