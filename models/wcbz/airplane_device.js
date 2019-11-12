'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const AirplaneDeviceSchema = new Schema({
    airplaneDevice_id: Number, // 飞机ID
    name: String, // 名称
    air_code: String,       // 飞机编号
    device_code: String, // 有售器件编号
    sm: Number, // 当前寿命
    zsm: Number, // 总寿命
    ys: Number, // 余寿报警阈值
    model:String


})

AirplaneDeviceSchema.index({id: 1});

const AirplaneDevice = mongoose.model('AirplaneDevice', AirplaneDeviceSchema);


export default AirplaneDevice
