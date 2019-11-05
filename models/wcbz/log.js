'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const faultSchema = new Schema({
    filed1: String, //
    filed2: String, //
    filed3: String,
    filed4: String,
    filed5: String,
    filed6: String,
    filed7: String,
})

logSchema.index({id: 1});

const Log = mongoose.model('Log', logSchema);


export default Log
