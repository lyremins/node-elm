'use strict';

import airplaneModel from '../../models/wcbz/airplane'
import BaseComponent from '../../prototype/baseComponent'

class Situation extends BaseComponent{
	constructor(){
		super()
		this.getSituation = this.getSituation.bind(this);

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
}

export default new Situation()