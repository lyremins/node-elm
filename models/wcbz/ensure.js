'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const pensureSchema = new Schema({
    ensure_id: Number,
    filed1: String,
    filed2: String,
    filed3: String,
    filed4: String,
    filed5: String,
    filed6: String,
    filed7: String

})

pensureSchema.index({id: 1});

const Ensure = mongoose.model('Ensure', pensureSchema);


export default Ensure
