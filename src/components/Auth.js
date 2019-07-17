import React from 'react';
import { connect } from 'react-redux';
import { signIn } from '../redux/actions';
import Spinner from './helpers/Spinner';
import { Fade } from '../styles/animations';

class Auth extends React.PureComponent {
  state = {
    username: '',
    password: '',
  }

  onUsernameChange = (e) => {
    this.setState({ username: e.target.value });
  }

  onPasswordChange = (e) => {
    this.setState({ password: e.target.value });
  }

  onSubmitClick = (e) => {
    e.preventDefault();

    const { username, password } = this.state;

    this.props.signIn({ username, password });
  }

  renderError() {
    return Fade({ in: this.props.error }, (style) => {
      return (
        <h4 className='error'>
          {this.props.error}
        </h4>
      );
    });
  }

  render() {
    return (
      <div
        className='Auth'
        style={this.props.style || {}}
      >
        <form>
          <Spinner
            loading={this.props.loading}
          />

          <h4>Sign in / Sign up</h4>

          <input
            placeholder='Enter your username...'
            value={this.state.username}
            onChange={this.onUsernameChange}
          />

          <input
            placeholder='Enter password...'
            type='password'
            value={this.state.password}
            onChange={this.onPasswordChange}
          
          />

          {this.renderError()}

          <button
            type='submit'
            onClick={this.onSubmitClick}
          >
            Sign in / Sign up
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { loading, error } = state.auth;

  return { loading, error };
}


export default connect(
  mapStateToProps,
  { signIn }
)(Auth);