/**
 * Error response
 *
 * @param  {string} message - error string
 * @param  {Integer} statusCode - status code
 * @param {any} response - expressJS response object
 * @returns {object} response object
 */
export const errorResponse = (response, statusCode, message, data = null) =>
  response.status(statusCode).json({
    status: "error",
    message,
    data,
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
