import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App, { starter } from './App.jsx';
import './styles.css';

hydrateRoot(document.getElementById('root'), <App initialPosts={window.__INITIAL_DATA__?.posts || starter} />);
