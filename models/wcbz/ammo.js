'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const pammoSchema = new Schema({
    ammo_id: Number,
    filed1: String,
    filed2: String,
    filed3: String,
    filed4: String,
    filed5: String,
    filed6: String,
    filed7: String

})

pammoSchema.index({id: 1});

const ammo = mongoose.model('ammo', pammoSchema);


export default ammo
