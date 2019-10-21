'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const airplaneSchema = new Schema({
    airplane_id: Number, // 飞机ID
    model: String,       // 飞机型号
    code: String,        // 出厂号码
    army_id: String, // 部队编号
    factory: String, // 生产厂家
    date: String, // 生产时间
    unit: String, // 所属单位
    airTime: String, // 飞行时间
    airUpOrDown: String, // 总飞行起落
    airHour: String, // 飞行小时
    stageUpOrDown: String, // 阶段起落
    engine_1: String, // 发动机1小时数
    engine_2: String, // 发动机2小时
    image_path: { type: String, default: "" }, // 飞机图片
    state: String, // 飞机态势
    task: String, // 任务态势
    create_time: String, // 操作时间
    type: String, // 机型
    stageUpOrDownTime: String, // 阶段飞行小时
    repairNumber: String, // 大修次数

})

airplaneSchema.index({id: 1});

const Airplane = mongoose.model('Airplane', airplaneSchema);


export default Airplane
