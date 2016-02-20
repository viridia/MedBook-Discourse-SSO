// Send the SSO request params to the server and redirect if they are valid.
var ssoRedirect = function() {
  // Successfully logged in or signed up.
  const sso = FlowRouter.getQueryParam('sso');
  const sig = FlowRouter.getQueryParam('sig');
  console.log('redirectIfLoggedIn', sso, sig);
  if (sso && sig) {
    Meteor.call('discourse_sso', sso, sig, function(error, result) {
      if (error) {
        console.log(error.reason);
      } else {
        console.log('result:', result);
        if (result.redirect) {
          window.location = result.redirect;
        }
      }
    });
  }
}

// Configuration for the above hook.
AccountsTemplates.configure({
  onSubmitHook: ssoRedirect
});

// Note: useraccounts package requires dynamic routing - otherwise it executes too early.
FlowRouter.route('/', {
  action: function(params, queryParams) {
    BlazeLayout.render('main', {});
  }
});

FlowRouter.route('/login', {
  action: function(params, queryParams) {
    // Do an SSO redirect immediately if we are already logged in.
    if (Meteor.userId()) {
      ssoRedirect();
    }
    // Otehrwise render the login page.
    BlazeLayout.render('login', {main: 'login', params: queryParams});
  }
});
