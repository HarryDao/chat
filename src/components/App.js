import React from 'react';
import { connect } from 'react-redux';
import { Fade } from '../styles/animations';
import Spinner from './helpers/Spinner';
import Auth from './Auth';
import Users from './Users';
import Messages from './Messages';
import MessageInput from './MessageInput';

class App extends React.PureComponent {
  renderAuth() {
    return Fade(
      { in: !this.props.user && !this.props.token },
      style => <Auth style={style} />
    );
  }

  render() {
    const { user, token, conversationActive } = this.props;
    const className = `App ${conversationActive ? 'active' : ''}`; 
    
    return (
      <div className={className}>
        {this.renderAuth()}
        <Spinner loading={!user && token} />
        <Users/>
        
        <div className='conversation'>
          <Messages/>
          <MessageInput/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth: { user, token }, message: { conversationActive } } = state;

  return { user, token, conversationActive };
}

export default connect(mapStateToProps)(App);
