'use strict';

import personnelModel from '../../models/wcbz/personnel'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Personnel extends BaseComponent{
	constructor(){
		super()
		this.addPersonnel = this.addPersonnel.bind(this);
		this.getPersonnel = this.getPersonnel.bind(this);
		this.getPersonnelCount = this.getPersonnelCount.bind(this);
		this.getPersonnelDetail = this.getPersonnelDetail.bind(this);
		this.updatePersonnel = this.updatePersonnel.bind(this);
		this.deletePersonnel = this.deletePersonnel.bind(this);
	}
	//添加人员
	async addPersonnel(req, res, next){
        let person_id;
		try{
            person_id = await this.getId('person_id');
            console.log(person_id);
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
			try{
				if (!fields.user_name) {
					throw new Error('必须填写名称');
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
            const exists = await personnelModel.findOne({name: fields.user_name});
            console.log(fields);
			if (exists) {
				res.send({
					status: 0,
					type: 'RESTURANT_EXISTS',
					message: '名称已存在，请尝试其他店铺名称'
				})
				return
			}
			const opening_hours = fields.startTime&&fields.endTime? fields.startTime + '/' + fields.endTime : "8:30/20:30";
			const newPersonnel = {
                person_id,
				user_name: fields.user_name,
                sex: fields.sex,
                phone: fields.phone,
                type: fields.type,
                detachment: fields.detachment,
                remark: fields.remark,
                create_time: dtime().format('YYYY-MM-DD HH:mm'),
                organiz: fields.organiz,          // 组织架构
                native: fields.native,           // 籍贯
                company: fields.company,     // 单位
                row: fields.row, // 排
                post: fields.post, // 职务
                major: fields.major, // 专业
                grade: fields.grade, // 等级
                bindAir: fields.bindAir, // 绑定飞机
                enlist: fields.enlist, // 入伍时间
                school: fields.school, // 毕业院校
                greatTask: fields.greatTask, //执行重大任务
			}
			try{
				//保存数据，并增加对应食品种类的数量
				const personnel = new personnelModel(newPersonnel);
				await personnel.save();
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
	async getPersonnel(req, res, next){
		const {limit = 200, offset = 0} = req.query;
		try{
			const users = await personnelModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
			res.send({
				status: 1,
				data: users,
			})
		}catch(err){
			console.log('获取用户列表数据失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取用户列表数据失败'
			})
		}
    }
    // 查询人员条数
    async getPersonnelCount(req, res, next){
		try{
			const count = await personnelModel.count()
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
	async getPersonnelDetail(req, res, next){
        console.log(req.params);
		const person_id = req.params.person_id;
		if (!person_id || !Number(person_id)) {
			console.log('获取ID错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'ID参数错误',
			})
			return
		}
		try{
            const personnel = await personnelModel.findOne({person_id});
            console.log(personnel);
			res.send(personnel)
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
    async updatePersonnel(req, res, next){
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
                user_name,
                sex,phone,
                type,person_id,
                detachment,
                organiz,
                native,
                company,
                row,
                post,
                major,
                grade,
                bindAir,
                enlist,
                school,
                greatTask } = fields;
			try{
				let newData;
                newData = {user_name,sex,phone,type,detachment,
                    organiz,
                native,
                company,
                row,
                post,
                major,
                grade,
                bindAir,
                enlist,
                school,
                greatTask}
				await personnelModel.findOneAndUpdate({person_id}, {$set: fields});
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
    async deletePersonnel(req, res, next){
        console.log(req.params);
		const person_id = req.params.person_id;
		if (!person_id || !Number(person_id)) {
			console.log('person_id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'person_id参数错误',
			})
			return
		}
		try{
			await personnelModel.findOneAndRemove({person_id});
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

export default new Personnel()