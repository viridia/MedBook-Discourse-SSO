discourse_sso = Npm.require('discourse-sso');

const sso = new discourse_sso(Meteor.settings.private.discourse.sso.secret);

Meteor.methods({
  discourse_sso: function(payload, sig) {
    // Make sure the request is well-formed.
    if (!sso.validate(payload, sig)) {
      throw new Meteor.Error('invalid-sso', 'Invalid SSO params');
      return;
    }

    // Ensure the user is logged in.
    const user = Meteor.user();
    if (!user) {
      // Not logged in
      return {};
    }

    var nonce = sso.getNonce(payload);
    var userparams = {
      // Required, will throw exception otherwise
      'nonce': nonce,
      'external_id': Meteor.userId(), // TODO: Does it matter that we expose the mongo id?
      // Note that these fields will be in different locations depending on what service provider
      // was used to log in.
      'email': user.emails[0].address,
      'username': user.username,
    };

    var q = sso.buildLoginString(userparams);
    return {
      redirect: Meteor.settings.private.discourse.sso.site + 'session/sso_login?' + q
    };
  }
});
