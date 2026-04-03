const cron = require("node-cron");
const UserPlan = require("./models/UserPlan");

cron.schedule("0 0 * * *", async () => {
    console.log("Running token cron...");

    const plans = await UserPlan.find({
        isActive: true,
        tokenDistribution: "monthly"
    });

    const now = new Date();

    for (let plan of plans) {

        if (plan.nextCreditDate && now >= plan.nextCreditDate) {

            plan.planTokens += plan.monthlyTokens;

            let next = new Date(plan.nextCreditDate);
            next.setMonth(next.getMonth() + 1);

            plan.nextCreditDate = next;

            await plan.save();

            console.log("Tokens added:", plan.userId);
        }
    }
});