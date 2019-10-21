'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    vehicle_id: Number, // 车辆ID
    model: String,       // 车辆型号
    code: String,        // 出厂号码
    name: String,
    state: String, // 状态
    organiz: String, // 单位
    service: String, // 服务机型
    armyId: String, // 部队编号
    product: String, // 生产厂
    productTime: String, // 生产时间
    life: String, // 总寿命
    stageCourse: String, // 阶段行驶里程
    repairNumber: String, // 大修次数
    taskState: String, // 车辆任务状态



})

vehicleSchema.index({id: 1});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);


export default Vehicle
