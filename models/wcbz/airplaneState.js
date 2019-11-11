'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const airplenStateSchema = new Schema({
    airplenState_id: Number, // 飞机ID
    user: String,       // 用户id
    create_time: String, // 操作时间
    airData: {} // 上报信息


})

airplenStateSchema.index({id: 1});

const AirplaneState = mongoose.model('AirplaneState', airplenStateSchema);


export default AirplaneState
