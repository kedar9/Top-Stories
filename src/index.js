import React from 'react';
import ReactDOM from 'react-dom';
import { initializeIcons } from '@uifabric/icons';

import Home from './components/Home/index.jsx';
import './styles.scss';

// Initialize MS Fabric Icons
initializeIcons();

const Index = () => {
  return <Home />;
};

ReactDOM.render(<Index />, document.getElementById('index'));
