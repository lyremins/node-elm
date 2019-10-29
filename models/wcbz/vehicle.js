'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    organiz: String, // 单位
    vehicle_id: Number, // 车辆ID
    model: String,       // 车辆类型
    name: String, // 车辆名称
    service: String, // 服务机型
    code: String,    // 出厂号码
    armyId: String, // 部队编号
    product: String, // 制造厂
    productTime: String, // 出厂时间
    mileage: String, // 总里程
    life: String, // 总寿命
    stageCourse: String, // 行驶里程
    repairNumber: String, // 大修次数
    state: String, // 车辆状态
    taskState: String, // 车辆任务状态
    enter: String, // 进场状态



})

vehicleSchema.index({id: 1});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);


export default Vehicle
