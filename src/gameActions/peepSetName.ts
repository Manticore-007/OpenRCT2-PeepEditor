import { PeepName } from "../../lib/interfaces";

export function setPeepNameQuery(args: PeepName): GameActionResult
{
    args;
    return {};
}

export function setPeepNameExecute(args: PeepName): GameActionResult
{
	if (args.peepId === null) {return {};}
    const entity = map.getEntity(args.peepId);
    const peep: Guest | Staff = <Guest|Staff>entity;
	const text: string = args.text;

    return setPeepName(peep, text);
}

export function setPeepName(peep: Staff | Guest, text: string): GameActionResult
{	
	peep.name = text;
    return {};
}

export function setPeepNameExecuteArgs(peep: Guest | Staff, text: string): PeepName
{
    return {"peepId": peep.id, text: text};
}