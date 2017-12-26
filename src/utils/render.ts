import { Nullable } from './Nullable';

export const render = (data:string, endpoint:Nullable<HTMLElement>) => {
    if (endpoint != null) endpoint.innerHTML = data;
};