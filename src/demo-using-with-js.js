const ServiceManager = require('./utils/service-manager.js').default;

const main = async () => {
    const autoLogService = ServiceManager.createIntervalService(()=>{
        const strCurrentTime = (new Date()).toLocaleTimeString('vi-VN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'UTC'
        });

        console.log('[autoLogService]', strCurrentTime, (new Date()).toUTCString());
    }, 1_000);

    autoLogService.start();
}

main();