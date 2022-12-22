import {returnSuccess} from "./base";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function setFlagQuery(args: object): GameActionResult
{
    return returnSuccess();
}

export function setFlagExecute(args: object): GameActionResult
{
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const entity = map.getEntity(args.guestId);
    const guest: Guest = <Guest>entity;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const key: PeepFlags = args.key;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const value: boolean = args.value;

    return setFlag(guest, key, value);
}

function setFlag(guest: Guest, key: PeepFlags, value: boolean): GameActionResult
{
    guest.setFlag(key, value);
    return returnSuccess();
}

export function setFlagExecuteArgs(guest: Guest, key: PeepFlags, value: boolean): object
{
    return { "guestId": guest.id, "key": key, "value": value };
}

