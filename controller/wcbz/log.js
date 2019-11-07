'use strict';

import logModel from '../../models/wcbz/log'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Log extends BaseComponent{
	constructor(){
		super()
		this.addLog = this.addLog.bind(this);
		this.getLog = this.getLog.bind(this);
		this.getLogCount = this.getLogCount.bind(this);
		this.getLogDetail = this.getLogDetail.bind(this);
		this.updateLog = this.updateLog.bind(this);
		this.deleteLog = this.deleteLog.bind(this);
	}
	//添加人员
	async addLog(req, res, next){
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
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
            console.log(fields);
			const opening_hours = fields.startTime&&fields.endTime? fields.startTime + '/' + fields.endTime : "8:30/20:30";
			const newLog = {
                log_id,
				user: fields.user,
				action: fields.action,
				data: fields.data,
                create_time: dtime().format('YYYY-MM-DD HH:mm')
			}
			try{
				//保存数据，并增加对应食品种类的数量
				const log = new logModel(newLog);
				await log.save();
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
	async getLog(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
			const users = await logModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
			res.send({
				status: 1,
				data: users,
			})
		}catch(err){
			console.log('获取日志数据失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取日志数据失败'
			})
		}
    }
    // 查询人员条数
    async getLogCount(req, res, next){
		try{
			const count = await logModel.count()
			res.send({
				status: 1,
				count,
			})
		}catch(err){
			console.log('获取管理员数量失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_ADMIN_COUNT',
				message: '获取管理员数量失败'
			})
		}
    }
    // 获取人员详情
	async getLogDetail(req, res, next){
        console.log(req.params);
		const log_id = req.params.Log_id;
		if (!log_id || !Number(log_id)) {
			console.log('获取ID错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'ID参数错误',
			})
			return
		}
		try{
            const log = await logModel.findOne({log_id});
            console.log(log);
			res.send(log)
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
    async updateLog(req, res, next){
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
			const {log_id,filed1, filed2,filed3,filed4,filed5,filed6,filed7,filed8,filed9,filed10,filed11,filed12,sy} = fields;
			try{
				let newData;
				newData = {filed1,filed2,filed3,filed4,filed5,filed6,filed7,filed8,filed9,filed10,filed11,filed12,sy}
				await logModel.findOneAndUpdate({log_id}, {$set: newData});
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
    async deleteLog(req, res, next){
        console.log(req.params);
        const log_id = req.params.Log_id;
        console.log(log_id);
		if (!log_id || !Number(log_id)) {
			console.log('log_id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'log_id参数错误',
			})
			return
		}
		try{
			await logModel.findOneAndRemove({log_id});
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

export default new Log()