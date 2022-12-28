namespace ServiceManager {
    export type JarServiceStatus = 'running' | 'stopped';
    
    export interface JarService {
        start: () => Promise<any>;
        stop: () => Promise<boolean>;
        status: () => JarServiceStatus; 
    };

    export const createIntervalService = (cb:()=>any, t:number):Readonly<JarService> => {
        const storage:{
            duration: number;
            timerId: NodeJS.Timer|undefined;
        } = {
            duration: t,
            timerId: undefined
        };


        const result:JarService = {
            start: async () => {
                if(storage.timerId !== undefined){
                    console.log('Service was being ran !');
                    return false;
                };

                storage.timerId = setInterval(()=>{
                    cb();
                }, storage.duration);

                return true;
            },
            stop: async () => {
                if(storage.timerId === undefined){
                    console.log('Service was being stopped !');
                    return false;
                }

                clearInterval(storage.timerId);
                storage.timerId = undefined;
                
                return true;
            },
            status: () => {
                if(storage.timerId === undefined){
                    return 'stopped';
                }

                return 'running';
            }
        };

        return Object.freeze(result);
    }


    export const createTimeService = (cb:()=>any, t:string[], locales: Intl.LocalesArgument = 'VN'):Readonly<JarService> => {
        const storage:{
            durations: readonly string[];
            timerId: NodeJS.Timer|undefined;
        } = {
            durations: Object.freeze([...t]),
            timerId: undefined
        };

        const result:JarService = {
            start: async () => {
                if(storage.timerId !== undefined){
                    console.log('Service was being ran !');
                    return false;
                };

                storage.timerId = setInterval(()=>{
                    const currentStrTime = (new Date()).toLocaleTimeString(locales, {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    });
                    // 12:01:01

                    if(storage.durations.includes(currentStrTime)){
                        cb();
                    }
                }, 1_000);

                return true;
            },
            stop: async () => {
                if(storage.timerId === undefined){
                    console.log('Service was being stopped !');
                    return false;
                }

                clearInterval(storage.timerId);
                storage.timerId = undefined;
                
                return true;
            },
            status: () => {
                if(storage.timerId === undefined){
                    return 'stopped';
                }
                
                return 'running';
            }
        };

        return Object.freeze(result);
    }
}

export default ServiceManager;