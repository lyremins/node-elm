'use strict';

import airplaneStateModel from '../../models/wcbz/airplaneState'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Airplane extends BaseComponent{
	constructor(){
		super()
		this.addAirplaneState = this.addAirplaneState.bind(this);

	}
	//添加飞机
	async addAirplaneState(req, res, next){
        console.log(req.query);

        let airplenState_id;
		try{
            airplenState_id = await this.getId('airplenState_id');
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
			const newAirplane = {
                airplenState_id, // 飞机ID
                user: fields.user,
                create_time: dtime().format('YYYY-MM-DD HH:mm'),
                airData: fields
			}
			try{
				//保存数据，并增加对应食品种类的数量
				const airplane = new airplaneStateModel(newAirplane);
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
    // 查询
	async getAirplaneState(req, res, next){
        console.log(req.query);

		const {limit = 1000, offset = 0} = req.query;
		try{
            const users = await airplaneStateModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
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
}

export default new Airplane()