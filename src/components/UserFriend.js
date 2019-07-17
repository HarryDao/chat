import React from 'react';

class UserFriend extends React.PureComponent {
  render() {
    const {
      username,
      active,
      uid,
      aLive,
      setLiveUser,
    } = this.props;
    const className = `UserFriend ${active ? 'active' : ''} ${aLive ? 'live' : ''}`;
    const iconName = `far fa-${active ? 'smile' : 'frown'}`;

    return (
      <li
        className={className}
        onClick={() => {setLiveUser(uid)}}
      >
        <i className={iconName}/> {username}
      </li>
    );
  }
}

export default UserFriend;