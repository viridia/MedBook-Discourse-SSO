# MedBook-Discourse-SSO

Single-Sign-On Provider for MedBook Discourse Server

## Overview

This project demonstrates how to integrate Discourse's single sign-on (SSO) feature with a Meteor-based application.

## Enabling SSO in Discourse

You can enable SSO in discourse via the admin panel, under Settings / Login. You'll need the URL of the login server
(i.e. this app) and a string containing a secret.

* The URL should be of the form 'http://_my.hosting.site_/login'.
* The secret can be any arbitrary string, but it must be at least 10 characters long.

**Note:** Once you enable SSO in Discourse, you will not be able to log in again except through the login server. Existing
logged-in sessions will still continue to work. You should make sure that the login server is running correctly before
you do this.

## Running the login server

The login server requires a settings file. There is currently a `settings-dev.json` which can be used for development.
For production, you will want to create a `settings-prod.json`, which **must never** be checked into source control.

The settings file contains a copy of the secret and the root URL of the Discourse site:

```
{
  "private": {
    "discourse": {
      "sso": {
        "secret": "secret_squrrl",
        "site": "http://107.170.251.173/discuss/"
      }
    }
  }
}
```

To start the server, run:

```
meteor --settings settings-dev.json
```

## Design notes

The login server uses the 'useraccounts' package to display the various account forms such as login, signup,
change password, forgot password, and so on. Unlike the standard Meteor 'accounts' package, the 'useraccounts'
package makes it easy to have a full-page login form instead of a popup.

The 'useraccounts' package also requires that you choose a UI toolkit such as Bootstrap, Materialize, Polymer, etc.
For the sake of simplicity, I have chosen to use Bootstrap, but this can easily be changed.

For testing purposes, it will be useful to be able to sign out. This can be done by navigating to '/', that is the root
of the login server site, where there is a signout button. The actual login page is located at '/login'.

Note that you can log in & register without doing an SSO redirect. The way this works is that the login page looks
for query parameters named 'sso' and 'sig', which are normally provided by Discourse as part of the SSO protocol.
If these parameters are present, and the user is either already logged in or completes a sucessful login or
registration, it will do a redirect to the Discourse server. If those parameters are not present, it merely displays
the login page.

I have not enabled extra security features such as email verification, but these can be turned on via the
`AccountsTemplate.config()` call.

There is currently no error handling other than `console.log()`.

