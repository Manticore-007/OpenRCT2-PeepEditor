import { Colour, compute, store } from "openrct2-flexui";
const windowTitle = "Peep Editor";

export class peepViewModel
{
    //general

    readonly _selectedPeep = store<Guest | Staff | undefined>(undefined);
    readonly _name = store<string>(windowTitle);
    readonly _destination = store<CoordsXYZ | null>(null);
    readonly _energy = store<number>(96);
    readonly _energyTarget = store<number>(96);
    readonly _x = store<number>(0);
    readonly _y = store<number>(0);
    readonly _z = store<number>(0);
    readonly _availableAnimations = store<GuestAnimation[] | StaffAnimation[]>([]);
    readonly _animationFrame = store<number>(0);
    readonly _animationLength = store<number>(1);
    readonly _animation = store<GuestAnimation | StaffAnimation>();


    //staff
    
    readonly _staffType = store<StaffType>("handyman");
    readonly _colour = store<number>(100);
    readonly _availableCostumes = store<StaffCostume[]>([]);
    readonly _costume = store<StaffCostume>("none");
    readonly _orders = store<number>(0);
    readonly _patrolArea = store<PatrolArea | null>(null);
    readonly _availableStaffAnimations = store<StaffAnimation[]>([]);


    //guest

    readonly _tshirtColour = store<number>(19);
    readonly _trousersColour = store<number>(19);
    readonly _balloonColour = store<number>(19);
    readonly _hatColour = store<number>(19);
    readonly _umbrellaColour = store<number>(19);
    readonly _happiness = store<number>(0);
    readonly _happinessTarget = store<number>(0);
    readonly _nausea = store<number>(0);
    readonly _nauseaTarget = store<number>(0);
    readonly _hunger = store<number>(0);
    readonly _thirst = store<number>(0);
    readonly _toilet = store<number>(0);
    readonly _mass = store<number>(0);
    readonly _minIntensity = store<number>(0);
    readonly _maxIntensity = store<number>(0);
    readonly _nauseaTolerance = store<number>(0);
    readonly _cash = store<number>(0);
    readonly _isInPark = store<boolean>(false);
    readonly _isLost = store<boolean>(false);
    readonly _lostCountdown = store<number>(0);
    readonly _thoughts = store<Thought[]>([]);
    readonly _items = store<GuestItem[]>([]);
    readonly _hasItem = store<boolean>(false);
    readonly _hasHat = store<boolean>(false);
    readonly _hasBalloon = store<boolean>(false);
    readonly _hasUmbrella = store<boolean>(false);
    readonly _availableGuestAnimations = store<GuestAnimation[]>([]);
    readonly _flags = store<number>(0);


    //custom

    readonly _image = store<number>(6430 | (Colour.SalmonPink) << 19 | (Colour.SalmonPink << 24) | (0b111 << 29))
    readonly _isGuest = store<boolean>(false);
    readonly _isStaff = store<boolean>(false);
    readonly _isHandyman = store<boolean>(false);
    readonly _isMechanic = store<boolean>(false);
    readonly _isSecurity = store<boolean>(false);
    readonly _isEntertainer = store<boolean>(false);
    readonly _isPicking = store<boolean>(false);
    readonly _isFrozen = compute(this._selectedPeep, p => (p?.energy === 0) ? true : false);
    readonly _isPeepSelected = compute(this._selectedPeep, p => (p) ? false : true);

    private _onGameTick?: IDisposable;

    constructor() {
    }

    _open(): void
    {
        this._onGameTick = context.subscribe("interval.tick", () => this._onGameTickExecuted())
    }

    _reset(): void
    {
        this._selectedPeep.set(undefined);
        this._isFrozen.set(false);
        this._name.set(windowTitle);
        this._availableAnimations.set([]);
        this._x.set(0);
        this._y.set(0);
        this._z.set(0);
        this._energy.set(96);
        this._isStaff.set(false);
        this._isGuest.set(false);
        this._colour.set(100);
        this._animation.set("walking");
        this._animationLength.set(1);
        this._isHandyman.set(false);
        this._isMechanic.set(false);
        this._isSecurity.set(false);
        this._isEntertainer.set(false);
        this._orders.set(0);
    }

    _dispose(): void
    {
        if (this._onGameTick)
        {
            this._onGameTick.dispose();
        }
        this._onGameTick = undefined;
    }

    _select(peep: Guest | Staff): void
    {
        this._selectedPeep.set(peep)
    }

    _tabImage(peep: Guest | Staff): void {

        if (peep !== undefined && peep.type === "guest") {
            this._image.set(6430 | (this._tshirtColour.get() << 19) | (this._trousersColour.get() << 24) | (0b111 << 29));
        }
        else if (peep !== undefined && peep.type === "staff") {
            const staff = <Staff>peep;
            switch (staff.staffType) {
                case "handyman":
                    this._image.set(11286 | (this._colour.get() << 19) | (0b111 << 29));
                    break;
                case "mechanic":
                    this._image.set(11466 | (this._colour.get() << 19) | (0b111 << 29));
                    break
                case "security":
                    this._image.set(11906 | (this._colour.get() << 19) | (0b111 << 29));
                    break
                case "entertainer":
                    this._image.set(0);
                    break;
            }
        }
    }

    _onGameTickExecuted(): void {
        const peep = this._selectedPeep.get();
        const staff = <Staff>peep;
        const guest = <Guest>peep;
        if (peep !== undefined)
        {
            this._x.set(peep.x);
            this._y.set(peep.y);
            this._z.set(peep.z);
            this._name.set(peep.name);
            this._energy.set(peep.energy);
            this._availableAnimations.set(peep.availableAnimations);
            // this._animation.set(peep.animation);
            // this._animationFrame.set(peep.animationOffset);
            // this._animationLength.set(peep.animationLength);
            // peep.energy === 0 ? this._isFrozen.set(true) : this._isFrozen.set(false);
            if (peep.peepType === "staff"){
                this._isStaff.set(true); this._isGuest.set(false)
                this._colour.set(staff.colour);
                this._staffType.set(staff.staffType);
                staff.staffType === "handyman"? this._isHandyman.set(true) : this._isHandyman.set(false);
                staff.staffType === "mechanic"? this._isMechanic.set(true) : this._isMechanic.set(false);
                staff.staffType === "security"? this._isSecurity.set(true) : this._isSecurity.set(false);
                staff.staffType === "entertainer"? this._isEntertainer.set(true) : this._isEntertainer.set(false);
                this._availableCostumes.set(staff.availableCostumes);
                this._costume.set(<StaffCostume>staff.costume);
                this._availableStaffAnimations.set(staff.availableAnimations);
                this._orders.set(staff.orders);
            }
            if (peep.peepType === "guest"){
                this._isGuest.set(true); this._isStaff.set(false);
                this._tshirtColour.set(guest.tshirtColour);
                this._trousersColour.set(guest.trousersColour);
                this._hatColour.set(guest.hatColour);
                this._balloonColour.set(guest.balloonColour);
                this._umbrellaColour.set(guest.umbrellaColour);
                this._availableGuestAnimations.set(guest.availableAnimations);
                guest.hasItem({type: "hat"})? this._hasHat.set(true) : this._hasHat.set(false);
                guest.hasItem({type: "balloon"})? this._hasBalloon.set(true) : this._hasBalloon.set(false);
                guest.hasItem({type: "umbrella"})? this._hasUmbrella.set(true) : this._hasUmbrella.set(false);
            }
        }
    }
}

export const model = new peepViewModel;