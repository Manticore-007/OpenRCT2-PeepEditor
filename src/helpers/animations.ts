const AnimationFriendlyNames = {
        "walking": "Walking",
        "watchRide": "Standing",
        "wave": "Scratching head",
        "hanging": "Hanging",
        "staffMower": "Mowing",
        "staffSweep": "Sweeping",
        "drowning": "Drowning",
        "staffAnswerCall": "Answering long call",
        "staffAnswerCall2": "Answering short call",
        "staffCheckBoard": "Inspecting",
        "staffFix": "Fixing",
        "staffFix2": "Fixing, hurting toe",
        "staffFixGround": "Fixing laying down",
        "staffFix3": "Fixing, kicking",
        "staffWatering": "Watering",
        "joy": "Jumping joyfully",
        "staffEmptyBin": "Emptying bin",
        "wave2": "Waving",
        "checkTime": "Checking time",
        "eatFood": "Eating",
        "shakeHead": "Shaking head",
        "emptyPockets": "Checking pockets",
        "holdMat": "Holding mat",
        "sittingIdle": "Sitting",
        "sittingEatFood": "Sitting eating",
        "sittingLookAroundLeft": "Sitting looking left",
        "sittingLookAroundRight": "Sitting looking right",
        "wow": "Eyepopping",
        "throwUp": "Throwing up",
        "jump": "Jumping",
        "readMap": "Reading map",
        "takePhoto": "Taking photo",
        "clap": "Clapping",
        "disgust": "Stepping in vomit",
        "drawPicture": "Painting",
        "beingWatched": "Looking around",
        "withdrawMoney": "Withdrawing money"
}

export function animationList(value: StaffAnimation | GuestAnimation): string{
    return AnimationFriendlyNames[value];
}