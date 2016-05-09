const oauth2orize = require('oauth2orize');
const passport = require('passport');
const crypto = require('crypto');

const { join } = require('path');
const CWD = process.cwd();
const config = require(join(CWD, 'config'));

const { UserModel, ClientModel, AccessTokenModel, RefreshTokenModel } = require(join(CWD, 'model/Auth.js'));


// create OAuth 2.0 server
var aserver = oauth2orize.createServer();

// Generic error handler
var errFn = function (cb, err) {
  if (err) { 
    return cb(err); 
  }
};

// Destroys any old tokens and generates a new access and refresh token
var generateTokens = function (data, done) {

  // curries in `done` callback so we don't need to pass it
    var errorHandler = errFn.bind(undefined, done), 
      refreshToken,
      refreshTokenValue,
      token,
      tokenValue;

    RefreshTokenModel.remove(data, errorHandler);
    AccessTokenModel.remove(data, errorHandler);

    tokenValue = crypto.randomBytes(32).toString('hex');
    refreshTokenValue = crypto.randomBytes(32).toString('hex');

    data.token = tokenValue;
    token = new AccessTokenModel(data);

    data.token = refreshTokenValue;
    refreshToken = new RefreshTokenModel(data);

    refreshToken.save(errorHandler);

    token.save(function (err) {
      if (err) {
      
      log.error(err);
        return done(err); 
      }
      done(null, tokenValue, refreshTokenValue, { 
        'expires_in': config.get('security:tokenLife') 
      });
    });
};

// Exchange username & password for access token.
aserver.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {
  
  UserModel.findOne({ username: username }, function(err, user) {
    
    if (err) { 
      return done(err); 
    }
    
    if (!user || !user.checkPassword(password)) {
      return done(null, false);
    }

    var model = { 
      userId: user.userId, 
      clientId: client.clientId 
    };

    generateTokens(model, done);
  });

}));

// Exchange refreshToken for access token.
aserver.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {

  RefreshTokenModel.findOne({ token: refreshToken, clientId: client.clientId }, function(err, token) {
    if (err) { 
      return done(err); 
    }

    if (!token) { 
      return done(null, false); 
    }

    UserModel.findById(token.userId, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }

      var model = { 
        userId: user.userId, 
        clientId: client.clientId 
      };

      generateTokens(model, done);
    });
  });
}));

// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

exports.token = [
  passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
  aserver.token(),
  aserver.errorHandler(),
];