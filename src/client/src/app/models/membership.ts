export class Membership {
  constructor(
    public id: string,
    public uuid: string,
    public user: Object,
    public course: Object,
    public userId: String,
    public courseId: String,
    public childCourseId: String,
    public courseRoleId: String,
    public created: string,
    public availability: Object,

  ) { }

}
