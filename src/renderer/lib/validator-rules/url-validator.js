import { URL } from 'url';

export default {
  validationError(urlString) {
    if (!urlString) {
      return { type: 'url', message: 'URL cannot be empty' };
    }

    try {
      new URL(urlString); // eslint-disable-line
    } catch (error) {
      return { type: 'url', message: 'URL is malformed' };
    }

    return null;
  }
};
