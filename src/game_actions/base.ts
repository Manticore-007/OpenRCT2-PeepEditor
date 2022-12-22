export function returnSuccess(): GameActionResult
{
    return {
        cost: 0,
        expenditureType: "landscaping",
        position: {
            x: -1,
            y: -1,
            z: 0
        }
    };
}
