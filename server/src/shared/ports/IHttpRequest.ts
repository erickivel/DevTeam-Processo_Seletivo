export interface IHttpRequest {
  user?: {
    id?: string;
  };
  body?: any;
  query?: any;
  params?: any;
};