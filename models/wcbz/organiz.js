'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const organizSchema = new Schema({
    organiz_id: Number,
    organizId: Number,       // 姓名
    organizName: String,
    parentID: Number,
    level: Number,
    create_time: String,     // 创建时间
})

organizSchema.index({id: 1});

const Organiz = mongoose.model('Organiz', organizSchema);


export default Organiz
