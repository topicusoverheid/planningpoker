export default interface User {
    peerId: string,
    name: string,
    points: number | undefined,
    voted: boolean
}