import cron from 'node-cron';
import prisma from '../config/db.js';

cron.schedule('*/1 * * * *', async () => {
    try {
        const now = new Date();

        await prisma.otp.deleteMany({
            where:{
                OR: [
                    { expireat: {lt: now} },
                    { attempt: { gte: 3 } },
                    { isverified: false }
                ]
            }
        })
        console.error('[CRON')
    } catch {
        console.error('[CRON ERROR]', error.message);
    }
})

export default cron;