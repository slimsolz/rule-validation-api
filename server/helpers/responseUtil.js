/**
 * Error response
 *
 * @param  {string} error - error string
 * @param  {Integer} statusCode - status code
 * @param {any} response - expressJS response object
 * @returns {object} response object
 */
export const errorResponse = (response, statusCode, error, message) =>
  response.status(statusCode).json({
    status: "fail",
    message: error,
  });

/**
 * Success response
 *
 * @param  {string} message - response message
 * @param  {Integer} statusCode - status code
 * @param {Array} response - data object
 * @returns {object} response object
 */
export const successResponse = (response, statusCode, message, data) =>
  response.status(statusCode).json({
    status: "success",
    message,
    data,
  });
