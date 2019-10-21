'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const devicestateSchema = new Schema({
    jc: Number, // 飞机ID
    dm: Number,
    zy: Number
})

devicestateSchema.index({id: 1});

const DeivceState = mongoose.model('DeivceState', devicestateSchema);


export default DeivceState
