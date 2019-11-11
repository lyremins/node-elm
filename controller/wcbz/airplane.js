'use strict';

import logModel from '../../models/wcbz/log'
import airplaneModel from '../../models/wcbz/airplane'
import airplaneStateModel from '../../models/wcbz/airplaneState'
import wqStateModel from '../../models/wcbz/wqState'
import airplaneDeviceModel from '../../models/wcbz/airplane_device'
import airplaneAmmoModel from '../../models/wcbz/airplane_ammo'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Airplane extends BaseComponent{
	constructor(){
		super()
		this.addAirplane = this.addAirplane.bind(this);
		this.getAirplane = this.getAirplane.bind(this);
		this.getAirplaneCount = this.getAirplaneCount.bind(this);
		this.getAirplaneDetail = this.getAirplaneDetail.bind(this);
		this.updateAirplane = this.updateAirplane.bind(this);
        this.deleteAirplane = this.deleteAirplane.bind(this);

	}
	//添加飞机
	async addAirplane(req, res, next){
        console.log(req.query);

        let airplane_id;
		try{
            airplane_id = await this.getId('airplane_id');
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

            // 生成日志id  -----开始
            let log_id;
            try{
                log_id = await this.getId('log_id');
                console.log(log_id);
            }catch(err){
                console.log('获取id失败');
                res.send({
                    type: 'ERROR_DATA',
                    message: '获取数据失败'
                })
                return
            }
            const data = {
                log_id,
                user: req.query.uid,
                action: '添加了1架飞机',
                create_time: dtime().format('YYYY-MM-DD HH:mm'),
                data: JSON.stringify(fields)
            }
            const log = new logModel(data);
            await log.save();
            console.log(JSON.stringify(fields));

            // ----- 结束
			try{
				if (!fields.model) {
					throw new Error('必须填写型号');
				}
			}catch(err){
				console.log('前台参数出错', err.message);
				res.send({
					status: 0,
					type: 'ERROR_PARAMS',
					message: err.message
				})
				return
			}
			const newAirplane = {
                airplane_id, // 飞机ID
                type: fields.type, // 机型
                model: fields.model,       // 飞机型号
                code: fields.code,        // 出厂号码
                army_id: fields.army_id, // 部队编号
                factory: fields.factory, // 生产厂家
                date: fields.date, // 生产时间
                unit: fields.unit, // 所属单位
                airTime: fields.airTime, // 飞行时间
                airUpOrDown: fields.airUpOrDown, // 总飞行起落
                yairUpOrDown: fields.yairUpOrDown, // 已飞行起落
                airHour: fields.airHour, // 飞行小时
                yairHour: fields.yairHour, // 已行小时
                stageUpOrDown: fields.stageUpOrDown, // 阶段起落
                engine_1: fields.engine_1, // 发动机1小时数
                engine_2: fields.engine_2, // 发动机2小时
                image_path: fields.image_path, // 飞机图片
                create_time: dtime().format('YYYY-MM-DD HH:mm'),
                stageUpOrDownTime: fields.stageUpOrDownTime, // 阶段飞行小时
                repairNumber: fields.repairNumber, // 大修次数
                repairFactory: fields.repairFactory, // 大修次数
                state: fields.state, // 飞机态势
                task: fields.task, // 飞机任务态势
                wqNumber: fields.wqNumber, // 武器发射

			}
			try{
				//保存数据，并增加对应食品种类的数量
				const airplane = new airplaneModel(newAirplane);
				await airplane.save();
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
	async getAirplane(req, res, next){
        console.log(req.query);

		const {limit = 1000, offset = 0} = req.query;
		try{
            const users = await airplaneModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
            // console.log(users);
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
    async getAirplaneCount(req, res, next){
		try{
            console.log('222');
			const count = await airplaneModel.count()
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
	async getAirplaneDetail(req, res, next){
        console.log(req.params);
		const airplane_id = req.params.airplane_id;
		if (!airplane_id || !Number(airplane_id)) {
			console.log('获取ID错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'ID参数错误',
			})
			return
		}
		try{
            const airplane = await airplaneModel.findOne({airplane_id});
			res.send(airplane)
		}catch(err){
			console.log('获取人员详情失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取人员详情失败'
			})
		}
    }
    // 更新飞机
    async updateAirplane(req, res, next){
        console.log('32323243');
        const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
        const airplane = await airplaneModel.findOne({
            airplane_id: fields.airplane_id
        });
        console.log("airplane",fields.airplane_id);
        console.log("airplane",airplane);
    // 生成日志id  -----开始
    let log_id;
    try{
        log_id = await this.getId('log_id');
        console.log(log_id);
    }catch(err){
        console.log('获取id失败');
        res.send({
            type: 'ERROR_DATA',
            message: '获取数据失败'
        })
        return
    }
    let action = '';
    if (fields.moudle === 'upplane') {
        action = '通过状态上报更新了一架飞机'
    } else {
        action = '通过飞机管理更新了一架飞机'
    }
    const data = {
        log_id,
        user: req.query.uid,
        action: action,
        create_time: dtime().format('YYYY-MM-DD HH:mm'),
        data: JSON.stringify(fields)
    }
    const log = new logModel(data);
    await log.save();
    console.log(JSON.stringify(fields));

    // ----- 结束
    if (fields.moudle === 'upplane') {
        const newAirplaneState = {
            user: req.query.uid,
            create_time: dtime().format('YYYY-MM-DD HH:mm'),
            airData: fields
        }
        const airplaneState = new airplaneStateModel(newAirplaneState);
        await airplaneState.save();

        if (fields.wq) {
            const newWqState = {
                name: `${airplane.code}`,
                user: req.query.uid,
                create_time: dtime().format('YYYY-MM-DD HH:mm'),
                fsData: JSON.parse(fields.wq),
                airData: fields
            }
            const wqState = new wqStateModel(newWqState);
            await wqState.save();
        }

    }
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
                airplane_id,
                model,
                code,
                army_id,
                factory,
                date,
                unit,
                airTime,
                airUpOrDown,
                yairUpOrDown,
                airHour,
                yairHour,
                stageUpOrDown,
                engine_1,
                engine_2,
                image_path,
                state,
                task,
                type,
                stageUpOrDownTime,
                repairNumber,
                repairFactory,
                wqNumber
            } = fields;
            console.log(fields);
            if (fields.airHour) {
                await this.updateAirplaneDevice(fields);
            }
            const create_time = dtime().format('YYYY-MM-DD HH:mm');
            fields.create_time = create_time;
			try {
				let newData;
				newData = {
                    model,
                    code,
                    army_id,
                    factory,
                    date,
                    unit,
                    airTime,
                    airUpOrDown,
                    yairUpOrDown,
                    airHour,
                    yairHour,
                    stageUpOrDown,
                    engine_1,
                    engine_2,
                    image_path,
                    state,
                    task,
                    create_time,
                    type,
                    stageUpOrDownTime,
                    repairNumber,
                    repairFactory
                }
                console.log("333333", fields);
                let airplane_id = {
                    airplane_id: fields.airplane_id
                };
				await airplaneModel.findOneAndUpdate(airplane_id, {$set: fields});
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
    // 删除飞机
    async deleteAirplane(req, res, next){
        console.log(req.query);
		const airplane_id = req.params.airplane_id;
		if (!airplane_id || !Number(airplane_id)) {

			console.log('airplane_id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'airplane_id参数错误',
			})
			return
		}
		try{
			await airplaneModel.findOneAndRemove({airplane_id});
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

    async updateAirplaneDevice(data){
        const datas = {
            sm: data.airHour
        }
        console.log(datas);
        // const create_time = dtime().format('YYYY-MM-DD HH:mm');
        try {
            const airplane = await airplaneModel.findOne({airplane_id: data.airplane_id});
            const device = await airplaneDeviceModel.findOne({air_code: airplane.code});
            const ammo = await airplaneAmmoModel.findOne({air_code: airplane.code});
            console.log(parseInt(ammo.zsm));
            if (device) {
                const devicesm = {
                    sm: parseInt(device.zsm) - parseInt(data.airHour)
                }
                const res = await airplaneDeviceModel.updateMany({air_code: airplane.code}, {$set: devicesm});
            }
            if (ammo) {
                const ammosm = {
                    sm: parseInt(ammo.zsm) - parseInt(data.airHour)
                }
                const ress = await airplaneAmmoModel.updateMany({air_code: airplane.code}, {$set: ammosm});
            }
            console.log('修改成功');
        }catch(err){
            console.log(err.message, err);
        }
        console.log("!!!!!!", data);
    }
}

export default new Airplane()