import pg from 'pg';
const {
  Client
} = pg;

export function signup(input) {
  console.log(input.acnm);
  console.log(input.pwd);
  console.log(input.emad);

  let acc_name = input.acnm;
  let paswd = input.pwd;
  let emlads = input.emad;

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

  client.query(`INSERT INTO account (name, password, email) VALUES ($1, $2, $3)`, [acc_name, paswd, emlads], (err, res) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("insert success");
    };
  });

  // execute the insert query using the pool
  client.query(`SELECT * from account`, (err, res) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(res.rows);
    };
    client.end();
  });


  console.log("succeed");

}
