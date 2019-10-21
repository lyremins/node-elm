'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const taskstateSchema = new Schema({
    fxq: Number, // 飞机ID
    zccd: Number,
    fxh: Number,
    dj: Number,
    sc: Number
})

taskstateSchema.index({id: 1});

const TaskState = mongoose.model('TaskState', taskstateSchema);


export default TaskState
