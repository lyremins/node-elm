'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const pequipSchema = new Schema({
    equip_id: Number,
    filed1: String,
    filed2: String,
    filed3: String,
    filed4: String,
    filed5: String,
    filed6: String,
    filed7: String

})

pequipSchema.index({id: 1});

const Equip = mongoose.model('Equip', pequipSchema);


export default Equip
