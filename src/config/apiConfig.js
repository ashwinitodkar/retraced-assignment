'use strict';
const config = {
  default_success_http_code: 200,
  unauthorized_error_code: 401,
  default_not_found_http_code: 404,
  default_bad_request_http_code: 400,
  default_error_http_code: 500,
  default_conflict_http_code: 409,
  default_success_message: 'Successfully processed the request',
  unauthorized_error_message: 'Access is denied due to invalid credentials',
  default_not_found_message: 'No records found',
  default_conflict_found_message: 'Duplicate records found',
  default_error_message: 'Sorry, invalid request',
  service_down_message: 'Oops, something went wrong, please try again later',
  bad_request_message: 'bad request',
};

module.exports = config;
