/* eslint-disable */
import axios from 'axios';
import { allert } from './allert';

export const login = async (username, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: location.href,
      data: {
        username,
        password,
      },
    });

    if (res.data.status === 'success') {
      allert('Success!', { type: 'success', align: 'top-left' });
      window.setTimeout(() => {
        location.assign('/page/1');
      }, 1500);
    }
  } catch (err) {
    allert(err.response.data.message, { type: 'danger', align: 'top-left' });
  }
};
