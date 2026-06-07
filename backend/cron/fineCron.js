const cron = require("node-cron");

const Borrow = require(
  "../Borrow/borrow.model"
);

const updateFines = () => {
  cron.schedule(
    "0 0 * * *",
    async () => {
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

        const today =
          new Date();

        today.setHours(
          0,
          0,
          0,
          0
        );

        for (const borrow of borrows) {
          const dueDate =
            new Date(
              borrow.dueDate
            );

          dueDate.setHours(
            0,
            0,
            0,
            0
          );

          if (
            today > dueDate
          ) {
            const lateDays =
              Math.floor(
                (today -
                  dueDate) /
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
    }
  );
};

module.exports = updateFines;