import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  LinearProgress,
  Link,
  TextField,
  Tooltip,
} from '@material-ui/core';
import {Formik, FormikErrors, FormikHelpers, FormikProps} from 'formik';
import {
  calculatePasswordStrength,
  isEmailAddress,
} from '@entail/business-logic';

import {InformationIcon} from '@iconicicons/react';
import {KeyboardDatePicker} from '@material-ui/pickers';
import React from 'react';
import {ShowPasswordInput} from '../../show-password-input/show-password-input';
import {application} from '../../../lib/application-constants';

interface EntailCreateAccountFormValues {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  betakey: string;
  dob: Date | null;
}

/** The underlying form component for EntailCreateAccountForm. */
function EntailCreateAccountFormik(
  props: FormikProps<EntailCreateAccountFormValues>
): React.ReactNode {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setFieldValue,
  } = props;

  const [passwordStrength, setPasswordStrength] = React.useState<number>(0);

  React.useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(values.password) / 4);
  }, [values.password]);

  const dateOfBirthFieldName = 'dob';

  return (
    <form noValidate onSubmit={handleSubmit}>
      <TextField
        fullWidth
        name="username"
        label="username"
        value={values.username}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.username && !!errors.username}
        helperText={touched.username && errors.username}
      />

      <TextField
        fullWidth
        name="email"
        label="email"
        type="email"
        placeholder="enny@entail.email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email && !!errors.email}
        helperText={touched.email && errors.email}
      />

      <div>
        <FormControl fullWidth error={touched.password && !!errors.password}>
          <InputLabel htmlFor="entail-create-account-form-password">
            password
          </InputLabel>
          <ShowPasswordInput
            id="entail-create-account-form-password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FormHelperText>{touched.password && errors.password}</FormHelperText>
        </FormControl>
        <LinearProgress variant="determinate" value={passwordStrength * 100} />
      </div>

      <FormControl
        fullWidth
        error={touched.passwordConfirm && !!errors.passwordConfirm}
      >
        <InputLabel htmlFor="entail-create-account-form-password-confirm">
          confirm password
        </InputLabel>
        <ShowPasswordInput
          id="entail-create-account-form-password-confirm"
          name="passwordConfirm"
          value={values.passwordConfirm}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FormHelperText>
          {touched.passwordConfirm && errors.passwordConfirm}
        </FormHelperText>
      </FormControl>

      <TextField
        fullWidth
        name="betakey"
        label="beta key"
        value={values.betakey}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.betakey && !!errors.betakey}
        helperText={touched.betakey && errors.betakey}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip
                title={
                  <>
                    Entail is currently in closed beta.&nbsp;
                    <Link href="https://en.wikipedia.org/wiki/Learning">
                      Learn more
                    </Link>
                  </>
                }
                interactive
              >
                <span className="MuiIconButton-root">
                  <InformationIcon />
                </span>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />

      <KeyboardDatePicker
        fullWidth
        name={dateOfBirthFieldName}
        disableToolbar
        variant="inline"
        label="date of birth"
        format="yyyy-MM-dd"
        value={values.dob}
        onChange={value => setFieldValue(dateOfBirthFieldName, value)}
        onBlur={handleBlur}
        error={touched.dob && !!errors.dob}
        helperText={touched.dob && errors.dob}
      />

      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={isSubmitting}
        >
          sign up
        </Button>
      </div>
    </form>
  );
}

export interface EntailCreateAccountFormProps {
  requiredPasswordStrengthThreshold?: number;
}

/** A form component used to create an account in Entail. */
export function EntailCreateAccountForm(props: EntailCreateAccountFormProps) {
  const {requiredPasswordStrengthThreshold = 2} = props;

  /** The event called when the form is successfully validated and submitted. */
  async function onSubmit(
    values: EntailCreateAccountFormValues,
    formikHelpers: FormikHelpers<EntailCreateAccountFormValues>
  ) {
    /** @todo until a proper back-end API endpoint exsits, log the values */
    console.log(values);
    formikHelpers.setSubmitting(false);
  }

  return (
    <Formik
      // The following typescript error can be ignored.
      onSubmit={onSubmit}
      initialValues={{
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
        betakey: '',
        dob: null,
      }}
      validate={(values: EntailCreateAccountFormValues) => {
        const errors: FormikErrors<EntailCreateAccountFormValues> = {};

        // validate username
        if (!values.username) {
          errors.username = 'required';
        }

        // validate email
        if (!values.email) {
          errors.email = 'required';
        } else {
          if (!isEmailAddress(values.email)) {
            errors.email =
              application.VALIDATION_MESSAGE_EMAIL_MALFORMED_SYNTAX;
          }
        }

        // validate password
        if (!values.password) {
          errors.password = 'required';
        } else {
          const passwordStrength: number = calculatePasswordStrength(
            values.password
          );

          if (passwordStrength < requiredPasswordStrengthThreshold) {
            errors.password = 'password is too weak';
          }
        }

        // validate password confirm
        if (!values.passwordConfirm) {
          errors.passwordConfirm = 'required';
        } else {
          if (values.passwordConfirm !== values.password) {
            errors.passwordConfirm = 'does not match reference password';
          }
        }

        // validate betakey
        if (!values.betakey) {
          errors.betakey = 'required';
        }

        // validate dob
        if (!values.dob) {
          errors.dob = 'required';
        }

        return errors;
      }}
    >
      {EntailCreateAccountFormik}
    </Formik>
  );
}

export default EntailCreateAccountForm;
