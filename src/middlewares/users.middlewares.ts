import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { validate } from '~/utils/validation'

export const loginValidator = validate(
  checkSchema({
    email: {
      isEmail: { errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const user = await databaseService.users.findOne({ email: value, password: hashPassword(req.body.password) })

          if (user === null) {
            throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT)
          }
          req.user = user

          return true
        }
      }
    },
    password: {
      notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
      isString: { errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRING },
      isLength: { options: { min: 6, max: 50 }, errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50 },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
      }
    }
  })
)

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
      },
      isString: {
        errorMessage: USERS_MESSAGES.NAME_MUST_BE_STRING
      },
      isLength: { options: { min: 3, max: 100 }, errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100 },
      trim: true
    },
    email: {
      isEmail: { errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID },
      trim: true,
      custom: {
        options: async (value) => {
          const isExistEmail = await usersService.checkEmailExist(value)

          if (isExistEmail) {
            throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
          }

          return true
        }
      }
    },
    password: {
      notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
      isString: { errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRING },
      isLength: { options: { min: 6, max: 50 }, errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50 },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
      }
    },
    confirm_password: {
      notEmpty: { errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED },
      isString: { errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRING },
      isLength: {
        options: { min: 6, max: 50 },
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_IS_NOT_MATCH)
          } else {
            return true
          }
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        },
        errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_MUST_IS_ISO8601
      }
    }
  })
)
