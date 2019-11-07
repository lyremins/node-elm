'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const logSchema = new Schema({
    log_id: String, //
    user: String, //
    create_time: String,
    action: String,
    data: String,
    filed6: String,
    filed7: String,
})

logSchema.index({id: 1});

const Log = mongoose.model('Log', logSchema);


export default Log
