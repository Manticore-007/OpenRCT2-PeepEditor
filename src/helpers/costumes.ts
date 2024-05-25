

const costumeFriendlyNames = {
    "none": "{INLINE_SPRITE}{114}{21}{0}{0}  No costume",
    "handyman": "Handyman",
    "mechanic": "Mechanic",
    "security1": "Security Guard",
    "security2": "Security Guard",
    "panda": "{INLINE_SPRITE}{254}{19}{0}{0} Panda",
    "tiger": "{INLINE_SPRITE}{255}{19}{0}{0} Tiger",
    "elephant" : "{INLINE_SPRITE}{0}{20}{0}{0} Elephant",
    "roman": "{INLINE_SPRITE}{1}{20}{0}{0} Roman",
    "gorilla": "{INLINE_SPRITE}{2}{20}{0}{0} Gorilla",
    "snowman": "{INLINE_SPRITE}{3}{20}{0}{0} Snowman",
    "knight": "{INLINE_SPRITE}{4}{20}{0}{0} Knight",
    "astronaut": "{INLINE_SPRITE}{5}{20}{0}{0} Astronaut",
    "bandit": "{INLINE_SPRITE}{6}{20}{0}{0} Bandit",
    "sheriff": "{INLINE_SPRITE}{7}{20}{0}{0} Sherrif",
    "pirate": "{INLINE_SPRITE}{8}{20}{0}{0} Pirate"
}

export function costumeList(value: StaffCostume): string{
    return costumeFriendlyNames[value]
}