'use strict';

import v2 from './v2'

import admin from './admin'
import wcbz from './wcbz'

export default app => {
	// app.get('/', (req, res, next) => {
	// 	res.redirect('/');
	// });
	app.use('/v2', v2);
	app.use('/admin', admin);
	app.use('/wcbz', wcbz);
}