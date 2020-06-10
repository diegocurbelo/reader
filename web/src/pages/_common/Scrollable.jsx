import React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'

const Scrollable = ({ className, children }) => (
  <div className={`Scrollable ${className || ''}`}>
    <Scrollbars
      renderTrackVertical={renderTrackVertical}
      renderThumbVertical={renderThumbVertical}
    >
      {children}
    </Scrollbars>
  </div>
);

const renderTrackVertical = ({ style, ...props }) => (
  <div className="track" style={{
    position: 'absolute',
    width: '4px',
    right: '0',
    top: '2px',
    bottom: '2px',
    borderRadius: '3px'
  }} {...props} />
);

const renderThumbVertical = ({ style, ...props }) => (
  <div className="thumb" style={{ ...style, backgroundColor: '#3b8dbd' }} {...props} />
);

export default Scrollable;