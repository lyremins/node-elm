'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const AirplaneAmmoSchema = new Schema({
    airplaneAmmo_id: Number, // 飞机ID
    name: String, // 名称
    air_code: String,       // 飞机编号
    ammo_code: String, // 有售器件编号


})

AirplaneAmmoSchema.index({id: 1});

const AirplaneAmmo = mongoose.model('AirplaneAmmo', AirplaneAmmoSchema);


export default AirplaneAmmo
