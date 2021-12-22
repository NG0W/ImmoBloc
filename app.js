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

function generateTokenRefresh(user) {
  return jwt.sign(user, process.env.SECRET_REFRESH_TOKEN, { expiresIn: '1y' });
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
  const refreshToken = generateTokenRefresh(user);
  res.send({
        accessToken,
        refreshToken
    });

});

app.post('/api/tokenRefresh', (req, res) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.SECRET_REFRESH_TOKEN, (err, user) => {
    if (err) {
      return res.sendStatus(401)
    }

    //vérifier dans la database si l'user est toujours existant/autorisé à utiliser la plateforme
    delete user.iat;
    delete user.exp;
    const refreshedToken = generateToken(user);
    res.send({
      accessToken: refreshedToken,
    });
  });
});

function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization']
  //console.log("HERE : " + authHeader)
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.sendStatus(401)
    }
    req.user = user;
    next();
  });
}
app.get('/api/me', authenticateJWT, (req, res) => {
  res.send(req.user);
});
app.listen(3000, () => console.log('Server running on port 3000!'));