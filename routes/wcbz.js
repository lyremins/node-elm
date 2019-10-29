'use strict';

import express from 'express';
import Personnel from '../controller/wcbz/personnel'
import Airplane from '../controller/wcbz/airplane'
import Equip from '../controller/wcbz/equip'
import Ensure from '../controller/wcbz/ensure'
import Device from '../controller/wcbz/device'
import Airtate from '../controller/wcbz/airstate'
import TaskState from '../controller/wcbz/taskstate'
import Fault from '../controller/wcbz/fault'
import deviceState from '../controller/wcbz/devicestate'
import Vehicle from '../controller/wcbz/vehicle'
import Subject from '../controller/wcbz/subject'
import Plan from '../controller/wcbz/plan'
import Organiz from '../controller/wcbz/organiz'
import Config from '../controller/wcbz/config'
import Ammo from '../controller/wcbz/ammo'
import AirplaneDevice from '../controller/wcbz/airplane_device'
import AirplaneAmmo from '../controller/wcbz/airplane_ammo'
import AirplaneCar from '../controller/wcbz/airplane_car'

const router = express.Router();

// 人员管理
router.post('/addPersonnel', Personnel.addPersonnel);
router.post('/updatePersonnel', Personnel.updatePersonnel);
router.get('/getPersonnel', Personnel.getPersonnel);
router.get('/getPersonnelCount', Personnel.getPersonnelCount);
router.get('/getPersonnel/:person_id', Personnel.getPersonnelDetail);
router.delete('/deletePersonnel/:person_id', Personnel.deletePersonnel);

// 飞机管理
router.post('/addAirplane', Airplane.addAirplane);
router.post('/updateAirplane', Airplane.updateAirplane);
router.get('/getAirplane', Airplane.getAirplane);
router.get('/getAirplaneCount', Airplane.getAirplaneCount);
router.get('/getAirplane/:airplane_id', Airplane.getAirplaneDetail);
router.delete('/deleteAirplane/:airplane_id', Airplane.deleteAirplane);

// 装备管理
router.post('/addEquip', Equip.addEquip);
router.post('/updateEquip', Equip.updateEquip);
router.get('/getEquip', Equip.getEquip);
router.get('/getEquipCount', Equip.getEquipCount);
router.get('/getEquip/:Equip_id', Equip.getEquipDetail);
router.delete('/deleteEquip/:Equip_id', Equip.deleteEquip);

// 保障管理
router.post('/addEnsure', Ensure.addEnsure);
router.post('/updateEnsure', Ensure.updateEnsure);
router.get('/getEnsure', Ensure.getEnsure);
router.get('/getEnsureCount', Ensure.getEnsureCount);
router.get('/getEnsure/:Ensure_id', Ensure.getEnsureDetail);
router.delete('/deleteEnsure/:Ensure_id', Ensure.deleteEnsure);

// 保障管理
router.post('/addDevice', Device.addDevice);
router.post('/updateDevice', Device.updateDevice);
router.get('/getDevice', Device.getDevice);
router.get('/getDeviceCount', Device.getDeviceCount);
router.get('/getDevice/:Device_id', Device.getDeviceDetail);
router.delete('/deleteDevice/:Device_id', Device.deleteDevice);

// 态势管理
router.post('/addAirtate', Airtate.addAirtate);
router.post('/updateAirtate', Airtate.updateAirtate);
router.get('/getAirtate', Airtate.getAirtate);
router.post('/addTaskstate', TaskState.addTaskstate);
router.post('/updateTaskstate', TaskState.updateTaskstate);
router.get('/getTaskstate', TaskState.getTaskstate);
router.get('/getFault', Fault.getFault);
router.post('/addFault', Fault.addFault);
router.post('/addDeviceState', deviceState.addDevicestate);
router.post('/updateDeviceState', deviceState.updateDevicestate);
router.get('/getDevicestate', deviceState.getDevicestate);

// 车辆管理
router.post('/addVehicle', Vehicle.addVehicle);
router.post('/updateVehicle', Vehicle.updateVehicle);
router.get('/getVehicle', Vehicle.getVehicle);
router.get('/getVehicleCount', Vehicle.getVehicleCount);
router.get('/getVehicle/:Vehicle_id', Vehicle.getVehicleDetail);
router.delete('/deleteVehicle/:Vehicle_id', Vehicle.deleteVehicle);

// 科目管理
router.post('/addSubject', Subject.addSubject);
router.post('/updateSubject', Subject.updateSubject);
router.get('/getSubject', Subject.getSubject);
router.get('/getSubjectCount', Subject.getSubjectCount);
router.get('/getSubject/:Subject_id', Subject.getSubjectDetail);
router.delete('/deleteSubject/:Subject_id', Subject.deleteSubject);

// 计划管理
router.post('/addPlan', Plan.addPlan);
router.get('/getPlan', Plan.getPlan);
router.get('/getPlanbyID/:Plan_id', Plan.getPlanDetail);
router.post('/updatePlan', Plan.updatePlan);

// 配置任务状态
router.post('/addConfig', Config.addConfig);
router.get('/getConfig', Config.getConfig);
router.post('/updateConfig', Config.updateConfig);

// 组织架构管理
router.post('/addOrganiz', Organiz.addOrganiz);
router.get('/getOrganiz', Organiz.getOrganiz);

// 弹药管理
router.post('/addAmmo', Ammo.addammo);
router.post('/updateAmmo', Ammo.updateammo);
router.get('/getAmmo', Ammo.getammo);
router.get('/getAmmoCount', Ammo.getammoCount);
router.get('/getAmmo/:Ammo_id', Ammo.getammoDetail);
router.delete('/deleteAmmo/:Ammo_id', Ammo.deleteammo);

// 飞机-有售器件关联
router.post('/addAirplaneDevice', AirplaneDevice.addAirplaneDevice);
router.post('/updateAirplaneDevice', AirplaneDevice.updateAirplaneDevice);
router.get('/getAirplaneDevice', AirplaneDevice.getAirplaneDevice);
router.get('/getAirplaneDeviceCount', AirplaneDevice.getAirplaneDeviceCount);
router.get('/getAirplaneDevice/:AirplaneDevice_id', AirplaneDevice.getAirplaneDeviceDetail);
router.delete('/deleteAirplaneDevice/:AirplaneDevice_id', AirplaneDevice.deleteAirplaneDevice);

// 飞机-弹药关联
router.post('/addAirplaneAmmo', AirplaneAmmo.addAirplaneAmmo);
router.post('/updateAirplaneAmmo', AirplaneAmmo.updateAirplaneAmmo);
router.get('/getAirplaneAmmo', AirplaneAmmo.getAirplaneAmmo);
router.get('/getAirplaneAmmoCount', AirplaneAmmo.getAirplaneAmmoCount);
router.get('/getAirplaneAmmo/:AirplaneAmmo_id', AirplaneAmmo.getAirplaneAmmoDetail);
router.delete('/deleteAirplaneAmmo/:AirplaneAmmo_id', AirplaneAmmo.deleteAirplaneAmmo);

// 飞机-车辆关联
router.post('/addAirplaneCar', AirplaneCar.addAirplaneCar);
router.post('/updateAirplaneCar', AirplaneCar.updateAirplaneCar);
router.get('/getAirplaneCar', AirplaneCar.getAirplaneCar);
router.get('/getAirplaneCarCount', AirplaneCar.getAirplaneCarCount);
router.get('/getAirplaneCar/:AirplaneCar_id', AirplaneCar.getAirplaneCarDetail);
router.delete('/deleteAirplaneCar/:AirplaneCar_id', AirplaneCar.deleteAirplaneCar);

export default router