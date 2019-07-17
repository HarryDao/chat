import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import {
  fetchUsers,
  setLiveUser,
} from '../redux/actions';
import UserFriend from './UserFriend';

class Users extends React.PureComponent {
  state = {
    loading: false,
    error: null,
  }

  componentDidUpdate(prevProps) {
    if (this.props.user && !prevProps.user) {
      this.setState({ loading: true }, () => {
        this.props.fetchUsers((err) => {
          this.setState({ loading: false, error: err || null });
        });
      });
    }
  }

  render() {
    const { user, friends, live, setLiveUser } = this.props;
    const username = (user && user.username) || '';

    return (
      <div className='Users'>
        
        <div className='self'>
          <h4><i className='fa fa-user'/> {username}</h4>
        </div>

        <div className='friends'>
          <ul>
            {friends.map(friend => {
              return (
                <UserFriend
                  key={friend.uid}
                  { ...friend }
                  setLiveUser={setLiveUser}
                  aLive={friend.uid === live}
                />
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    auth: { user },
    users: { users, active },
    message: { live },
  } = state;

  const friends = _.map(users, user => {
      return ({ ...user, active: active.includes(user.uid) });
    })
    .filter(({ uid }) => user && user.uid !== uid)
    .sort((a, b) => {
      if (a.active === b.active) {
        return a.username > b.username ? 1: -1;
      }
      
      return a.active > b.active ? -1 : 1;
    });

  return { user, friends, live };
}

export default connect(
  mapStateToProps,
  {
    fetchUsers,
    setLiveUser,
  }
)(Users);