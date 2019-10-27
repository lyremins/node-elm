'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const pdeviceSchema = new Schema({
    device_id: Number,
    filed1: String,
    filed2: String,
    filed3: String,
    filed4: String,
    filed5: String,
    filed6: String,
    filed7: String,
    filed8: String,
    filed9: String,
    filed10: String,
    filed11: String,
    filed12: String,
    sy: String

})

pdeviceSchema.index({id: 1});

const Device = mongoose.model('Device', pdeviceSchema);


export default Device
