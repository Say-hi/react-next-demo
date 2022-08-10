import "iron-session";

declare module "iron-session" {
  interface IronSessionData {
    verifyCode?: number;
    id?: number;
    nickname?: string;
    avatar?: string;
    userId?: number
  }
}
