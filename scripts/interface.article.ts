export interface Article {
  link: string;
  title: string;
  dateTime: string;
  description: string;
  tags?: string[];
  id?: number;
  draft?: boolean;
}
