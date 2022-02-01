module.exports = (ndx) => {
  ndx.database.on('ready', () => {
    const checkSchedule = async (t) => {
      let item = await ndx.database.selectOne('schedule', {when:{'$lt':new Date().toISOString()},processed:null});
      if(item) {
        item.processed = true;
        await ndx.database.upsert('schedule', item);
        const numbers = item.numbers.split(/\n/g).map(num => num.trim()).filter(num => num);
        numbers.forEach(number => {
          const numsplit = number.split(/\s*,\s*/g);
          let i = 0;
          let data = {};
          while(i++ < numsplit.length - 1) {
            data['$' + i] = numsplit[i].trim();
          }
          console.log('body', item.message.trim());
          console.log('data', data);
          /*ndx.sms.send({
            originator: item.from.trim(),
            numbers: [numsplit[0].trim()],
            body: item.message.trim(),
            EmailAddressToSendReplies: ((item.receiveReplies==='Yes' && item.emailAddress) || '').trim()
          }, data)*/
        })
      }
    }
    setInterval(checkSchedule, 15 * 1000);
    checkSchedule(1);
  })
}