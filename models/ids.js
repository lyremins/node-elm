'use strict';

import mongoose from 'mongoose'

const idsSchema = new mongoose.Schema({
	restaurant_id: Number,
	food_id: Number,
	order_id: Number,
	user_id: Number,
	address_id: Number,
	cart_id: Number,
	img_id: Number,
	category_id: Number,
	item_id: Number,
	sku_id: Number,
	admin_id: Number,
    statis_id: Number,
    person_id: Number,
    airplane_id: Number,
    equip_id: Number,
    ensure_id: Number,
    device_id: Number,
    vehicle_id: Number,
    subject_id: Number,
    plan_id: Number,
    organiz_id: Number,
    ammo_id: Number,
    airplaneDevice_id: Number,
    airplaneAmmo_id: Number,
    airplaneCar_id: Number,
    chat_id: Number,
    log_id: Number
});

const Ids = mongoose.model('Ids', idsSchema);

Ids.findOne((err, data) => {
	if (!data) {
		const newIds = new Ids({
			restaurant_id: 0,
			food_id: 0,
			order_id: 0,
			user_id: 0,
			address_id: 0,
			cart_id: 0,
			img_id: 0,
			category_id: 0,
			item_id: 0,
			sku_id: 0,
			admin_id: 0,
            statis_id: 0,
            person_id: 0,
            airplane_id:0,
            equip_id: 0,
            ensure_id: 0,
            device_id: 0,
            vehicle_id: 0,
            subject_id: 0,
            plan_id: 0,
            organiz_id: 0,
            ammo_id: 0,
            airplaneDevice_id: 0,
            airplaneCar_id: 0,
            airplaneAmmo_id: 0,
            chat_id: 0,
            log_id: 0
		});
		newIds.save();
	}
})
export default Ids