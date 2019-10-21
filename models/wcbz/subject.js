'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    subject_id: Number, // 飞机ID
    name: String
})

subjectSchema.index({id: 1});

const Subject = mongoose.model('Subject', subjectSchema);


export default Subject
