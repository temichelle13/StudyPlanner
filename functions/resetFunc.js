
  /*
    This function will be run when the client SDK 'callResetPasswordFunction' and is called with an object parameter
    which contains four keys: 'token', 'tokenId', 'username', and 'password', and additional parameters
    for each parameter passed in as part of the argument list from the SDK.

    The return object must contain a 'status' key which can be empty or one of three string values:
      'success', 'pending', or 'fail'

    'success': the user's password is set to the passed in 'password' parameter.

    'pending': the user's password is not reset and the UserPasswordAuthProviderClient 'resetPassword' function would
      need to be called with the token, tokenId, and new password via an SDK. (see below)

      const Realm = require("realm");
      const appConfig = {
          id: "my-app-id",
          timeout: 1000,
          app: {
              name: "my-app-name",
              version: "1"
          }
        };
      let app = new Realm.App(appConfig);
      let client = app.auth.emailPassword;
      await client.resetPassword(token, tokenId, newPassword);

    'fail': the user's password is not reset and will not be able to log in with that password.

    If an error is thrown within the function the result is the same as 'fail'.

    Example below:

    exports = ({ token, tokenId, username, password }, sendEmail, securityQuestionAnswer) => {
      // process the reset token, tokenId, username and password
      if (sendEmail) {
        context.functions.execute('sendResetPasswordEmail', username, token, tokenId);
        // will wait for SDK resetPassword to be called with the token and tokenId
        return { status: 'pending' };
      } else if (context.functions.execute('validateSecurityQuestionAnswer', username, securityQuestionAnswer)) {
        // will set the users password to the password parameter
        return { status: 'success' };
      }

      // will not reset the password
      return { status: 'fail' };
    };

    The uncommented function below is just a placeholder and will result in failure.
  */

exports = async ({ token, tokenId, username, password }) => {
  const serviceName = 'mongodb-atlas';
  const dbName = 'myDatabase';
  const users = context.services.get(serviceName).db(dbName).collection('users');

  try {
    const user = await users.findOne({ username, resetToken: token, resetTokenId: tokenId });
    if (!user) {
      return { status: 'fail' };
    }

    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash(password, 8);
    await users.updateOne(
      { _id: user._id },
      { $set: { password: hashed }, $unset: { resetToken: '', resetTokenId: '' } }
    );
    return { status: 'success' };
  } catch (err) {
    console.error('Error in resetFunc:', err);
    return { status: 'fail' };
  }
};
