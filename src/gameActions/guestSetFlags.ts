import { PeepFlagsArgs } from "../../lib/interfaces";

export function setFlagQuery(args: PeepFlagsArgs): GameActionResult
{
    args;
    return {};
}

export function setFlagExecute(args: PeepFlagsArgs): GameActionResult
{
    if(args.guestId === null) {return {};}
    const entity = map.getEntity(args.guestId);
    const guest: Guest = <Guest>entity;
    const key: PeepFlags = args.key;
    const value: boolean = args.value;

    return setFlag(guest, key, value);
}

function setFlag(guest: Guest, key: PeepFlags, value: boolean): GameActionResult
{
    guest.setFlag(key, value);
    return {};
}

export function setFlagExecuteArgs(guest: Guest, key: PeepFlags, value: boolean): PeepFlagsArgs
{
    return { "guestId": guest.id, "key": key, "value": value};
}