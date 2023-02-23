import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import rootReducer from './../reducers/rootReducer.js';

const store=configureStore({reducer:rootReducer})

export default store;
