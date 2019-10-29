'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const AirplaneCarSchema = new Schema({
    airplaneCar_id: Number, // 飞机ID
    name: String, // 名称
    air_code: String,       // 飞机编号
    car_code: String, // 有售器件编号


})

AirplaneCarSchema.index({id: 1});

const AirplaneCar = mongoose.model('AirplaneCar', AirplaneCarSchema);


export default AirplaneCar
