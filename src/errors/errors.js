class MissingFieldsError extends Error {}

class ExistingUserError extends Error {}

class UserNotFoundError extends Error {}

class InvalidPasswordError extends Error {}

module.exports = {
	MissingFieldsError,
	ExistingUserError,
	UserNotFoundError,
	InvalidPasswordError,
}
