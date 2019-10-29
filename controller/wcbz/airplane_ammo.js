'use strict';

import airplaneAmmoModel from '../../models/wcbz/airplane_ammo'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class AirplaneAmmo extends BaseComponent{
	constructor(){
		super()
		this.addAirplaneAmmo = this.addAirplaneAmmo.bind(this);
		this.getAirplaneAmmo = this.getAirplaneAmmo.bind(this);
		this.getAirplaneAmmoCount = this.getAirplaneAmmoCount.bind(this);
		this.getAirplaneAmmoDetail = this.getAirplaneAmmoDetail.bind(this);
		this.updateAirplaneAmmo = this.updateAirplaneAmmo.bind(this);
		this.deleteAirplaneAmmo = this.deleteAirplaneAmmo.bind(this);
	}
	//添加人员
	async addAirplaneAmmo(req, res, next){
        let airplaneAmmo_id;
		try{
            airplaneAmmo_id = await this.getId('airplaneAmmo_id');
		}catch(err){
			console.log('获取id失败');
			res.send({
				type: 'ERROR_DATA',
				message: '获取数据失败'
			})
			return
		}
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const newAirplaneAmmo = {
                airplaneAmmo_id, // 飞机ID
                name: fields.name, // 名称
                air_code: fields.air_code,   // 飞机编号
                ammo_code: fields.ammo_code, // 有售器件编号

			}
			try{
				//保存数据，并增加对应食品种类的数量
				const airplaneAmmo = new airplaneAmmoModel(newAirplaneAmmo);
				await airplaneAmmo.save();
				res.send({
					status: 1,
					sussess: '添加成功'
				})
			}catch(err){
				console.log('写入数据库失败');
				res.send({
					status: 0,
					type: 'ERROR_SERVER',
					message: '添加失败',
				})
			}
		})
    }
    // 查询人员
	async getAirplaneAmmo(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
            const users = await airplaneAmmoModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
            console.log(users);
			res.send({
				status: 1,
				data: users,
			})
		}catch(err){
			console.log('获取飞机列表数据失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取飞机列表数据失败'
			})
		}
    }
    // 查询人员条数
    async getAirplaneAmmoCount(req, res, next){
		try{
            console.log('222');
			const count = await airplaneAmmoModel.count()
			res.send({
				status: 1,
				count,
			})
		}catch(err){
			console.log('获取飞机数量失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_ADMIN_COUNT',
				message: '获取飞机数量失败'
			})
		}
    }
    // 获取人员详情
	async getAirplaneAmmoDetail(req, res, next){
        console.log(req.params);
		const airplaneAmmo_id = req.params.airplaneAmmo_id;
		if (!airplaneAmmo_id || !Number(airplaneAmmo_id)) {
			console.log('获取ID错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'ID参数错误',
			})
			return
		}
		try{
            const airplaneAmmo = await airplaneAmmoModel.findOne({airplaneAmmo_id});
			res.send(airplaneAmmo)
		}catch(err){
			console.log('获取人员详情失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取人员详情失败'
			})
		}
    }
    // 更新人员
    async updateAirplaneAmmo(req, res, next){
        const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if (err) {
				console.log('获取信息form出错', err);
				res.send({
					status: 0,
					type: 'ERROR_FORM',
					message: '表单信息错误',
				})
				return
			}
			const {
                airplaneAmmo_id,
                name,
                air_code,
                ammo_code,
                sm,
                zsm,
                ys

            } = fields;
            console.log(fields);
            const create_time = dtime().format('YYYY-MM-DD HH:mm');
			try {
				let newData;
				newData = {
                    model,
                    code
                    // army_id,
                    // factory,
                    // date,
                    // unit,
                    // airTime,
                    // airUpOrDown,
                    // yairUpOrDown,
                    // airHour,
                    // yairHour,
                    // stageUpOrDown,
                    // engine_1,
                    // engine_2,
                    // image_path,
                    // state,
                    // task,
                    // create_time,
                    // type,
                    // stageUpOrDownTime,
                    // repairNumber,
                    // repairFactory
                }
                console.log(newData);
				await airplaneAmmoModel.findOneAndUpdate({airplaneAmmo_id}, {$set: fields});
				res.send({
					status: 1,
					success: '修改信息成功',
				})
			}catch(err){
				console.log(err.message, err);
				res.send({
					status: 0,
					type: 'ERROR_UPDATE_RESTAURANT',
					message: '更新信息失败',
				})
			}
		})
    }
    // 删除人员
    async deleteAirplaneAmmo(req, res, next){
        console.log(req.params);
		const airplaneAmmo_id = req.params.airplaneAmmo_id;
		if (!airplaneAmmo_id || !Number(airplaneAmmo_id)) {
			console.log('airplaneAmmo_id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'airplaneAmmo_id参数错误',
			})
			return
		}
		try{
			await airplaneAmmoModel.findOneAndRemove({airplaneAmmo_id});
			res.send({
				status: 1,
				success: '删除成功',
			})
		}catch(err){
			console.log('删除失败', err);
			res.send({
				status: 0,
				type: 'DELETE_RESTURANT_FAILED',
				message: '删除失败',
			})
		}
	}
}

export default new AirplaneAmmo()