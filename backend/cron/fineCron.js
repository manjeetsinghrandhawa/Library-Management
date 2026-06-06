const cron = require("node-cron");

const Borrow = require("../Borrow/borrow.model");

const updateFines = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log(
        "Running fine calculation..."
      );

      const borrows =
        await Borrow.find({
          status: {
            $in: [
              "BORROWED",
              "OVERDUE",
            ],
          },
        });

      const today = new Date();

      for (const borrow of borrows) {
        if (today > borrow.dueDate) {
          const lateDays =
            Math.ceil(
              (today -
                borrow.dueDate) /
                (1000 *
                  60 *
                  60 *
                  24)
            );

          borrow.status =
            "OVERDUE";

          borrow.fine =
            lateDays * 10;

          await borrow.save();
        }
      }

      console.log(
        "Fine calculation completed"
      );
    } catch (error) {
      console.error(
        "Cron Error:",
        error
      );
    }
  });
};

module.exports = updateFines;