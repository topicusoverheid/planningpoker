import User from "./User";

export default interface State {
    subject: string,
    users: User[],
    pokerPoints: string,
    sharingScreen: boolean
}