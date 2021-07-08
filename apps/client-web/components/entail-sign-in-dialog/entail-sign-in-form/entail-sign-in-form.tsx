import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  TextField,
} from '@material-ui/core';
import {Formik, FormikErrors, FormikHelpers, FormikProps} from 'formik';

import React from 'react';
import {ShowPasswordInput} from '../../show-password-input/show-password-input';
import {application} from '../../../lib/application-constants';
import {isEmailAddress} from '@entail/business-logic';
import {useAccounts} from '../../../lib/use-accounts';

interface EntailSignInFormValues {
  email: string;
  password: string;
}

/** The underlying form component for EntailSignInForm. */
function EntailSignInFormik(
  props: FormikProps<EntailSignInFormValues>
): React.ReactNode {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = props;

  return (
    <form noValidate onSubmit={handleSubmit}>
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

      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={isSubmitting}
        >
          log in
        </Button>
      </div>
    </form>
  );
}

/** A form component used to sign the user in to Entail. */
export function EntailSignInForm() {
  const [, setAccounts] = useAccounts('/profile/about', true);

  /** The event called when the form is successfully validated and submitted. */
  async function onSubmit(
    values: EntailSignInFormValues,
    formikHelpers: FormikHelpers<EntailSignInFormValues>
  ) {
    /** @todo replace with fetch to backend */
    fetch('/api/sign-in')
      .then(response => response.json())
      .then(data => setAccounts(data))
      .catch(err => console.log(err));

    formikHelpers.setSubmitting(false);
  }

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{
        email: '',
        password: '',
      }}
      validate={(values: EntailSignInFormValues) => {
        const errors: FormikErrors<EntailSignInFormValues> = {};

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
        }

        return errors;
      }}
    >
      {EntailSignInFormik}
    </Formik>
  );
}

export default EntailSignInForm;
