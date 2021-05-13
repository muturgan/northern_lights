import type { User } from '../promo/dal';

interface IApiUser extends Omit<User, 'created_at'> {
    created_at: string;
}

(() => {
    const USERS_URL = 'api/users';
    const TBODY = document.body.querySelector('tbody');
    if (TBODY === null) {
        throw new Error('incomplete html');
    }

    const render = (users: IApiUser[]) => {
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
                    item.promo.map((pr) => `<li><span>${ pr.promocode }${ pr.activated_at === null ? '' : '(активирован)'}</li>`)
                }</ul></td>`;
            TBODY.append(tr);
        });
    };

    const fetchUsers = (): Promise<IApiUser[]> => {
        return fetch(USERS_URL)
        .then((raw) => {
            if (raw.ok !== true) {
                throw new Error('fuck');
            }
            return raw.json();
        });
    };
    
    window.addEventListener('load', () => {
        fetchUsers().then((users) => render(users));
    });
})();