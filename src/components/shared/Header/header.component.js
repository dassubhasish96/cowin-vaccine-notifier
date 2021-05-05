import React, { Fragment } from 'react';
import banner from './largest-vaccine-banner.jpeg';

function Header(props) {
    return (
        <Fragment>
            <img src= {banner} alt="vaccine banner" ></img>
        </Fragment>
    );
}

export default Header;