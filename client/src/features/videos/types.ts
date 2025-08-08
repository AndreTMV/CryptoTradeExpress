import { IUser } from "../auth/types";

export interface ISection {
  id: number;
  name: string;
}
export interface IVideo {
  id: number;
  username: IUser;
  url: string;
  views: number;
  date_uploaded: string;
  stars: number;
  title: string;
  section: ISection | null;
  accepted: boolean;
}
