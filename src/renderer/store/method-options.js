import HttpMethod from '../../common/method-types';

export default [
  {
    id: HttpMethod.GET,
    label: 'GET',
    isBodyAllowed: false
  },
  {
    id: HttpMethod.POST,
    label: 'POST',
    isBodyAllowed: true
  },
  {
    id: HttpMethod.PUT,
    label: 'PUT',
    isBodyAllowed: true
  },
  {
    id: HttpMethod.PATCH,
    label: 'PATCH',
    isBodyAllowed: true
  },
  {
    id: HttpMethod.DELETE,
    label: 'DELETE',
    isBodyAllowed: true
  },
  {
    id: HttpMethod.OPTIONS,
    label: 'OPTIONS',
    isBodyAllowed: true
  },
  {
    id: HttpMethod.HEAD,
    label: 'HEAD',
    isBodyAllowed: false
  }
];
