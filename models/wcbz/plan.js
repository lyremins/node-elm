'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const planSchema = new Schema({
    plan_id: Number, // 飞机ID
    name: String, // 计划名称
    dateTime: String, // 出厂日期
    totalNumber: String, // 总人数
    approachTime: String, // 进场时间
    airData: [{
        airName: String, // 飞机名称
        airSubject: String,
        sceneSubject: String, // 气象科目
        upDownNumber: String, // 起落次数
        flightTime: String, // 飞行时间
        xd:[{
            name: String,
            number: Number
        }]
    }],
    airName: String,
    vehicleName: String,
    subjectName: String,
    dateTime: String, // 选择日期
    airSubject: String, // 飞行科目
    sceneSubject: String, // 气象科目
    upDownNumber: String, // 起落次数
    flightTime: String, // 飞行时间
    confirm: String, // 确认


})

planSchema.index({id: 1});

const Plan = mongoose.model('Plan', planSchema);


export default Plan
