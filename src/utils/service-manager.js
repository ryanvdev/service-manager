"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServiceManager;
(function (ServiceManager) {
    ;
    ServiceManager.createIntervalService = (cb, t) => {
        const storage = {
            duration: t,
            timerId: undefined
        };
        const result = {
            start: async () => {
                if (storage.timerId !== undefined) {
                    console.log('Service was being ran !');
                    return false;
                }
                ;
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
            }
        };
        return Object.freeze(result);
    };
    ServiceManager.createTimeService = (cb, t, locales = 'VN') => {
        const storage = {
            durations: Object.freeze([...t]),
            timerId: undefined
        };
        const result = {
            start: async () => {
                if (storage.timerId !== undefined) {
                    console.log('Service was being ran !');
                    return false;
                }
                ;
                storage.timerId = setInterval(() => {
                    const currentStrTime = (new Date()).toLocaleTimeString(locales, {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    });
                    // 12:01:01
                    if (storage.durations.includes(currentStrTime)) {
                        cb();
                    }
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
            }
        };
        return Object.freeze(result);
    };
})(ServiceManager || (ServiceManager = {}));
exports.default = ServiceManager;
