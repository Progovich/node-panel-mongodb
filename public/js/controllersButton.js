/* eslint-disable */
import axios from 'axios';
import { allert } from './allert';

const createdButton = (className, id, text = '') => {
  const button = document.createElement('button');
  button.className = className;
  button.id = id;
  button.innerText = text;
  return button;
};

export const editDocument = (elem) => {
  //save to localstore. If user to press cancel
  const numberRow = elem.classList[1];
  const elemRow = document.querySelector(`.row-content.${numberRow}`);
  const elemEditable = elemRow.querySelectorAll('.edit');
  localStorage.setItem(elemRow.firstElementChild.textContent, elemRow.innerHTML);
  for (let i = 0; i < elemEditable.length; i++) {
    elemEditable[i].contentEditable = true;
  }
  //change button
  elem.nextSibling.replaceWith(createdButton(`cancel_button ${numberRow}`, 'cancel', '❎'));
  elem.replaceWith(createdButton(`save_button ${numberRow}`, 'save', '✔'));
};

export const cancelEdit = (elem) => {
  const numberRow = elem.classList[1];
  const elemRow = document.querySelector(`.row-content.${numberRow}`);
  for (const key in localStorage) {
    if (key === elemRow.firstChild.innerText) {
      elemRow.innerHTML = localStorage[key];
    }
  }
  //change button
  elem.previousSibling.replaceWith(createdButton(`edit_button ${numberRow}`, 'edit'));
  elem.replaceWith(createdButton(`delete_button ${numberRow}`, 'delete'));
};

export const deleteDocument = async (elem) => {
  const numberRow = elem.classList[1];
  const elemRow = document.querySelector(`.row-content.${numberRow}`);
  const res = await axios({
    method: 'DELETE',
    url: '/',
    data: { _id: elemRow.firstChild.innerText },
  });
  elemRow.remove();
};

export const saveDocument = async (elem) => {
  //Send to server for mongo
  const numberRow = elem.classList[1];
  const elemRow = document.querySelector(`.row-content.${numberRow}`);
  const elemEditable = elemRow.querySelectorAll('.edit');
  const data = {};
  for (let i = 0; i < elemEditable.length; i++) {
    data[elemEditable[i].classList[0]] = elemEditable[i].innerText;
    elemEditable[i].contentEditable = false;
  }
  data._id = elemRow.firstChild.innerText;
  const res = await axios({ method: 'PUT', url: '/', data: data });
  //change buttonD
  elem.nextSibling.replaceWith(createdButton(`delete_button ${numberRow}`, 'delete'));
  elem.replaceWith(createdButton(`edit_button ${numberRow}`, 'edit'));
};

export const pagePrevious = async () => {
  let numberPage = location.pathname.match(/\d+$/)[0];
  const lastPage = document.querySelector('#pagelast').getAttribute('href').match(/\d+$/)[0];
  if (numberPage !== '1') {
    numberPage--;
    location.assign(`/page/${numberPage}`);
  } else {
    allert('Вы на первой странице', { type: 'danger', align: 'top-left' });
  }
};

export const pageNext = async () => {
  let numberPage = location.pathname.match(/\d+$/)[0];
  const lastPage = document.querySelector('#pagelast').getAttribute('href').match(/\d+$/)[0];
  if (numberPage !== lastPage) {
    numberPage++;
    location.assign(`/page/${numberPage}`);
  } else {
    allert('Вы на последней странице', { type: 'danger', align: 'top-left' });
  }
};
