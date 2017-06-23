import angular from 'angular';
import mocks from 'angular-mocks';

import * as app from './app/app';

let context = require.context('./app', true, /-test$/);
context.keys().forEach(context);