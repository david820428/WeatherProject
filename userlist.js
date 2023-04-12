import pg from 'pg';
const {
  Client
} = pg;

export function userlist() {

  const client = new Client({
    user: 'mydb_ab3v_user',
    host: 'dpg-cgnng2ou9tun42st144g-a.singapore-postgres.render.com',
    database: 'mydb_ab3v',
    password: 'NszA3WUQwKvA9pA3Uu5cerIiylNL7Pkp',
    port: 5432,
    ssl: true
  });

  client.connect(function(err) {
    console.log(err);
  });


  return new Promise((resolve, reject) => {
    const result = [];

    client.query('SELECT * from account', (err, res) => {
      if (err) {
        reject(err);
      } else {
        result.push(...res.rows);
        resolve(result);
      }
      client.end();
    });
  });



}
