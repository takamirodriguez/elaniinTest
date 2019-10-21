const mysql = require('mysql');


connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'backenddb',
});
let loginModel = {};

loginModel.doLogin = (userData, callback) => {
    if(connection){
        let username = userData.username;
        let password = userData.password;
        let query = `SELECT * FROM users 
        WHERE username = ? AND 
         password = ? LIMIT 1;`;
        connection.query(query, [username,password],(err, row) => {
                    if(err) {
                        throw err;
                    } else {
                        if(row) {
                    callback(null,{
                                success: true,
                                data: row
                            }
                        );
                        } else {
                            callback(null,{
                                    success: false
                                }
                            );
                        }
                    }

        })
    }
};

module.exports = loginModel;