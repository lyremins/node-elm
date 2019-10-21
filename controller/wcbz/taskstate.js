'use strict';

import taskstateModel from '../../models/wcbz/taskstate'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Taskstate extends BaseComponent{
	constructor(){
		super()
		this.addTaskstate = this.addTaskstate.bind(this);
		this.getTaskstate = this.getTaskstate.bind(this);
		this.updateTaskstate = this.updateTaskstate.bind(this);
	}
	//添加人员
	async addTaskstate(req, res, next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const opening_hours = fields.startTime&&fields.endTime? fields.startTime + '/' + fields.endTime : "8:30/20:30";
			const newTaskstate = {
				fxq: fields.fxq,
                zccd: fields.zccd,
                dj: fields.dj,
                fxh: fields.fxh,
                sc: fields.sc
			}
			try{
				//保存数据，并增加对应食品种类的数量
				const taskstate = new taskstateModel(newTaskstate);
				await taskstate.save();
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
	async getTaskstate(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
			const users = await taskstateModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
			res.send({
				status: 1,
				data: users,
			})
		}catch(err){
			console.log('获取列表数据失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取列表数据失败'
			})
		}
    }
    // 更新人员
    async updateTaskstate(req, res, next){
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
            console.log(fields);
			const {
                fxq,
                zccd,
                dj,
                fxh,
                sc
            } = fields;
			try{
				let newData;
				newData = {
                fxq,
                zccd,
                dj,
                fxh,
                sc
                }
				await taskstateModel.findOneAndUpdate({$set: newData});
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
}

export default new Taskstate()