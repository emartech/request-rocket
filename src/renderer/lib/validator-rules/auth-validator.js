import { isEmpty } from 'ramda';
import Auth from '../../../common/auth-types';

export default {
  validationError(auth) {
    if (auth.selected !== Auth.NONE) {
      if (auth.params === undefined || isEmpty(auth.params)) {
        return { type: 'auth', message: 'Auth parameters must be provided' };
      }

      const missingParams = Object.entries(auth.params).reduce((accumulator, param) => {
        const [paramName, paramValue] = param;
        if (isEmpty(paramValue)) {
          accumulator.push(paramName);
        }

        return accumulator;
      }, []);

      if (missingParams.length > 0) {
        return { type: 'auth', message: 'All auth parameters must be filled out' };
      }
    }

    return null;
  }
};
