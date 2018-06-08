const user = JSON.parse(localStorage.getItem('user'));
export class POST {
  content: string;
  created_by;
  date;
  private:boolean = false;
  blocked:boolean = false;
  drafted:boolean = false;
  images = [];
  replyingTopicId?
  constructor(){}
}