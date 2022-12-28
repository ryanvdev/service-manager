
// import ServiceManager from './utils/service-manager.js';
const ServiceManager = require('./utils/service-manager.js').default;

const main = async () => {

    let couter = 0;
    const autoLogService = ServiceManager.createIntervalService(async () => {
        console.log('Log....');
        if(couter > 5){
            autoLogService.stop();
        }
        couter += 1;
    }, 1_000);

    autoLogService.start();
}

main();