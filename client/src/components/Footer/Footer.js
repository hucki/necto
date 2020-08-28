import React from 'react';
import classes from './Footer.module.css';

function Footer() {
  return (
    <div className={classes.Footer}>
      <p>
        made with{' '}
        <span role="img" aria-label="pineapple">
          🍍
        </span>
        <span role="img" aria-label="pizza">
          🍕
        </span>{' '}
        by Hucki
      </p>
    </div>
  );
}

export default Footer;
