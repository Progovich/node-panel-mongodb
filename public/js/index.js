/* eslint-disable */
import '@babel/polyfill';
import { login } from './login';
import {
  editDocument,
  deleteDocument,
  cancelEdit,
  saveDocument,
  pageNext,
  pagePrevious,
} from './controllersButton';

const username = document.querySelector('#username');
const password = document.querySelector('#password');

if (username && password) {
  document.querySelector('.auth').addEventListener('submit', (e) => {
    e.preventDefault();
    login(username.value, password.value);
  });
}

const panelPage = document.querySelector('.row-content');

// delegate events for buttons
if (panelPage) {
  document.querySelector('#main').onclick = () => {
    const { target } = event;
    switch (target.id) {
      case 'edit':
        editDocument(target);
        break;
      case 'delete':
        deleteDocument(target);
        break;
      case 'save':
        saveDocument(target);
        break;
      case 'cancel':
        cancelEdit(target);
        break;
      case 'pagenext':
        pageNext(target);
        break;
      case 'pageprevious':
        pagePrevious(target);
        break;
      default:
        break;
    }
  };
}
