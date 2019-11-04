'use strict';

import airplaneModel from '../../models/wcbz/airplane'
import BaseComponent from '../../prototype/baseComponent'

class Situation extends BaseComponent{
	constructor(){
		super()
		this.getSituation = this.getSituation.bind(this);
		this.getAirplaneToPlan = this.getAirplaneToPlan.bind(this);
		this.getCarToEnsure = this.getCarToEnsure.bind(this);

	}
    // 查询人员条数
    async getSituation(req, res, next){
		try{
            console.log('222');
            const count = await airplaneModel.count()
            const data = {
                totalAirplane: count,
                enterAirplane: count,
                totalUpDown: count,
                doneUpdown: count,
                enterPerson: count,
                donePerson: count,
                totalCar: count,
                totalTask: count,
                enterCar: count,
                doneTask: count
            }
			res.send({
				status: 1,
				data,
			})
		}catch(err){
			console.log('获取态势失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_ADMIN_COUNT',
				message: '获取态势失败'
			})
		}
    }
    async getAirplaneToPlan(req, res, next){
		const {limit = 1000, offset = 0} = req.query;
		try{
            const users = await airplaneModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
            console.log(users);
            const data =  {
                "airplane_id": 16,
                "type": "测试11111",
                "model": "运输机",
                "code": "A3",
                "army_id": "03",
                "factory": "某制造厂",
                "date": "2019-10-31",
                "unit": "机务一分队",
                "airUpOrDown": "1",
                "yairUpOrDown": "2",
                "airHour": "6",
                "yairHour": "2",
                "stageUpOrDown": "2",
                "engine_1": "2",
                "engine_2": "1",
                "create_time": "2019-11-01 08:49",
                "stageUpOrDownTime": "2",
                "repairNumber": "3",
                "repairFactory": "某修理厂",
                "state": "完好",
                "task": "飞行后",
                "image_path": "",
                "__v": 0,
                "enter": "进场"
            }
			res.send({
				status: 1,
				data: data,
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
    async getCarToEnsure(req, res, next){
		const {limit = 1000, offset = 0} = req.query;
		try{
            const users = await airplaneModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
            console.log(users);
            const data =  {
                "airplane_id": 16,
                "type": "车辆1111",
                "model": "运输机",
                "code": "A3",
                "army_id": "03",
                "factory": "某制造厂",
                "date": "2019-10-31",
                "unit": "机务一分队",
                "airUpOrDown": "1",
                "yairUpOrDown": "2",
                "airHour": "6",
                "yairHour": "2",
                "stageUpOrDown": "2",
                "engine_1": "2",
                "engine_2": "1",
                "create_time": "2019-11-01 08:49",
                "stageUpOrDownTime": "2",
                "repairNumber": "3",
                "repairFactory": "某修理厂",
                "state": "完好",
                "task": "飞行后",
                "image_path": "",
                "__v": 0,
                "enter": "进场"
            }
			res.send({
				status: 1,
				data: data,
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

export default new Situation()