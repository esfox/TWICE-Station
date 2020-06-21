const { Coins } = require('./models');
const { db } = require('./database');

(async () =>
{
  /* ["col-pl","col-tz","col-mn","col-jy","col-mm","col-jys"] */
  // const result = await Coins.ofUser('461457785650020363');
  // console.log(result)

  const result = await db.raw('select * from users');
  console.log(result);
})();
