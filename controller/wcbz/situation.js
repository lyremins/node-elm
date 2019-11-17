'use strict';

import airplaneModel from '../../models/wcbz/airplane'
import airplaneAmmoModel from '../../models/wcbz/airplane_ammo'
import planModel from '../../models/wcbz/plan'
import ensureModel from '../../models/wcbz/ensure'
import vehicleModel from '../../models/wcbz/vehicle'
import airplaneDeviceModel from '../../models/wcbz/airplane_device'
import personnelModel from '../../models/wcbz/personnel'
import WqStateModel from '../../models/wcbz/wqState'
import BaseComponent from '../../prototype/baseComponent'
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

class Situation extends BaseComponent{
	constructor(){
		super()
		this.getSituation = this.getSituation.bind(this);
		this.getAirplaneToPlan = this.getAirplaneToPlan.bind(this);
		this.getCarToEnsure = this.getCarToEnsure.bind(this);

    }
    distinct(a, b) {
        return Array.from(new Set([...a, ...b]))
    }
    toTimeStamp(time) {
        time = time.replace(/-/g, '/') // 把所有-转化成/
        let timestamp = new Date(time).getTime()
        return timestamp
    }
    // 查询人员条数
    async getSituation(req, res, next){
		try{
            var day2 = new Date();
            day2.setTime(day2.getTime());
            let day = '';
            day = parseInt(day2.getDate()) < 10 ? '0' + day2.getDate() : day2.getDate()
            let dayTime = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day;
            const date = {
                dateTime: dayTime
            }
            let totalUpDown = 0;
            let totalFlight = 0;
            let totalPerson = 0;
            const count = await airplaneModel.count();
            const plan = await planModel.find(date);
            let totalAirplane = 0;
            if (plan.length) {
                plan[0].airData.forEach(element => {
                    totalAirplane = plan[0].airData.length;
                    totalUpDown += parseInt(element.upDownNumber);
                    totalFlight += parseInt(element.flightTime);
                });
            }
            const users = await airplaneModel.find();
            const ensure = await ensureModel.find();
            const vehicle = await vehicleModel.find();
            const personnel = await personnelModel.find();
            let vehicle_enter = 0;
            vehicle.forEach(element => {
                if (this.toTimeStamp(element.create_time) >= this.toTimeStamp(dayTime) && element.enter === '进场') {
                    vehicle_enter +=1;
                }
            });

            let ensure_task = 0;
            let ensure_car = 0;
            const car_enter = [];
            let ensure_ccc = [];
            let ensure_eee = [];
            ensure.forEach(element => {
                if (this.toTimeStamp(element.filed2) >= this.toTimeStamp(dayTime)) {
                    element.filed3.forEach(e => {
                        if (e.content === '飞行计划保障') {
                           e.plan.forEach(p => {
                                console.log("ppppp",p.airData.length);
                                ensure_task += p.airData.length;
                                p.airData.forEach(ppp => {
                                    ensure_ccc.push(ppp.airName);
                                });
                           });
                        }
                        e.car.forEach(ee => {
                            console.log(ee);
                            car_enter[ee.name] || (car_enter[ee.name] = []);
                            car_enter[ee.name].push(ee);
                        });
                        if (e.airplane) {
                            e.airplane.forEach(ss => {
                                ensure_task +=1;
                                console.log('sssssssss',ensure_task);
                                if (e.content !== '飞行计划保障') {
                                    ensure_ccc.push(ss.code);
                                    ensure_eee.push(ss.code);
                                }
                            })
                        }
                    });
                }
             });
             console.log("ensure_ccc",ensure_ccc);
             Object.keys(car_enter).forEach((key) => {
                ensure_car ++;
            });

            //  console.log("222222", car_enter.length);
            // console.log(users);
            // const enter = await this.getAirplaneToPlan();
            let totalN = 0;
            let nnnn = 0;
            let totalAirHour = 0;
            const array = [];
            let carToEnterToAir = 0;
            if (plan.length || ensure.length) {
                if (plan.length) {
                    totalN = plan[0].totalNumber;
                }
                users.forEach(element => {
                    if (!ensure_eee.includes(element.code) && this.toTimeStamp(element.create_time) >= this.toTimeStamp(dayTime) && element.enter === '进场') {
                        array.push(element);
                        console.log("element", element);
                        nnnn += parseInt(element.airUpOrDown);
                        totalAirHour += parseInt(element.airHour);
                    }
                    if (ensure_ccc.includes(element.code) && element.enter === '进场' ) {
                        carToEnterToAir ++;
                    }
                });
            }
            let pEnter = 0;
            personnel.forEach(element => {
                if (this.toTimeStamp(element.create_time) >= this.toTimeStamp(dayTime) && element.state === '进场') {
                    pEnter += 1;
                }
            });
            const data = {
                totalAirplane: totalAirplane,
                enterAirplane: array.length,
                totalUpDown: totalUpDown,
                doneUpdown: nnnn,
                enterPerson: totalN,
                donePerson: pEnter,
                totalCar: ensure_car, // 总保障车辆数
                totalTask: ensure_task,   // 改成总保障飞机数
                enterCar: vehicle_enter,  // 进场车辆数
                doneTask: carToEnterToAir, // 改成已进场飞机数
                totalFlyHour: totalFlight,
                doneFlyHour: totalAirHour
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
        var day2 = new Date();
        day2.setTime(day2.getTime());
        let day = '';
        day = parseInt(day2.getDate()) < 10 ? '0' + day2.getDate() : day2.getDate()
        let dayTime = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day;
        const date = {
            dateTime: dayTime
        }
		try{
            const array = [];
            const plan = await planModel.find(date);
            const ensure = await ensureModel.find();
            console.log("ensure",ensure);
            ensure.forEach(element => {
                if (this.toTimeStamp(element.filed2) >= this.toTimeStamp(dayTime)) {
                    element.filed3.forEach(e => {
                        e.airplane.forEach(ee => {
                            array.push({
                                airplane_id: ee.airplane_id,
                                code: ee.code,
                                upDownNumber: ee.airUpOrDown,
                                approachTime: ee.approachTime,
                                name: `${ee.code}-保障任务`
                            })
                        });
                    });
                }
            });

            const users = await airplaneModel.find({})
            const ammo = await airplaneAmmoModel.find({})

            if (plan.length) {
                plan[0].airData.forEach((elements,index) => {
                    users.forEach(element => {
                        if (elements.airName === element.code) {
                            array.push({
                                airplane_id: element.airplane_id,
                                code: elements.airName,
                                upDownNumber: elements.upDownNumber,
                                approachTime: elements.approachTime,
                                name: `${elements.airName}-飞行计划`,
                                ammoData: elements.xd
                            })
                        }
                    });
                    // plan[0].airData[index].code = element.airName;
                });
            }
            // array.forEach(element => {
            //     let data = [];
            //     ammo.forEach(ammo => {
            //         // console.log(element.code);
            //         // console.log(ammo.air_code);
            //         if (element.code === ammo.air_code) {
            //             console.log(ammo);
            //             data.push(ammo);
            //         }
            //     });
            //     element.ammoData = data;
            // });
			res.send({
				status: 1,
				data: array,
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
        var day2 = new Date();
        day2.setTime(day2.getTime());
        let day = '';
        day = parseInt(day2.getDate()) < 10 ? '0' + day2.getDate() : day2.getDate()
        let dayTime = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day;
		try{
            const ensure = await ensureModel.find({}, '-_id').limit(Number(limit)).skip(Number(offset));
            const carArray = []
            ensure.forEach(element => {
                if (this.toTimeStamp(element.filed2) >= this.toTimeStamp(dayTime)) {
                    console.log(element);
                    element.filed3.forEach(e => {
                        e.car.forEach(ee => {
                            if(!carArray.includes(ee.name)){ // 如果bArr新数组包含当前循环item
                                carArray.push(ee.name);
                               }
                        });
                    });
                }
             });
             console.log("2222222", carArray);
             const newArray = [];
             const vehicle = await vehicleModel.find();
             vehicle.forEach(element => {
                carArray.forEach(type => {
                    if (element.name === type) {
                        newArray.push(element);
                    }
                });
             });
            const data =  [{
                "vehicle_id": 1,
                "model": "冷气车",
                "name": "冷气车A",
                "organiz": "一中队",
                "service": "A1",
                "armyId": "FXYL-01",
                "product": "某制造厂",
                "productTime": "43739",
                "life": "10年",
                "stageCourse": "1万公里",
                "repairNumber": "1",
                "taskState": "进场",
                "state": "测试",
                "mileage": "1万公里",
                "enter": "进场",
                "__v": 0
            }]
			res.send({
				status: 1,
				data: newArray,
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
    async getPlanToToday(req, res, next){
        const {limit = 1000, offset = 0} = req.query;
        var day2 = new Date();
        day2.setTime(day2.getTime());
        let day = '';
        day = parseInt(day2.getDate()) < 10 ? '0' + day2.getDate() : day2.getDate()
        let dayTime = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day;
        const date = {
            dateTime: dayTime
        }
        try{
            const plan = await planModel.find(date);
			res.send({
				status: 1,
				data: plan,
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
    // 有寿器件态势
    async getAirplaneToDevice(req, res, next) {

        // 获取当当天日期
        var day2 = new Date();
        day2.setTime(day2.getTime());
        let day = '';
        day = parseInt(day2.getDate()) < 10 ? '0' + day2.getDate() : day2.getDate()
        let dayTime = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day;

        const plandate = { dateTime: dayTime };
        const ensuredate = { filed2: dayTime };

        // 查询当天飞行计划
        const plan = await planModel.find(plandate);

        // 当天飞行计划飞机编号的数组
        let planArray = plan[0].airData.map(v => v.airName);

        // 查询当天保障计划
        const ensure = await ensureModel.find(ensuredate);

        // 当天保障计划飞机编号的数组
        let ensureArray = ensure[0].filed3.map(v => {
            return v.airplane.map(vv =>  vv.code)
        });

        const newEnsureArray = [].concat.apply([], ensureArray);

        // 飞机-有寿器件关联列表
        let airplaneDevice = await airplaneDeviceModel.find();

        // 过滤当天飞机编号的有寿器件列表
        const planToDeivce = airplaneDevice.filter(item=> {
            return planArray.indexOf(item.air_code) !== -1
        })

        // 过滤当天飞机编号的有寿器件列表
        const ensureToDeivce = airplaneDevice.filter(item=> {
            return newEnsureArray.indexOf(item.air_code) !== -1
        })

        const jh = [...planArray,...newEnsureArray];

        // 过滤当天飞机编号的有寿器件列表
        const normalToDeivce = airplaneDevice.filter(item=> {
            return jh.indexOf(item.air_code) === -1
        })

        const dataArray = {
            plan: planToDeivce,
            ensure: ensureToDeivce,
            normal: normalToDeivce
        }

        res.send({
            status: 1,
            data: dataArray,
        })

    }

    // 弹药态势
    async getAmmoToDevice(req, res, next) {

        // 获取当当天日期
        var day2 = new Date();
        day2.setTime(day2.getTime());
        let day = '';
        day = parseInt(day2.getDate()) < 10 ? '0' + day2.getDate() : day2.getDate()
        let dayTime = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day;

        const plandate = { dateTime: dayTime };
        const wqdate = { create_time: { $gt: dayTime } };

        // 查询当天飞行计划
        const plan = await planModel.find(plandate);

        // 当天飞行计划飞机编号的数组
        let planArray = plan[0].airData.map(v => {
            return v.xd.map(vv => {
                return {
                    name: `${vv.air_code}_${vv.ammo_code}`,
                    zsm:vv.zsm,
                    fscs: 0,
                    fssl: 0
                }
            })
        });

        const newPlanArray = [].concat.apply([], planArray);

        const wq = await WqStateModel.find(wqdate);

        const wqArray = [];

        wq.forEach((element,index) => {
            const ll = JSON.parse(element.airData.wq);
            ll.forEach(e => {
                wqArray.push ({
                    air_name : element.name,
                    fxcs: e.fxcs,
                    fxsl: e.fxsl,
                    name: e.name,
                    newName: `${element.name}_${e.name}`
                })
            });
        });

        const newwqArray = [].concat.apply([], wqArray);
        console.log(newwqArray);

        newPlanArray.forEach(e1 => {
            newwqArray.forEach(e2 => {
                if (e1.name === e2.newName) {
                    e1.fscs +=e2.fxcs
                    e1.fssl +=e2.fxsl
                }
            });
        });


        res.send({
            status: 1,
            data: newPlanArray,
        })

    }

    // 飞机态势
    async getAirplaneSituation(req, res, next) {

        // 获取当当天日期
        var day2 = new Date();
        day2.setTime(day2.getTime());
        let day = '';
        day = parseInt(day2.getDate()) < 10 ? '0' + day2.getDate() : day2.getDate()
        let dayTime = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day;

        const plandate = { dateTime: dayTime };
        const ensuredate = { filed2: dayTime };

        const airplane = await airplaneModel.find();

        // 查询当天飞行计划
        const plan = await planModel.find(plandate);

        // 当天飞行计划飞机编号的数组
        let planArray = plan[0].airData.map(v => v.airName);

        // 过滤当天飞机编号的有寿器件列表
        const planToS = airplane.filter(item=> {
            return planArray.indexOf(item.code) !== -1
        })

        // 查询当天保障计划
        const ensure = await ensureModel.find(ensuredate);



        // 当天保障计划飞机编号的数组
        let ensureArray = ensure[0].filed3.map(v => {
            if (v.airplane.length === 0 && v.plan.length !== 0) {
                return planArray
            }
            return v.airplane.map(vv =>  vv.code)
        });

        const newAirArray = [].concat.apply([], ensureArray);

        // 过滤当天飞机编号的有寿器件列表
        const ensureToS = airplane.filter(item=> {
            return newAirArray.indexOf(item.code) !== -1
        })

        // 过滤当天飞机编号的有寿器件列表
        const normalToDeivce = airplane.filter(item=> {
            return newAirArray.indexOf(item.code) === -1
        })

        const dataArray = {
            plan: planToS,
            ensure: ensureToS,
            normal: normalToDeivce
        }


        res.send({
            status: 1,
            data: dataArray,
        })

    }

    // 车辆态势
    async getCarSituation(req, res, next) {

        // 获取当当天日期
        var day2 = new Date();
        day2.setTime(day2.getTime());
        let day = '';
        day = parseInt(day2.getDate()) < 10 ? '0' + day2.getDate() : day2.getDate()
        let dayTime = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day;

        const plandate = { dateTime: dayTime };
        const ensuredate = { filed2: dayTime };

        // 查询当天保障计划
        const ensure = await ensureModel.find(ensuredate);

        const vehicle = await vehicleModel.find();

        // 当天保障计划飞机编号的数组
        let ensureArray = ensure[0].filed3.map(v => {
            if (v.content === '飞行计划保障') {
                return {plan: v.car.map(vv => vv)}
            } else {
                return {other: v.car.map(vv => vv)}
            }
        });

        // 当天保障计划飞机编号的数组
        let ensureArray1 = ensure[0].filed3.map(v => {
            return v.car.map(vv => vv.name)
        });

        const newAirArray = [].concat.apply([], ensureArray);
        console.log(newAirArray);

        // 过滤当天飞机编号的有寿器件列表
        const notaskcCar = vehicle.filter(item=> {
            return ensureArray1.indexOf(item.code) === -1
        })

        newAirArray.push({
            notask: notaskcCar
        })

        res.send({
            status: 1,
            data: newAirArray,
        })

    }

    // 人员态势
    async getPersonSituation(req, res, next) {

        // 获取当当天日期
        var day2 = new Date();
        day2.setTime(day2.getTime());
        let day = '';
        day = parseInt(day2.getDate()) < 10 ? '0' + day2.getDate() : day2.getDate()
        let dayTime = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day;

        const plandate = { dateTime: dayTime };
        const ensuredate = { filed2: dayTime };

        const airplane = await airplaneModel.find();
        const personnel = await personnelModel.find();

        // 查询当天飞行计划
        const plan = await planModel.find(plandate);

        // 当天飞行计划飞机编号的数组
        let planArray = plan[0].airData.map(v => v.airName);

        // 过滤当天飞机编号的有寿器件列表
        let planToS = airplane.filter(item=> {
            return planArray.indexOf(item.code) !== -1
        })

        const newA = [];
        planToS.forEach((e1,index) => {
            let bindA = [];
            let newData = {}
            personnel.forEach(e2 => {
                if (e1.code === e2.bindAir) {
                    bindA.push(e2.user_name)
                    // bindA.push(Object.assign({},e2.user_name));
                }
            });
            newData = {
                name: e1.code,
                bind: bindA
            }
            newA.push(newData);
        });
        console.log(newA);




        // 查询当天保障计划
        const ensure = await ensureModel.find(ensuredate);



        // 当天保障计划飞机编号的数组
        let ensureArray = ensure[0].filed3.map(v => {
            if (v.airplane.length === 0 && v.plan.length !== 0) {
                return planArray
            }
            return v.airplane.map(vv =>  vv.code)
        });

        const newAirArray = [].concat.apply([], ensureArray);

        // 过滤当天飞机编号的有寿器件列表
        const ensureToS = airplane.filter(item=> {
            return newAirArray.indexOf(item.code) !== -1
        })

        const newB = [];
        ensureToS.forEach((e1,index) => {
            let bindA = [];
            let newData = {}
            personnel.forEach(e2 => {
                if (e1.code === e2.bindAir) {
                    bindA.push(e2.user_name)
                    // bindA.push(Object.assign({},e2.user_name));
                }
            });
            newData = {
                name: e1.code,
                bind: bindA
            }
            newB.push(newData);
        });
        console.log(newB);

        // 过滤当天飞机编号的有寿器件列表
        const normalToDeivce = airplane.filter(item=> {
            return newAirArray.indexOf(item.code) === -1
        })

        const newC = [];
        normalToDeivce.forEach((e1,index) => {
            let bindA = [];
            let newData = {}
            personnel.forEach(e2 => {
                if (e1.code === e2.bindAir) {
                    bindA.push(e2.user_name)
                    // bindA.push(Object.assign({},e2.user_name));
                }
            });
            newData = {
                name: e1.code,
                bind: bindA
            }
            newC.push(newData);
        });
        console.log(newC);

        const dataArray = {
            plan: newA,
            ensure: newB,
            normal: newC
        }


        res.send({
            status: 1,
            data: dataArray,
        })

    }

}

export default new Situation()