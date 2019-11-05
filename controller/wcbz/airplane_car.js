'use strict';

import airplaneCarModel from '../../models/wcbz/airplane_car'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class AirplaneCar extends BaseComponent{
	constructor(){
		super()
		this.addAirplaneCar = this.addAirplaneCar.bind(this);
		this.getAirplaneCar = this.getAirplaneCar.bind(this);
		this.getAirplaneCarCount = this.getAirplaneCarCount.bind(this);
		this.getAirplaneCarDetail = this.getAirplaneCarDetail.bind(this);
		this.updateAirplaneCar = this.updateAirplaneCar.bind(this);
		this.deleteAirplaneCar = this.deleteAirplaneCar.bind(this);
	}
	//添加人员
	async addAirplaneCar(req, res, next){
        let airplaneCar_id;
		try{
            airplaneCar_id = await this.getId('airplaneCar_id');
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
			const newAirplaneCar = {
                airplaneCar_id, // 飞机ID
                name: fields.name, // 名称
                air_code: fields.air_code,   // 飞机编号
                car_code: fields.car_code, // 有售器件编号
                lc: fields.lc, // 有售器件编号
                sm: fields.sm, // 有售器件编号
                airplane_type: fields.airplane_type, // 有售器件编号

			}
			try{
				//保存数据，并增加对应食品种类的数量
				const airplaneCar = new airplaneCarModel(newAirplaneCar);
				await airplaneCar.save();
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
	async getAirplaneCar(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
            const users = await airplaneCarModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
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
    async getAirplaneCarCount(req, res, next){
		try{
            console.log('222');
			const count = await airplaneCarModel.count()
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
	async getAirplaneCarDetail(req, res, next){
        console.log(req.params);
		const airplaneCar_id = req.params.airplaneCar_id;
		if (!airplaneCar_id || !Number(airplaneCar_id)) {
			console.log('获取ID错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'ID参数错误',
			})
			return
		}
		try{
            const airplaneCar = await airplaneCarModel.findOne({airplaneCar_id});
			res.send(airplaneCar)
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
    async updateAirplaneCar(req, res, next){
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
                airplaneCar_id,
                name,
                air_code,
                car_code,
                sm,
                zsm,
                ys,
                lc,
                airplane_type,
                car_type

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
				await airplaneCarModel.findOneAndUpdate({airplaneCar_id}, {$set: fields});
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
    async deleteAirplaneCar(req, res, next){
        console.log(req.params);
		const airplaneCar_id = req.params.airplaneCar_id;
		if (!airplaneCar_id || !Number(airplaneCar_id)) {
			console.log('airplaneCar_id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'airplaneCar_id参数错误',
			})
			return
		}
		try{
			await airplaneCarModel.findOneAndRemove({airplaneCar_id});
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

export default new AirplaneCar()