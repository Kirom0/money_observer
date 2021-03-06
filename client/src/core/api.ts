import { getToken } from './authentication';
import { IRecord } from '../interfaces/IRecord';

function POSTRequest(uri, body, method='POST') {
  return fetch(uri, {
    method,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(body),
  });
}

export const api = {
  auth: async (body) => {
    return await
      POSTRequest('/api/auth', body)
        .then((res) => res.json());
  },
  recordsGet: async (from : string, to : string) => {
    return (await
        fetch(`/api/records/get/${from}-${to}/${getToken()}`)
        .then((res) => res.json()))
        .map(_BrTFr);
  },
  recordsUpdate: async (record : IRecord) => {
    return await
      POSTRequest(
        '/api/records/update',
        {..._FrTBr(record), token: getToken()},
        'PUT'
      ).then((res) => res.json());
  },
  recordsNew: async (record : IRecord) => {
    return _BrTFr(await
      POSTRequest(
        '/api/records/new',
        {..._FrTBr(record), token: getToken()},
      ).then((res) => res.json()));
  },
  recordsDelete: async (record : IRecord) => {
    return _BrTFr(await
      POSTRequest(
        '/api/records/delete',
        {..._FrTBr(record), token: getToken()},
        'DELETE'
      ).then((res) => res.json()));
  }
}

// Backend Record to Frontend Record
function _BrTFr(backendRecord) : IRecord {
  const record : IRecord = {
    id: backendRecord._id,
    title: backendRecord.title,
    amount: backendRecord.amount,
    date: backendRecord.date.replace(/\./g, '-'),
    order: backendRecord.order,
  }
  if (backendRecord.description) {
    record.description = backendRecord.description;
  }
  return record;
}

// Frontend Record to Backend Record
function _FrTBr(record : IRecord) {
  const backendRecord = {...record};
  backendRecord.date = record.date.replace(/-/g, '.');
  return backendRecord;
}
