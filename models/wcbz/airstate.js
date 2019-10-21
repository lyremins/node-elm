'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const airstateSchema = new Schema({
    wh: Number, // 飞机ID
    dx: Number,
    dj: Number,
    pg: Number,
    sf: Number,
    dty: Number
})

airstateSchema.index({id: 1});

const AirState = mongoose.model('AirState', airstateSchema);


export default AirState
