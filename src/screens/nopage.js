import * as React from 'react';
import {Link} from 'react-router-dom';

function NoPage() {
  return (
    <div style={{
        height: '100%',
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',}}>
      <div>
        Sorry... nothing here. <Link to="/">Go home</Link>
      </div>
    </div>
  );
}

export default NoPage;