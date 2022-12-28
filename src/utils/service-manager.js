"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServiceManager;
(function (ServiceManager) {
    const getStrCurrentTime = (timeZone) => {
        return new Date().toLocaleTimeString('vi-VN', {
            timeZone,
            hour12: false,
            hour: '2-digit',
            second: '2-digit',
            minute: '2-digit',
        });
    };
    ServiceManager.createIntervalService = (cb, t) => {
        const storage = {
            duration: t,
            timerId: undefined,
        };
        const result = {
            start: async () => {
                if (storage.timerId !== undefined) {
                    console.log('Service was being ran !');
                    return false;
                }
                storage.timerId = setInterval(() => {
                    cb();
                }, storage.duration);
                return true;
            },
            stop: async () => {
                if (storage.timerId === undefined) {
                    console.log('Service was being stopped !');
                    return false;
                }
                clearInterval(storage.timerId);
                storage.timerId = undefined;
                return true;
            },
            status: () => {
                if (storage.timerId === undefined) {
                    return 'stopped';
                }
                return 'running';
            },
        };
        return Object.freeze(result);
    };
    ServiceManager.createTimeService = (cb, t, timeZone = 'Asia/Ho_Chi_Minh') => {
        const storage = {
            durations: Object.freeze([...t]),
            timerId: undefined,
        };
        const result = {
            start: async () => {
                if (storage.timerId !== undefined) {
                    console.log('Service was being ran !');
                    return false;
                }
                storage.timerId = setInterval(() => {
                    if (!storage.durations.includes(getStrCurrentTime(timeZone))) {
                        return;
                    }
                    cb();
                }, 1000);
                return true;
            },
            stop: async () => {
                if (storage.timerId === undefined) {
                    console.log('Service was being stopped !');
                    return false;
                }
                clearInterval(storage.timerId);
                storage.timerId = undefined;
                return true;
            },
            status: () => {
                if (storage.timerId === undefined) {
                    return 'stopped';
                }
                return 'running';
            },
        };
        return Object.freeze(result);
    };
})(ServiceManager || (ServiceManager = {}));
exports.default = ServiceManager;
