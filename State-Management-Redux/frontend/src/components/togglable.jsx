import { useState } from 'react';
import PropTypes from 'prop-types';

const Togglable = (props) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  return (
    <>
      <div style={hideWhenVisible}>
        <button onClick={() => setVisible(!visible)}>{props.label}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={() => setVisible(!visible)}>cancel</button>
      </div>
    </>
  );
};

Togglable.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Togglable;
