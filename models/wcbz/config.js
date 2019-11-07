'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const configSchema = new Schema({
    stateModel: String,
    taskModel: String,
    faultModel: String, // 飞机故障
    subjectModel: String, // 飞行科目
    sceneModel: String, // 气象科目
    carStateModel: String, // 车辆状态
    carTaskModel: String, // 车辆任务
    carTypeModel: String, // 车辆类型
    carFaultModel: String, // 车辆故障
    pTypeModel: String, // 人员类别
    pMajorModel: String, // 人员专业
    pPostModel: String, // 人员职务
    ensureModel: String, // 保障任务
    pStatusModel: String, // 人员工作状态
    carWorkModel: String,  // 车辆工作状态
    airTypeModel: String  // 飞机类型
})

configSchema.index({id: 1});

const Config = mongoose.model('Config', configSchema);


export default Config
