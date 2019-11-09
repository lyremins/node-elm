'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const faultSchema = new Schema({
    user_name: String, // 发现人
    model: String, // 故障件型号
    airModel: String,
    cj: String,
    date: String, // 装机日期
    reason: String, // 故障原因
    pheno: String,
    person: String,
    method: String,
    image_path: { type: String, default: "" }, // 故障照片
    type: String, // 故障类型
    deviceName: String, // 故障件名称,
    desc: String, // 故障描述
    factory: String, // 厂家
    create_time: String, // 创建时间
})

faultSchema.index({id: 1});

const Fault = mongoose.model('Fault', faultSchema);


export default Fault
