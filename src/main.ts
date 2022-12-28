import express, { Request, Response } from 'express';
import ServiceManager from './utils/service-manager';

const PORT = 8080;

const storage: {
    messages: string[];
} = {
    messages: [],
};

const main = async () => {
    let couter = 0;

    //! Tự động log
    const autoLogService = ServiceManager.createIntervalService(
        // Nhận vào 1 callback sẽ tự động được chạy mỗi khi đến các khoảng thời gian như khai báo ở bên dưới.
        // Có thể là async function hoặc là sync function. Ví dụ bên dưới chạy sync function.
        () => {
            const strCurrentTime = new Date().toLocaleString('vi-VN', {
                timeZone: 'Asia/Ho_Chi_Minh',
            });

            storage.messages.push(
                `[autoLogService] ${strCurrentTime} Tự động thêm dòng này mỗi 1s`,
            );

            //? Log ra để biết hàm này đang được gọi
            console.log(
                '[autoLogService]',
                strCurrentTime,
                'Tự động log mỗi 1s đang dược gọi...',
            );

            // if(couter > 5){
            //     // Tự động dùng service khi couter > 5;
            //     autoLogService.stop();
            // }
            // couter += 1;
        },

        // khoảng thời gian sẽ tự động chạy service.
        1_000,
    );

    //! Service tự động gửi mail
    const autoSendMailService = ServiceManager.createTimeService(
        // Nhận vào 1 callback sẽ tự động được chạy mỗi khi đến các khoảng thời gian như khai báo ở bên dưới.
        // Có thể là async function hoặc là sync function. Ví dụ bên dưới chạy async function.
        async () => {
            const strCurrentTime = new Date().toLocaleString('vi-VN', {
                timeZone: 'Asia/Ho_Chi_Minh',
            });

            storage.messages.push(
                `[autoSendMailService] ${strCurrentTime} Tự động thêm dòng này mỗi khi đồng hồ đạt các giá trị thời gian cụ thể`,
            );
            //? Log ra để biết hàm này đang được gọi
            console.log(
                '[autoLogService]',
                strCurrentTime,
                'autoSendMailService đang dược gọi... lúc',
                strCurrentTime,
            ); // Log
        },

        // Tự động thêm log mỗi khi đồng hồ chỉ đúng các khoảng thời gian
        [
            '12:42:00',
            '12:42:10',
            '12:42:20',
            '12:42:30',
            '00:00:00', // Tự động gọi cb lúc 0 giờ mỗi ngày.
        ],

        // TimeZone. Default 'Asia/Ho_Chi_Minh'
        'Asia/Ho_Chi_Minh', // Mỗi quốc gia sẽ có múi giờ khác nhau. Ví dụ:
        //         12h trưa ở Việt Nam (Asia/Ho_Chi_Minh)
        //         sẽ là khoảng 0h sáng tại Mỹ (America/Whitehorse).
        // Server có thể đặt tại bất kỳ vị trí nào trên thế giới nên để set thời gian thì cần một múi giờ tại một quốc gia làm mốc.
        // Danh sách TimeZone: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
    );

    const autoSendMail2 = ServiceManager.createTimeService(() => {
        console.log('autoSendMail2 running....');
    }, ['19:28:00']);

    autoSendMail2.start();

    //! Bắt đầu chạy tất cả service đã khởi tạo.
    //! Start service sẽ không làm ứng dụng bị dừng lại ở dòng này.
    autoLogService.start();
    autoSendMailService.start();

    //! Khổi tạo server ========================
    const app = express();

    app.get('/', async (req: Request, res: Response) => {
        res.status(200).json(storage);
    });

    app.get('/stop-all', async (req: Request, res: Response) => {
        const result = await Promise.all([
            autoLogService.stop(),
            autoSendMailService.stop(),
        ]);

        res.status(200).json({
            success: result,
        });
    });

    app.get('/start-all', async (req: Request, res: Response) => {
        const [result1, result2] = await Promise.all([
            autoLogService.start(),
            autoSendMailService.start(),
        ]);

        res.status(200).json({
            success: [result1, result2],
        });
    });

    app.get('/clean', async (req: Request, res: Response) => {
        storage.messages = [];

        res.status(200).json(storage);
    });

    app.listen(PORT, () => {
        console.log('Server runing on ', PORT);
    });
};

main();
