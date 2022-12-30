import { returnSuccess } from "./base";

export function setFlagQuery(args: object): GameActionResult
{
    args;
    return returnSuccess();
}

export function setFlagExecute(args: object): GameActionResult
{
    // @ts-ignore
    const entity = map.getEntity(args.guestId);
    const guest: Guest = <Guest>entity;
    // @ts-ignore
    const key: PeepFlags = args.key;
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
    return { "guestId": guest.id, "key": key, "value": value};
}