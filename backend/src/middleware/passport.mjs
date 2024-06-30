import passport from 'passport';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import dotenv from 'dotenv';
import UsersModel from '../models/Users.mjs';
dotenv.config();

// Validate access token
passport.use(
  'jwt-access-token',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //Get form header Authorization: Bearer token....
      secretOrKey: process.env.JWT_SECRET_ACCESS_TOKEN,
    },
    /**
     * Khi đã encode thành công jwt thì ta sẽ nhận được thông điệp payload đã gửi
     * Verify khi có user với id=payload.sub. Khi đó req sẽ thêm field user=user vừa tìm được
     * Unauthorized khi ngược lại.
     * @param {PassportPayload} payload
     * @param {import('passport-jwt').VerifiedCallback} done
     */
    async (payload, done) => {
      try {
        const user = await UsersModel.findOne({_id: payload.sub});

        if (!user) {
          return done(null, false, payload);
        }

        return done(null, user, payload);
      } catch (err) {
        done(err, false);
      }
    },
  ),
);

// Validate the refresh token
passport.use(
  'jwt-refresh-token',
  new JwtStrategy(
    {
      jwtFromRequest: (req) => req.headers.authorizationrefreshtoken, //Extractor
      secretOrKey: process.env.JWT_SECRET_REFRESH_TOKEN,
    },
    /**
     * Khi đã encode thành công jwt thì ta sẽ nhận được thông điệp payload đã gửi
     * Ở đây ta sẽ check thông tin về refresh token
     * Verify khi có user với id=payload.sub và payload.exp chưa quá hạn
     * Unauthorized khi ngược lại.
     * @param {PassportPayload} payload
     * @param {import('passport-jwt').VerifiedCallback} done
     */
    async (payload, done) => {
      try {
        if (new Date().getTime() > payload.exp) {
          return done(null, false, payload);
        }

        const user = await UsersModel.findOne({_id: payload.sub});
        if (!user) {
          return done(null, false, payload);
        }

        return done(null, user, payload);
      } catch (err) {
        done(err, false);
      }
    },
  ),
);

// Check email and password for authType local
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // Get email address field
      passwordField: 'password', // Get password field;
      session: false,
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await UsersModel.findOne({email: email});
        return done(null, user || {});
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

// Passport Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_API_CLIENT_ID,
      clientSecret: process.env.GOOGLE_API_CLIENT_SECRET,
      passReqToCallback: true,
      callbackURL: '/api/v1/users/callback',
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const photos = !!profile.photos?.[0] && profile.photos[0].value;
        const email = !!profile.emails?.[0] && profile.emails[0].value;
        // Check whether the user exists in our database
        const userGoogle = await UsersModel.findOne({
          email: email,
        });
        if (userGoogle) return done(null, userGoogle);

        // If the first login with Google
        const newUser = new UsersModel({
          authType: 'google',
          email: email,
          avatar: {url: photos, id: null, public_id: null},
          fullName: profile.displayName,
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error);
      }
    },
  ),
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

export default passport;
