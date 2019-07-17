import React from 'react';
import { connect } from 'react-redux';
import { BeatLoader } from 'react-spinners';
import { Fade } from '../styles/animations';

class IsTyping extends React.PureComponent {
  state = { isTyping: null }

  componentDidUpdate(prevProps, prevState) {
    const { isTyping, scrollToBottom } = this.props;

    if (prevState.isTyping !== isTyping) {
      this.setState({ isTyping }, scrollToBottom);
    }
  }

  render() {
    return Fade({ in: this.state.isTyping }, style => {
      return (
        <li
          className='IsTyping'
          style={style}
        >
          <BeatLoader
            sizeUnit='px'
            size={8}          
          />
        </li>
      );
    }, {
      exiting: { opacity: 0, display: 'none' }
    });
  }
}

const mapStateToProps = (state) => {
  const { live, typing } = state.message;

  return { isTyping: (live && typing[live]) || null };
};

export default connect(mapStateToProps)(IsTyping); 

