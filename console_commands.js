const commander = require('commander');
const { RoomBooking } = require('./app');

commander
  .command('clear_database')
  .description('Очистить базу данных')
  .action(async () => {
    try {
      await RoomBooking.destroy({ where: {} });
      console.log('База данных очищена успешно.');
    } catch (error) {
      console.error('Ошибка при очистке базы данных:', error);
    }
  });

commander.parse(process.argv);