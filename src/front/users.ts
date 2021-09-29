import type { User } from '../promo/dal';
import { EScenarioStatus, IApiResponse } from '../promo/system_models';

interface IApiUser extends Omit<User, 'created_at'> {
   created_at: string;
}

(() => {
   const USERS_URL = 'api/users';
   const TBODY = document.body.querySelector('tbody');
   if (TBODY === null) {
      throw new Error('incomplete html');
   }

   let pass = '';

   const render = (users: IApiUser[]): void => {
      const oldTrs = document.body.querySelectorAll('tr:not(.thead)');
      oldTrs.forEach((tr) => tr.remove());

      users.forEach((item) => {
         const tr = document.createElement('tr');
         tr.innerHTML = `<td>${ item.ID }</td>`
            + `<td>${ item.firstname }</td>`
            + `<td>${ item.phone }</td>`
            + `<td>${ item.birthdate }</td>`
            + `<td>${ item.created_at.split('T')[0] }</td>`
            + `<td><ul>${
               item.promo.map((pr) => `<li><span>${ pr.promocode }${ pr.activated_at === null ? '' : '<br>(активирован)'}</li>`)
            }</ul></td>`;
         TBODY.append(tr);
      });
   };

   const fetchUsers = (): Promise<IApiResponse<IApiUser[]>> => {
      return fetch(USERS_URL, {headers: {authorization: pass}})
      .then((raw) => {
         if (raw.ok !== true) {
               throw new Error('fuck');
         }
         return raw.json();
      });
   };

   const handleAuthorized = (): Promise<IApiResponse<IApiUser[]>> => {
      pass = prompt('Введите пароль') || '';
      return fetchUsers();
   };

   const handleApiData = (data: IApiResponse<IApiUser[]>): void => {
      switch (data.status) {
         case EScenarioStatus.SCENARIO_SUCCESS:
            return render(data.payload as IApiUser[]);

         case EScenarioStatus.UNAUTHORIZED:
            handleAuthorized().then(handleApiData);
            return;

         case EScenarioStatus.SYSTEM_ERROR:
            throw new Error('Не удалось получить данные');

         default:
            throw new Error('Неизвестный статус ответа');
      }
   };

   window.addEventListener('load', () => {
      fetchUsers().then((result) => handleApiData(result));
   }, {once: true});
})();