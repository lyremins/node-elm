'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const wqStateSchema = new Schema({
    name: '', // 类型
    wqState_id: Number, // 飞机ID
    user: String,       // 用户id
    create_time: String, // 操作时间
    airData: {}, // 上报信息
    fsData: {} // 名称, 发射次数, 发射数量
})

wqStateSchema.index({id: 1});

const WqStateState = mongoose.model('WqStateState', wqStateSchema);


export default WqStateState
