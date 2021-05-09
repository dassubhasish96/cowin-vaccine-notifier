import React, { Fragment } from 'react';

function HowToUse(props) {
    return (
        <Fragment>
            <br/>
            <h5>About this website ?</h5>
            When vaccination slots are not available in any location in India, no need to check cowin website again and again for
            availability. You can add notification for that location here and you will be notified by email when vaccination slots will 
            be available for that location.<br/><br/>
            <h5>How to use this this website ?</h5>
            There are two types of notification, by pincode and by district. Enter pincode or select state/district and enter email, minimum age limit
            then submit. You will get email notification when vaccination slots will be available for that pin/district.<br/><br/>
            <h5>What is age filter ?</h5>
            Selecting all age will notify centers with 18 - 44 age and also centers with 45+ age. But selecting 18 - 44 or 45+ alone will notify 
            centers with that age only.
           
        </Fragment>
    );
}

export default HowToUse;
