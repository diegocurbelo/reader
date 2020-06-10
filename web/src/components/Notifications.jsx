import React from 'react'
import { connect } from 'react-redux'
import notifications from 'reducers/notifications'
import './Notifications.css'

class Notifications extends React.Component {

  render() {
    const { items } = this.props;
    return (
      <ul className="Notifications">
        {items.map(notification => {
          const { id, text } = notification;
          return (
            <li key={id} className="notification">
              <p className="notification__content">
                {text}
              </p>
              {/* <button className="notification__dismiss" onClick={(e) => this._handleRemoveNotification(e, id)}>x</button> */}
            </li>
          );
        })}
    </ul>
  )
  }

  // --

  _handleRemoveNotification = (e, id) => {
    e.preventDefault();
    this.props.dispatch(notifications.actions.removeNotification(id));
  };

}

const mapStateToProps = (state) => ({
  items: state.notifications.items
});

export default connect(mapStateToProps)(Notifications);
