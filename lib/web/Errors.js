'use strict';

var util = require('util');

function UserNotAuthenticatedError(message) {
  Error.captureStackTrace(this, UserNotAuthenticatedError);
  this.name = UserNotAuthenticatedError.name;
  this.message = this.message || "The current user is not Authenticated";
}

function UserMissingRequiredScopesError(message) {
  Error.captureStackTrace(this, UserMissingRequiredScopesError);
  this.name = UserMissingRequiredScopesError.name;
  this.message = this.message || "The current user is not authorised to perform the action";
}

function UserAuthenticationFailedError(message) {
  Error.captureStackTrace(this, UserAuthenticationFailedError);
  this.name = UserAuthenticationFailedError.name;
  this.message = this.message || "User authentication failed";
}

function AuthenticationRedirectRequestedError(message) {
  Error.captureStackTrace(this, AuthenticationRedirectRequestedError);
  this.name = AuthenticationRedirectRequestedError.name;
  this.message = this.message || "Authentication redirect requested";
}

function ProviderCantHandleAuthenticationRequestError(message) {
  Error.captureStackTrace(this, ProviderCantHandleAuthenticationRequestError);
  this.name = ProviderCantHandleAuthenticationRequestError.name;
  this.message = this.message || "Provider cannot handle this authentication request";
}

function NoAuthenticationProvidersCanHandleRequestError(message) {
  Error.captureStackTrace(this, NoAuthenticationProvidersCanHandleRequestError);
  this.name = NoAuthenticationProvidersCanHandleRequestError.name;
  this.message = this.message || "There are no providers which can handle this authentication request";
}

util.inherits(UserNotAuthenticatedError, Error);
util.inherits(UserMissingRequiredScopesError, Error);
util.inherits(UserAuthenticationFailedError, Error);
util.inherits(AuthenticationRedirectRequestedError, Error);
util.inherits(ProviderCantHandleAuthenticationRequestError, Error);
util.inherits(NoAuthenticationProvidersCanHandleRequestError, Error);

module.exports = {
  "UserNotAuthenticatedError" : UserNotAuthenticatedError,
  "UserMissingRequiredScopesError" : UserMissingRequiredScopesError,
  "UserAuthenticationFailedError" : UserAuthenticationFailedError,
  "AuthenticationRedirectRequestedError" : AuthenticationRedirectRequestedError,
  "ProviderCantHandleAuthenticationRequestError" : ProviderCantHandleAuthenticationRequestError,
  "NoAuthenticationProvidersCanHandleRequestError" : NoAuthenticationProvidersCanHandleRequestError
}
