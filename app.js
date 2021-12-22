const jwt = require('jsonwebtoken')

require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const user = {
    id: 1,
    name: 'sidoux',
    email: 'sidoux@sidoux.com',
    admin: true,
};

function generateToken(user) {
  return jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '900s' });
}

const accessToken = generateToken(user)
console.log(accessToken)

app.post('/api/login', (req, res) => {

    // utiliser les mails/password de la bdd
    if (req.body.email != 'sidoux@sidoux.com' && req.body.password != 'oui') {
        res.status(401).send('invalid credentials');
        return ;
    }

  const accessToken = generateToken(user);
  res.send({
        accessToken,
    });

});

app.listen(3000, () => console.log('Server running on port 3000!'));